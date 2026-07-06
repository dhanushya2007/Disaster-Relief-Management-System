package com.relieftrack.repository;

import com.relieftrack.entity.ReliefRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReliefRequestRepository extends JpaRepository<ReliefRequest, Long> {
    List<ReliefRequest> findByUserId(Long userId);
    List<ReliefRequest> findByStatus(String status);
}
