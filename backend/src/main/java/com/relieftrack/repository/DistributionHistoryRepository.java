package com.relieftrack.repository;

import com.relieftrack.entity.DistributionHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DistributionHistoryRepository extends JpaRepository<DistributionHistory, Long> {
    List<DistributionHistory> findByRequestId(Long requestId);
}
