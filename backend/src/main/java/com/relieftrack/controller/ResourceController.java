package com.relieftrack.controller;

import com.relieftrack.entity.Resource;
import com.relieftrack.repository.ResourceRepository;
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
@RequestMapping("/api/resources")
public class ResourceController {

    @Autowired
    private ResourceRepository resourceRepository;

    @Autowired
    private AuditLogService auditLogService;

    @GetMapping
    public ResponseEntity<List<Resource>> getAllResources() {
        return ResponseEntity.ok(resourceRepository.findAll());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Resource> createResource(@Valid @RequestBody Resource resource) {
        Resource saved = resourceRepository.save(resource);
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        auditLogService.log(username, "CREATE_RESOURCE", "Resource", saved.getId(), "Added resource: " + saved.getName());
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Resource> updateResource(@PathVariable Long id, @Valid @RequestBody Resource resourceDetails) {
        return resourceRepository.findById(id).map(resource -> {
            resource.setName(resourceDetails.getName());
            resource.setCategory(resourceDetails.getCategory());
            resource.setQuantity(resourceDetails.getQuantity());
            resource.setAvailableStock(resourceDetails.getAvailableStock());
            Resource updated = resourceRepository.save(resource);
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            auditLogService.log(username, "UPDATE_RESOURCE", "Resource", updated.getId(), "Updated resource ID: " + updated.getId());
            return ResponseEntity.ok(updated);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteResource(@PathVariable Long id) {
        return resourceRepository.findById(id).map(resource -> {
            resourceRepository.delete(resource);
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            auditLogService.log(username, "DELETE_RESOURCE", "Resource", id, "Deleted resource name: " + resource.getName());
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
