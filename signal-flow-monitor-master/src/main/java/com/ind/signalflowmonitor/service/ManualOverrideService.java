package com.ind.signalflowmonitor.service;


import com.ind.trafficsignaldomain.entity.ManualOverride;
import com.ind.signalflowmonitor.repository.ManualOverrideRepository;
import jakarta.persistence.criteria.CriteriaBuilder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ManualOverrideService {

    private final ManualOverrideRepository repo;

    public ManualOverrideService(ManualOverrideRepository repo) {
        this.repo = repo;
    }

    public List<ManualOverride> getAllOverrides() {
        return repo.findAll();
    }

    public ManualOverride getOverride(String signalId) {
        return repo.findById(signalId).orElse(null);
    }

    @Transactional
    public ManualOverride createOrUpdateOverride(ManualOverride override, String updatedBy) {
        Instant now = Instant.now();
        if (override.getOverrideStartTime() == null) {
            override.setOverrideStartTime(now);
        }
        override.setLastUpdatedAt(now);
        override.setLastUpdatedBy(updatedBy);
        return repo.save(override);
    }
    @Transactional
    public void deleteOverride(String signalId) {
        repo.deleteById(signalId);
    }

    /**
     * Check if an override is active and has not expired
     */
    public boolean isOverrideActive(ManualOverride override) {
        if (override == null) return false;

        // Indefinite override
        if (override.getDurationSeconds() == null) return true;

        Instant expiry = override.getOverrideStartTime().plusSeconds(override.getDurationSeconds());
        return Instant.now().isBefore(expiry);
    }
}
