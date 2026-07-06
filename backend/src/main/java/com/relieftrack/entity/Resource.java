package com.relieftrack.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "resources")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Resource {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String category; // Food, Water, Medicines, etc.

    @Column(nullable = false)
    private Integer quantity;

    @Column(name = "available_stock", nullable = false)
    private Integer availableStock;

    @Column(name = "last_updated")
    private LocalDate lastUpdated;

    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        lastUpdated = LocalDate.now();
    }
}
