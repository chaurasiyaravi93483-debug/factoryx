package com.factoryx.factoryx_backend.repository;

import com.factoryx.factoryx_backend.entity.Incident;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface IncidentRepository extends JpaRepository<Incident, Long> {

    Optional<Incident> findByIncidentId(String incidentId);

    boolean existsByIncidentId(String incidentId);

    List<Incident> findByMachine(String machine);

    List<Incident> findByStatus(String status);

    List<Incident> findBySeverity(String severity);

    List<Incident> findByAssignedTeam(String assignedTeam);
}