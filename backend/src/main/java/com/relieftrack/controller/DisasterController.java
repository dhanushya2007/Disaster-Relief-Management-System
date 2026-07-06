package com.relieftrack.controller;

import com.relieftrack.entity.Disaster;
import com.relieftrack.repository.DisasterRepository;
import com.relieftrack.service.AuditLogService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/disasters")
public class DisasterController {

    @Autowired
    private DisasterRepository disasterRepository;

    @Autowired
    private AuditLogService auditLogService;

    @GetMapping
    public ResponseEntity<List<Disaster>> getAllDisasters() {
        return ResponseEntity.ok(disasterRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Disaster> getDisasterById(@PathVariable Long id) {
        return disasterRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Disaster> createDisaster(@Valid @RequestBody Disaster disaster) {
        Disaster saved = disasterRepository.save(disaster);
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        auditLogService.log(username, "CREATE_DISASTER", "Disaster", saved.getId(), "Created disaster: " + saved.getName());
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Disaster> updateDisaster(@PathVariable Long id, @Valid @RequestBody Disaster disasterDetails) {
        return disasterRepository.findById(id).map(disaster -> {
            disaster.setName(disasterDetails.getName());
            disaster.setType(disasterDetails.getType());
            disaster.setLocation(disasterDetails.getLocation());
            disaster.setDate(disasterDetails.getDate());
            disaster.setSeverity(disasterDetails.getSeverity());
            disaster.setDescription(disasterDetails.getDescription());
            disaster.setStatus(disasterDetails.getStatus());
            Disaster updated = disasterRepository.save(disaster);
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            auditLogService.log(username, "UPDATE_DISASTER", "Disaster", updated.getId(), "Updated disaster ID: " + updated.getId());
            return ResponseEntity.ok(updated);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteDisaster(@PathVariable Long id) {
        return disasterRepository.findById(id).map(disaster -> {
            disasterRepository.delete(disaster);
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            auditLogService.log(username, "DELETE_DISASTER", "Disaster", id, "Deleted disaster name: " + disaster.getName());
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
