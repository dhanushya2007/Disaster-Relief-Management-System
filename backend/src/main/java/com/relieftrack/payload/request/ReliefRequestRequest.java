package com.relieftrack.payload.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ReliefRequestRequest {
    @NotNull
    private Long disasterId;

    @NotBlank
    private String location;

    @NotNull
    @Min(1)
    private Integer familyMembers; // represented as people_affected in DB/entity

    @NotBlank
    private String resourcesNeeded;

    @NotBlank
    private String priority; // LOW, MEDIUM, HIGH, CRITICAL

    private String notes;
}
