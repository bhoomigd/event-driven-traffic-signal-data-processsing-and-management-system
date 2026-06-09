package com.ind.trafficsignaldomain.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Table(name = "traffic_signal_action_log")
public class TrafficSignalActionLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String signalId;
    private String action;
    private String reason;

    @Column(nullable = false)
    private Instant timestamp;
}
