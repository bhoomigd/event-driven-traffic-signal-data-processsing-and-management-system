package com.ind.signalflowmonitor.consumer;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ind.signalflowmonitor.service.ActionService;
import com.ind.signalflowmonitor.service.ManualOverrideService;
import com.ind.signalflowmonitor.service.RuleEvaluationService;
import com.ind.trafficsignaldomain.entity.ManualOverride;
import com.ind.trafficsignaldomain.entity.RawTrafficSignalUpdates;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class TrafficEventConsumer {

    private final RuleEvaluationService ruleEvaluationService;
    private final ActionService actionService;

    private final ManualOverrideService manualOverrideService;
    private final ObjectMapper objectMapper;

    public TrafficEventConsumer(RuleEvaluationService ruleEvaluationService, ActionService actionService, ManualOverrideService manualOverrideService, ObjectMapper objectMapper) {
        this.ruleEvaluationService = ruleEvaluationService;
        this.actionService = actionService;
        this.manualOverrideService = manualOverrideService;
        this.objectMapper = objectMapper;
    }

    @KafkaListener(topics = "traffic_signal_updates_raw", groupId = "signal_flow_monitor_group")
    public void consume(String message) {
        try {
            RawTrafficSignalUpdates event = objectMapper.readValue(message, RawTrafficSignalUpdates.class);

            // Check manual override
            ManualOverride manualOverride = manualOverrideService.getOverride(event.getSignalId());
            if (manualOverrideService.isOverrideActive(manualOverride)) {
                // Manual override active, optionally log or skip automated action
                // Optionally you can emit separate control actions here
                return; // skip auto congestion detection
            }

            // Evaluate congestion based on rules only
            if (ruleEvaluationService.isCongestedByRule(event)) {
                actionService.handleCongestion(event); // Threshold no longer used
            }

        } catch (Exception e) {
            e.printStackTrace();
            // Consider logging or error handling here
        }
    }

}