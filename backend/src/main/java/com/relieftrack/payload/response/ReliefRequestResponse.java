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
public class ReliefRequestResponse {
    private Long id;
    private Long userId;
    private String userName;
    private String phone;
    private Long disasterId;
    private String disasterName;
    private String location;
    private Integer familyMembers;
    private String resourcesNeeded;
    private String priority;
    private String status;
    private String notes;
    private String allocatedResources;
    private LocalDate createdAt;
}
