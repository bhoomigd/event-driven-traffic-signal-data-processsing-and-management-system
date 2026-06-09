package com.ind.trafficsignaldomain.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
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
@Table(name = "raw_traffic_signal_updates")
public class RawTrafficSignalUpdates {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String rtoCode;

    @Column(nullable = false)
    private String rtoLocation;

    @Column(nullable = false)
    private String signalId;

    @Column(nullable = false)
    private String signalLocation;

    @Column(nullable = false)
    private long lmvCount;

    @Column(nullable = false)
    private long mcwgCount;

    @Column(nullable = false)
    private long mgvCount;

    @Column(nullable = false)
    private long hmvCount;

    @Column(nullable = false)
    private long htvCount;

    @Column(nullable = false)
    private Instant timestamp;


}
