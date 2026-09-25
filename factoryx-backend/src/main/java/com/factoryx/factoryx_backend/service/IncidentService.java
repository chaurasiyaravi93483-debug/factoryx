package com.factoryx.factoryx_backend.service;

import com.factoryx.factoryx_backend.entity.Incident;
import com.factoryx.factoryx_backend.repository.IncidentRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class IncidentService {

    private final IncidentRepository incidentRepository;

    // Get all incidents
    public List<Incident> getAllIncidents() {
        return incidentRepository.findAll();
    }

    // Get incident by database ID
    public Incident getIncidentById(Long id) {

        return incidentRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Incident not found with id: " + id
                        )
                );
    }

    // Create incident
    public Incident createIncident(Incident incident) {

        if (incidentRepository.existsByIncidentId(
                incident.getIncidentId())) {

            throw new RuntimeException(
                    "Incident ID already exists: "
                            + incident.getIncidentId()
            );
        }

        return incidentRepository.save(incident);
    }

    // Update incident
    public Incident updateIncident(
            Long id,
            Incident updatedIncident
    ) {

        Incident incident = getIncidentById(id);

        incident.setIncidentId(
                updatedIncident.getIncidentId()
        );

        incident.setTitle(
                updatedIncident.getTitle()
        );

        incident.setMachine(
                updatedIncident.getMachine()
        );

        incident.setLocation(
                updatedIncident.getLocation()
        );

        incident.setSeverity(
                updatedIncident.getSeverity()
        );

        incident.setStatus(
                updatedIncident.getStatus()
        );

        incident.setAssignedTeam(
                updatedIncident.getAssignedTeam()
        );

        incident.setCreatedAt(
                updatedIncident.getCreatedAt()
        );

        return incidentRepository.save(incident);
    }

    // Delete incident
    public void deleteIncident(Long id) {

        Incident incident = getIncidentById(id);

        incidentRepository.delete(incident);
    }

    // Get by machine
    public List<Incident> getByMachine(String machine) {
        return incidentRepository.findByMachine(machine);
    }

    // Get by status
    public List<Incident> getByStatus(String status) {
        return incidentRepository.findByStatus(status);
    }

    // Get by severity
    public List<Incident> getBySeverity(String severity) {
        return incidentRepository.findBySeverity(severity);
    }

    // Get by assigned team
    public List<Incident> getByAssignedTeam(
            String assignedTeam
    ) {
        return incidentRepository.findByAssignedTeam(
                assignedTeam
        );
    }
}