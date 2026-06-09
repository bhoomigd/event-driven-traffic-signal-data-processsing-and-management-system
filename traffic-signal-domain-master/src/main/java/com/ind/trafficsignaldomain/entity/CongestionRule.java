package com.ind.trafficsignaldomain.entity;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Table(name = "congestion_rules")
public class CongestionRule {

    private static final ObjectMapper mapper = new ObjectMapper();

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String signalId;      // Rule applies to this signal

    @Column(nullable = false, length = 2000)
    private String ruleExpressionJson;  // JSON/DSL expression for this rule

    private boolean enabled;

    private String description;

    // Transient field for in-memory use only (not persisted)
    @Transient
    private com.ind.trafficsignaldomain.dto.SimpleRule ruleExpression;

    @PostLoad
    private void postLoad() {
        try {
            if (ruleExpressionJson != null && !ruleExpressionJson.isEmpty()) {
                ruleExpression = mapper.readValue(ruleExpressionJson, com.ind.trafficsignaldomain.dto.SimpleRule.class);
            }
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            // handle or log error
        }
    }

    @PrePersist
    @PreUpdate
    private void prePersist() {
        try {
            if (ruleExpression != null) {
                ruleExpressionJson = mapper.writeValueAsString(ruleExpression);
            }
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            // handle or log error
        }
    }

}
