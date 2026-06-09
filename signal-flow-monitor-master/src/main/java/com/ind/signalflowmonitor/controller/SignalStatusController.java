package com.ind.signalflowmonitor.controller;

import com.ind.signalflowmonitor.service.SignalStatusService;
import com.ind.trafficsignaldomain.dto.SignalLiveStatusDTO;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/signals")
public class SignalStatusController {
    private final SignalStatusService statusService;
    public SignalStatusController(SignalStatusService statusService) {
        this.statusService = statusService;
    }

    @GetMapping("/status")
    public List<SignalLiveStatusDTO> liveStatuses() {
        return statusService.getAllCurrentStatuses();
    }
}
