package com.ind.signalflowmonitor.repository;


import com.ind.trafficsignaldomain.entity.CongestionRule;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CongestionRuleRepository extends JpaRepository<CongestionRule, Long> {
    List<CongestionRule> findBySignalIdAndEnabledTrue(String signalId);
}
