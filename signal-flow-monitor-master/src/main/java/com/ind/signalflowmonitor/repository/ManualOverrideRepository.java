package com.ind.signalflowmonitor.repository;

import com.ind.trafficsignaldomain.entity.ManualOverride;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ManualOverrideRepository extends JpaRepository<ManualOverride, String> {
    // findBySignalId inherited from JpaRepository
}
