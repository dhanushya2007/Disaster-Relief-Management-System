package com.relieftrack.controller;

import com.relieftrack.entity.Disaster;
import com.relieftrack.entity.ReliefRequest;
import com.relieftrack.entity.Resource;
import com.relieftrack.repository.DisasterRepository;
import com.relieftrack.repository.ReliefRequestRepository;
import com.relieftrack.repository.ResourceRepository;
import com.relieftrack.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private DisasterRepository disasterRepository;

    @Autowired
    private ReliefRequestRepository reliefRequestRepository;

    @Autowired
    private ResourceRepository resourceRepository;

    @GetMapping("/admin-stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAdminStats() {
        List<Disaster> disasters = disasterRepository.findAll();
        List<ReliefRequest> requests = reliefRequestRepository.findAll();
        List<Resource> resources = resourceRepository.findAll();

        long activeDisasters = disasters.stream().filter(d -> "ACTIVE".equalsIgnoreCase(d.getStatus())).count();
        long pendingRequests = requests.stream().filter(r -> "PENDING".equalsIgnoreCase(r.getStatus())).count();
        long completedRequests = requests.stream().filter(r -> "COMPLETED".equalsIgnoreCase(r.getStatus())).count();

        int totalStock = resources.stream().mapToInt(Resource::getQuantity).sum();
        int availableStock = resources.stream().mapToInt(Resource::getAvailableStock).sum();
        int distributedStock = totalStock - availableStock;

        long lowStockCount = resources.stream()
                .filter(r -> r.getQuantity() > 0 && ((double) r.getAvailableStock() / r.getQuantity()) < 0.2)
                .count();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalDisasters", disasters.size());
        stats.put("activeDisasters", activeDisasters);
        stats.put("totalRequests", requests.size());
        stats.put("pendingRequests", pendingRequests);
        stats.put("completedRequests", completedRequests);
        stats.put("totalStock", totalStock);
        stats.put("availableStock", availableStock);
        stats.put("distributedStock", distributedStock);
        stats.put("lowStockCount", lowStockCount);

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/citizen-stats")
    public ResponseEntity<?> getCitizenStats() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Long userId = userDetails.getId();

        List<Disaster> disasters = disasterRepository.findAll();
        List<ReliefRequest> myRequests = reliefRequestRepository.findByUserId(userId);

        long activeDisasters = disasters.stream().filter(d -> "ACTIVE".equalsIgnoreCase(d.getStatus())).count();
        long myPending = myRequests.stream().filter(r -> "PENDING".equalsIgnoreCase(r.getStatus())).count();
        long myApproved = myRequests.stream().filter(r -> "APPROVED".equalsIgnoreCase(r.getStatus()) || "IN_PROGRESS".equalsIgnoreCase(r.getStatus())).count();
        long myCompleted = myRequests.stream().filter(r -> "COMPLETED".equalsIgnoreCase(r.getStatus())).count();

        Map<String, Object> stats = new HashMap<>();
        stats.put("activeDisasters", activeDisasters);
        stats.put("myRequestsCount", myRequests.size());
        stats.put("myPendingCount", myPending);
        stats.put("myApprovedCount", myApproved);
        stats.put("myCompletedCount", myCompleted);

        return ResponseEntity.ok(stats);
    }
}
