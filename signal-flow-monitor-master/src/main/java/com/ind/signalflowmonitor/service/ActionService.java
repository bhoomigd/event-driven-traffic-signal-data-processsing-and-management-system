package com.ind.signalflowmonitor.service;

import com.ind.signalflowmonitor.repository.TrafficSignalActionLogRepository;
import com.ind.trafficsignaldomain.entity.RawTrafficSignalUpdates;
import com.ind.trafficsignaldomain.entity.TrafficSignalActionLog;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class ActionService {

    private final TrafficSignalActionLogRepository repo;

    public ActionService(TrafficSignalActionLogRepository repo) {
        this.repo = repo;
    }

    public void handleCongestion(RawTrafficSignalUpdates event) {
        String action = "EXTEND_GREEN";
        long total = event.getLmvCount() + event.getMcwgCount() + event.getMgvCount() + event.getHmvCount() + event.getHtvCount();
        String reason = String.format("Congestion detected - lmvCount=%d, total=%d",
                event.getLmvCount(), total);

        TrafficSignalActionLog log = new TrafficSignalActionLog();
        log.setSignalId(event.getSignalId());
        log.setAction(action);
        log.setReason(reason);
        log.setTimestamp(Instant.now());

        repo.save(log);

        // Optionally: Publish control message to Kafka or invoke REST API to signal controller
    }
}