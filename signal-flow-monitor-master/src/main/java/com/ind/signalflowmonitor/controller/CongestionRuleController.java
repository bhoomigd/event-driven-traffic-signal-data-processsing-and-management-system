package com.ind.signalflowmonitor.controller;

import com.ind.trafficsignaldomain.dto.CongestionRuleDTO;
import com.ind.trafficsignaldomain.entity.CongestionRule;
import com.ind.signalflowmonitor.repository.CongestionRuleRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/congestion-rules")
@Tag(name = "Congestion Rules", description = "Manage congestion rules per signal")
public class CongestionRuleController {

    private final CongestionRuleRepository repo;

    public CongestionRuleController(CongestionRuleRepository repo) {
        this.repo = repo;
    }

    private CongestionRuleDTO toDTO(CongestionRule entity) {
        return new CongestionRuleDTO(
                entity.getId(),
                entity.getSignalId(),
                entity.getRuleExpression(),
                entity.isEnabled(),
                entity.getDescription()
        );
    }

    private CongestionRule fromDTO(CongestionRuleDTO dto) {
        CongestionRule entity = new CongestionRule();
        entity.setId(dto.getId());
        entity.setSignalId(dto.getSignalId());
        entity.setRuleExpression(dto.getRuleExpression());
        entity.setEnabled(dto.getEnabled());
        entity.setDescription(dto.getDescription());
        return entity;
    }

    @Operation(summary = "List all rules")
    @GetMapping
    public List<CongestionRuleDTO> getAll() {
        return repo.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Operation(summary = "Get rule by ID")
    @GetMapping("/{id}")
    public ResponseEntity<CongestionRuleDTO> getById(@PathVariable Long id) {
        return repo.findById(id)
                .map(this::toDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Create new rule")
    @PostMapping
    public ResponseEntity<CongestionRuleDTO> create(@Valid @RequestBody CongestionRuleDTO dto) {
        if (dto.getId() != null) {
            return ResponseEntity.badRequest().build();
        }
        CongestionRule saved = repo.save(fromDTO(dto));
        return ResponseEntity.ok(toDTO(saved));
    }

    @Operation(summary = "Update rule")
    @PutMapping("/{id}")
    public ResponseEntity<CongestionRuleDTO> update(@PathVariable Long id, @Valid @RequestBody CongestionRuleDTO dto) {
        return repo.findById(id)
                .map(existing -> {
                    existing.setSignalId(dto.getSignalId());
                    existing.setRuleExpression(dto.getRuleExpression());
                    existing.setEnabled(dto.getEnabled());
                    existing.setDescription(dto.getDescription());
                    repo.save(existing);
                    return ResponseEntity.ok(toDTO(existing));
                }).orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Delete rule")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!repo.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
