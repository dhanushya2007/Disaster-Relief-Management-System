package com.relieftrack.controller;

import com.relieftrack.entity.DistributionHistory;
import com.relieftrack.entity.ReliefRequest;
import com.relieftrack.entity.Resource;
import com.relieftrack.payload.request.DistributionRequest;
import com.relieftrack.payload.response.DistributionResponse;
import com.relieftrack.payload.response.MessageResponse;
import com.relieftrack.repository.DistributionHistoryRepository;
import com.relieftrack.repository.ReliefRequestRepository;
import com.relieftrack.repository.ResourceRepository;
import com.relieftrack.service.AuditLogService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/distribution")
public class DistributionController {

    @Autowired
    private DistributionHistoryRepository distributionHistoryRepository;

    @Autowired
    private ReliefRequestRepository reliefRequestRepository;

    @Autowired
    private ResourceRepository resourceRepository;

    @Autowired
    private AuditLogService auditLogService;

    private DistributionResponse mapToResponse(DistributionHistory dist) {
        return DistributionResponse.builder()
                .id(dist.getId())
                .requestId(dist.getRequest().getId())
                .requesterName(dist.getRequest().getUser().getName())
                .resourceId(dist.getResource().getId())
                .resourceName(dist.getResource().getName())
                .quantity(dist.getQuantity())
                .distributionDate(dist.getDistributionDate())
                .deliveredBy(dist.getDeliveredBy())
                .location(dist.getRequest().getLocation())
                .build();
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<DistributionResponse>> getAllDistributions() {
        List<DistributionResponse> list = distributionHistoryRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public ResponseEntity<?> distributeResources(@Valid @RequestBody DistributionRequest request) {
        ReliefRequest reliefRequest = reliefRequestRepository.findById(request.getRequestId())
                .orElseThrow(() -> new RuntimeException("Error: Relief request not found."));

        Resource resource = resourceRepository.findById(request.getResourceId())
                .orElseThrow(() -> new RuntimeException("Error: Resource not found."));

        if (resource.getAvailableStock() < request.getQuantity()) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Not enough resource stock. Available: " + resource.getAvailableStock()));
        }

        // Reduce resource stock
        resource.setAvailableStock(resource.getAvailableStock() - request.getQuantity());
        resourceRepository.save(resource);

        // Record history
        String adminUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        DistributionHistory dist = DistributionHistory.builder()
                .request(reliefRequest)
                .resource(resource)
                .quantity(request.getQuantity())
                .deliveredBy(adminUsername)
                .build();
        
        distributionHistoryRepository.save(dist);

        // Audit Log
        auditLogService.log(adminUsername, "DISTRIBUTE_RESOURCE", "Distribution", dist.getId(), 
                "Distributed " + request.getQuantity() + " units of " + resource.getName() + " to " + reliefRequest.getUser().getName());

        return ResponseEntity.ok(new MessageResponse("Resources distributed successfully!"));
    }
}
