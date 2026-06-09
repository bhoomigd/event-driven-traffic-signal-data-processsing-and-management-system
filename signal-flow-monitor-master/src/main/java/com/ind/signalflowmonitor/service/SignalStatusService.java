package com.ind.signalflowmonitor.service;

import com.ind.trafficsignaldomain.dto.SignalLiveStatusDTO;
import com.ind.signalflowmonitor.repository.RawTrafficSignalUpdatesRepository;
import com.ind.trafficsignaldomain.entity.RawTrafficSignalUpdates;
import com.ind.trafficsignaldomain.entity.ManualOverride;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class SignalStatusService {
    private final RawTrafficSignalUpdatesRepository rawRepo;
    private final RuleEvaluationService ruleEvaluationService;
    private final ManualOverrideService manualOverrideService;

    public SignalStatusService(
            RawTrafficSignalUpdatesRepository rawRepo,
            RuleEvaluationService ruleEvaluationService,
            ManualOverrideService manualOverrideService
    ) {
        this.rawRepo = rawRepo;
        this.ruleEvaluationService = ruleEvaluationService;
        this.manualOverrideService = manualOverrideService;
    }

    public List<SignalLiveStatusDTO> getAllCurrentStatuses() {
        List<RawTrafficSignalUpdates> latestPerSignal = rawRepo.findLatestPerSignal();

        List<SignalLiveStatusDTO> result = new ArrayList<>();
        for (RawTrafficSignalUpdates raw : latestPerSignal) {

            // Manual override check
            ManualOverride manualOverride = manualOverrideService.getOverride(raw.getSignalId());
            boolean isOverrideActive = manualOverrideService.isOverrideActive(manualOverride);

            // Use rules engine for congestion
            boolean congested = false;
            if (!isOverrideActive) {
                congested = ruleEvaluationService.isCongestedByRule(raw);
            }

            SignalLiveStatusDTO dto = new SignalLiveStatusDTO();
            dto.setSignalId(raw.getSignalId());
            dto.setSignalLocation(raw.getSignalLocation());
            dto.setLmvCount(raw.getLmvCount());
            dto.setMcwgCount(raw.getMcwgCount());
            dto.setMgvCount(raw.getMgvCount());
            dto.setHmvCount(raw.getHmvCount());
            dto.setHtvCount(raw.getHtvCount());
            dto.setTimestamp(raw.getTimestamp());
            dto.setCongested(congested);

            dto.setManualOverrideActive(isOverrideActive);
            if (isOverrideActive && manualOverride != null) {
                dto.setManualOverrideAction(manualOverride.getOverrideAction());
            }

            result.add(dto);
        }
        return result;
    }
}
