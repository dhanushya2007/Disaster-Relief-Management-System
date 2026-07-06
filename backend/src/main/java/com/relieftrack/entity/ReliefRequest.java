package com.relieftrack.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "relief_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReliefRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "disaster_id", nullable = false)
    private Disaster disaster;

    @Column(nullable = false)
    private String location;

    @Column(name = "people_affected", nullable = false)
    private Integer peopleAffected;

    @Column(name = "resources_needed", nullable = false)
    private String resourcesNeeded;

    @Column(nullable = false)
    private String priority; // LOW, MEDIUM, HIGH, CRITICAL

    @Column(nullable = false)
    private String status; // PENDING, APPROVED, IN_PROGRESS, COMPLETED, REJECTED

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "allocated_resources")
    private String allocatedResources;

    @Column(name = "created_at", updatable = false)
    private LocalDate createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDate.now();
    }
}
