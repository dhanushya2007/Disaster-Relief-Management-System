package com.relieftrack.payload.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DistributionResponse {
    private Long id;
    private Long requestId;
    private String requesterName;
    private Long resourceId;
    private String resourceName;
    private Integer quantity;
    private LocalDate distributionDate;
    private String deliveredBy;
    private String location;
}
