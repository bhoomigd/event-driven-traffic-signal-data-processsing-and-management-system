package com.ind.signalflowmonitor.service;

import com.ind.trafficsignaldomain.dto.SimpleRule;
import com.ind.trafficsignaldomain.entity.CongestionRule;
import com.ind.trafficsignaldomain.entity.RawTrafficSignalUpdates;
import com.ind.signalflowmonitor.repository.CongestionRuleRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.time.ZoneOffset;
import java.util.List;

@Service
public class RuleEvaluationService {

    private final CongestionRuleRepository ruleRepo;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public RuleEvaluationService(CongestionRuleRepository ruleRepo) {
        this.ruleRepo = ruleRepo;
    }

    /**
     * Evaluates all enabled congestion rules for a signal against the given traffic update.
     * Returns true if any rule evaluates to true (congestion detected).
     */
    public boolean isCongestedByRule(RawTrafficSignalUpdates update) {
        List<CongestionRule> rules = ruleRepo.findBySignalIdAndEnabledTrue(update.getSignalId());
        for (CongestionRule rule : rules) {
            try {
                // Because ruleExpression is stored as JSON string in DB, deserialize to SimpleRule
                SimpleRule simpleRule = rule.getRuleExpression();
                // If your entity uses transient field populated via @PostLoad, adjust accordingly
                if (simpleRule == null) {
                    // Fallback: parse JSON if necessary
                    simpleRule = objectMapper.readValue(rule.getRuleExpressionJson(), SimpleRule.class);
                }

                if (evaluateSimpleRule(update, simpleRule)) {
                    return true;
                }
            } catch (Exception e) {
                // Log the error and continue evaluating other rules
                System.err.println("Error evaluating rule for signal " + update.getSignalId() + ": " + e.getMessage());
            }
        }
        return false;
    }

    /**
     * Evaluates a single SimpleRule against the traffic signal update.
     * Supports logic: AND, OR, NONE (or empty or null).
     */
    private boolean evaluateSimpleRule(RawTrafficSignalUpdates update, SimpleRule rule) {
        List<SimpleRule.Condition> conditions = rule.getConditions();
        String logic = (rule.getLogic() == null) ? "" : rule.getLogic().trim().toUpperCase();

        // Handle single condition with NONE/no logic specified
        if (conditions.size() == 1 && (logic.isEmpty() || logic.equals("NONE"))) {
            return evaluateCondition(update, conditions.get(0));
        }

        // Normal AND/OR logic for multiple conditions
        boolean result = logic.equals("AND");
        // Get hour of day based on UTC timestamp
        int eventHour = update.getTimestamp().atOffset(ZoneOffset.UTC).getHour();

        for (SimpleRule.Condition cond : conditions) {
            boolean condResult = evaluateCondition(update, cond, eventHour);
            if (logic.equals("AND")) {
                result &= condResult;
            } else if (logic.equals("OR")) {
                result |= condResult;
            }
        }
        return result;
    }

    // Overload without eventHour param, for convenience when only one condition
    private boolean evaluateCondition(RawTrafficSignalUpdates update, SimpleRule.Condition cond) {
        int eventHour = update.getTimestamp().atOffset(ZoneOffset.UTC).getHour();
        return evaluateCondition(update, cond, eventHour);
    }

    /**
     * Evaluates a single condition against the traffic update.
     */
    private boolean evaluateCondition(RawTrafficSignalUpdates update, SimpleRule.Condition cond, int eventHour) {
        String field = cond.getField();
        String operator = cond.getOperator();
        Number value = cond.getValue();

        return switch (field) {
            case "lmvCount" -> compare(update.getLmvCount(), operator, value.longValue());
            case "mcwgCount" -> compare(update.getMcwgCount(), operator, value.longValue());
            case "mgvCount" -> compare(update.getMgvCount(), operator, value.longValue());
            case "hmvCount" -> compare(update.getHmvCount(), operator, value.longValue());
            case "htvCount" -> compare(update.getHtvCount(), operator, value.longValue());
            case "hourOfDay" -> compare(eventHour, operator, value.intValue());
            case "totalVehicleCount" -> {
                long total = update.getLmvCount() + update.getMcwgCount() + update.getMgvCount()
                        + update.getHmvCount() + update.getHtvCount();
                yield compare(total, operator, value.longValue());
            }
            default -> false; // Unknown field – treat as fail or log if desired
        };
    }

    /**
     * Compares actual and reference values using the operator.
     */
    private boolean compare(long actual, String operator, long reference) {
        return switch (operator) {
            case ">" -> actual > reference;
            case "<" -> actual < reference;
            case ">=" -> actual >= reference;
            case "<=" -> actual <= reference;
            case "==" -> actual == reference;
            default -> false; // Unknown operator
        };
    }
}
