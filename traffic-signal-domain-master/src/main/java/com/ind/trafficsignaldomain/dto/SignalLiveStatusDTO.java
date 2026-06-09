package com.ind.trafficsignaldomain.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class SignalLiveStatusDTO {
    private String signalId;
    private String signalLocation;
    private long lmvCount;
    private long mcwgCount;
    private long mgvCount;
    private long hmvCount;
    private long htvCount;
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private Instant timestamp;

    private boolean congested;
    private boolean manualOverrideActive;
    private String manualOverrideAction;
}