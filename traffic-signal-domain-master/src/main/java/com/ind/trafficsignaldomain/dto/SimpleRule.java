package com.ind.trafficsignaldomain.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class SimpleRule {
    @NotNull
    @Size(min = 1)
    private List<Condition> conditions;
    private String logic; // "AND" or "OR"

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @ToString
    public static class Condition {
        private String field;
        private String operator;
        private Number value;
    }
}
