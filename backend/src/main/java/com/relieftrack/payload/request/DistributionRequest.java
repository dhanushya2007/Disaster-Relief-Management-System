package com.relieftrack.payload.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class DistributionRequest {
    @NotNull
    private Long requestId;

    @NotNull
    private Long resourceId;

    @NotNull
    @Min(1)
    private Integer quantity;
}
