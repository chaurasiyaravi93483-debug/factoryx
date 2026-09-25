package com.factoryx.factoryx_backend.controller;

import com.factoryx.factoryx_backend.entity.Incident;
import com.factoryx.factoryx_backend.service.IncidentService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/incidents")
@RequiredArgsConstructor
public class IncidentController {

    private final IncidentService incidentService;

    // Get all incidents
    @GetMapping
    public ResponseEntity<List<Incident>> getAllIncidents() {

        return ResponseEntity.ok(
                incidentService.getAllIncidents()
        );
    }

    // Get incident by ID
    @GetMapping("/{id}")
    public ResponseEntity<Incident> getIncidentById(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                incidentService.getIncidentById(id)
        );
    }

    // Create incident
    @PostMapping
    public ResponseEntity<Incident> createIncident(
            @RequestBody Incident incident
    ) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        incidentService.createIncident(incident)
                );
    }

    // Update incident
    @PutMapping("/{id}")
    public ResponseEntity<Incident> updateIncident(
            @PathVariable Long id,
            @RequestBody Incident incident
    ) {

        return ResponseEntity.ok(
                incidentService.updateIncident(
                        id,
                        incident
                )
        );
    }

    // Delete incident
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteIncident(
            @PathVariable Long id
    ) {

        incidentService.deleteIncident(id);

        return ResponseEntity.ok(
                "Incident deleted successfully"
        );
    }

    // Get incidents by machine
    @GetMapping("/machine/{machine}")
    public ResponseEntity<List<Incident>> getByMachine(
            @PathVariable String machine
    ) {

        return ResponseEntity.ok(
                incidentService.getByMachine(machine)
        );
    }

    // Get incidents by status
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Incident>> getByStatus(
            @PathVariable String status
    ) {

        return ResponseEntity.ok(
                incidentService.getByStatus(status)
        );
    }

    // Get incidents by severity
    @GetMapping("/severity/{severity}")
    public ResponseEntity<List<Incident>> getBySeverity(
            @PathVariable String severity
    ) {

        return ResponseEntity.ok(
                incidentService.getBySeverity(severity)
        );
    }

    // Get incidents by assigned team
    @GetMapping("/team/{assignedTeam}")
    public ResponseEntity<List<Incident>> getByAssignedTeam(
            @PathVariable String assignedTeam
    ) {

        return ResponseEntity.ok(
                incidentService.getByAssignedTeam(
                        assignedTeam
                )
        );
    }
}