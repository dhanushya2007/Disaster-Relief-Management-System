package com.relieftrack.controller;

import com.relieftrack.entity.Disaster;
import com.relieftrack.entity.ReliefRequest;
import com.relieftrack.entity.User;
import com.relieftrack.payload.request.ReliefRequestRequest;
import com.relieftrack.payload.response.MessageResponse;
import com.relieftrack.payload.response.ReliefRequestResponse;
import com.relieftrack.repository.DisasterRepository;
import com.relieftrack.repository.ReliefRequestRepository;
import com.relieftrack.repository.UserRepository;
import com.relieftrack.security.services.UserDetailsImpl;
import com.relieftrack.service.AuditLogService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/requests")
public class ReliefRequestController {

    @Autowired
    private ReliefRequestRepository reliefRequestRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DisasterRepository disasterRepository;

    @Autowired
    private AuditLogService auditLogService;

    private ReliefRequestResponse mapToResponse(ReliefRequest req) {
        return ReliefRequestResponse.builder()
                .id(req.getId())
                .userId(req.getUser().getId())
                .userName(req.getUser().getName())
                .phone(req.getUser().getPhone())
                .disasterId(req.getDisaster().getId())
                .disasterName(req.getDisaster().getName())
                .location(req.getLocation())
                .familyMembers(req.getPeopleAffected())
                .resourcesNeeded(req.getResourcesNeeded())
                .priority(req.getPriority())
                .status(req.getStatus())
                .notes(req.getNotes())
                .allocatedResources(req.getAllocatedResources())
                .createdAt(req.getCreatedAt())
                .build();
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ReliefRequestResponse>> getAllRequests() {
        List<ReliefRequestResponse> list = reliefRequestRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

    @GetMapping("/my")
    public ResponseEntity<List<ReliefRequestResponse>> getMyRequests() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        List<ReliefRequestResponse> list = reliefRequestRepository.findByUserId(userDetails.getId()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

    @PostMapping
    public ResponseEntity<?> createRequest(@Valid @RequestBody ReliefRequestRequest request) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("Error: User not found."));
        
        Disaster disaster = disasterRepository.findById(request.getDisasterId())
                .orElseThrow(() -> new RuntimeException("Error: Disaster not found."));

        ReliefRequest reliefRequest = ReliefRequest.builder()
                .user(user)
                .disaster(disaster)
                .location(request.getLocation())
                .peopleAffected(request.getFamilyMembers())
                .resourcesNeeded(request.getResourcesNeeded())
                .priority(request.getPriority())
                .status("PENDING")
                .notes(request.getNotes())
                .build();

        reliefRequestRepository.save(reliefRequest);

        return ResponseEntity.ok(new MessageResponse("Relief request submitted successfully!"));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateRequestStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        String status = payload.get("status");
        String allocatedResources = payload.get("allocatedResources");

        return reliefRequestRepository.findById(id).map(req -> {
            req.setStatus(status.toUpperCase());
            if (allocatedResources != null) {
                req.setAllocatedResources(allocatedResources);
            }
            reliefRequestRepository.save(req);

            String adminUsername = SecurityContextHolder.getContext().getAuthentication().getName();
            auditLogService.log(adminUsername, status.toUpperCase() + "_REQUEST", "ReliefRequest", id, 
                    "Updated request status to " + status + (allocatedResources != null ? " with allocation: " + allocatedResources : ""));
            
            return ResponseEntity.ok(new MessageResponse("Request status updated to " + status));
        }).orElse(ResponseEntity.notFound().build());
    }
}
