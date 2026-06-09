package com.ind.trafficsignaldomain.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "manual_overrides")
public class ManualOverride {

    @Id
    private String signalId;  // signal ID, primary key (one override per signal)

    private String overrideAction;  // e.g., "EXTEND_GREEN", "PAUSE_AUTOMATION"

    private Integer durationSeconds; // Duration in seconds for which override is active; null means indefinite

    private Instant overrideStartTime; // When override started (UTC timestamp)

    private String lastUpdatedBy;  // Admin username or system user who updated

    private Instant lastUpdatedAt; // Timestamp of last update (UTC)
}
