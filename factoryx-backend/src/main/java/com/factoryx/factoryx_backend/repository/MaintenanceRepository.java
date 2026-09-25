package com.factoryx.factoryx_backend.repository;

import com.factoryx.factoryx_backend.entity.Maintenance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MaintenanceRepository
        extends JpaRepository<Maintenance, Long> {

    Optional<Maintenance> findByMaintenanceId(String maintenanceId);

    boolean existsByMaintenanceId(String maintenanceId);

    List<Maintenance> findByMachine(String machine);

    List<Maintenance> findByStatus(String status);

    List<Maintenance> findByPriority(String priority);
}