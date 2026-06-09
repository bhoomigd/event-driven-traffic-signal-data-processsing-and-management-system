package com.ind.signalflowmonitor.controller;

import com.ind.trafficsignaldomain.entity.ManualOverride;
import com.ind.signalflowmonitor.service.ManualOverrideService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/manual-overrides")
@Tag(name = "Manual Override API", description = "Manage manual overrides for traffic signals")
public class ManualOverrideController {

    private final ManualOverrideService overrideService;

    public ManualOverrideController(ManualOverrideService overrideService) {
        this.overrideService = overrideService;
    }

    @Operation(summary = "Get all manual overrides")
    @GetMapping
    public List<ManualOverride> getAll() {
        return overrideService.getAllOverrides();
    }

    @Operation(summary = "Get manual override by signal ID")
    @GetMapping("/{signalId}")
    public ResponseEntity<ManualOverride> getBySignalId(@PathVariable String signalId) {
        ManualOverride override = overrideService.getOverride(signalId);
        if (override == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(override);
    }

    @Operation(summary = "Create or update a manual override")
    @PutMapping("/{signalId}")
    public ResponseEntity<ManualOverride> createOrUpdate(@PathVariable String signalId,
                                                         @RequestBody ManualOverride manualOverride,
                                                         @RequestHeader(value = "X-User", defaultValue = "system") String user) {
        manualOverride.setSignalId(signalId);
        ManualOverride saved = overrideService.createOrUpdateOverride(manualOverride, user);
        return ResponseEntity.ok(saved);
    }

    @Operation(summary = "Delete manual override")
    @DeleteMapping("/{signalId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable String signalId) {
        overrideService.deleteOverride(signalId);
    }
}
