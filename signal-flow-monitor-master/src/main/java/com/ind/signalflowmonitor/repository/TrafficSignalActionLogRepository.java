package com.ind.signalflowmonitor.repository;

import com.ind.trafficsignaldomain.entity.TrafficSignalActionLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TrafficSignalActionLogRepository extends JpaRepository<TrafficSignalActionLog, Long> {
}
