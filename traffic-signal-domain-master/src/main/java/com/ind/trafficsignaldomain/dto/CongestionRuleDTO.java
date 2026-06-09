package com.ind.trafficsignaldomain.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CongestionRuleDTO {

    private Long id;

    @NotBlank(message = "signalId is required")
    private String signalId;

    @NotNull(message = "ruleExpression is required")
    @Valid
    private SimpleRule ruleExpression;

    @NotNull(message = "enabled must be true or false")
    private Boolean enabled;

    private String description;
}

