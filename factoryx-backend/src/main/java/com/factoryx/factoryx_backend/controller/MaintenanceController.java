package com.factoryx.factoryx_backend.controller;

import com.factoryx.factoryx_backend.entity.Maintenance;
import com.factoryx.factoryx_backend.service.MaintenanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/maintenance")
@RequiredArgsConstructor
public class MaintenanceController {

    private final MaintenanceService maintenanceService;

    // Get all maintenance records
    @GetMapping
    public ResponseEntity<List<Maintenance>> getAllMaintenance() {
        return ResponseEntity.ok(
                maintenanceService.getAllMaintenance()
        );
    }

    // Get maintenance by ID
    @GetMapping("/{id}")
    public ResponseEntity<Maintenance> getMaintenanceById(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                maintenanceService.getMaintenanceById(id)
        );
    }

    // Create maintenance record
    @PostMapping
    public ResponseEntity<Maintenance> createMaintenance(
            @RequestBody Maintenance maintenance
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        maintenanceService.createMaintenance(maintenance)
                );
    }

    // Update maintenance record
    @PutMapping("/{id}")
    public ResponseEntity<Maintenance> updateMaintenance(
            @PathVariable Long id,
            @RequestBody Maintenance maintenance
    ) {
        return ResponseEntity.ok(
                maintenanceService.updateMaintenance(
                        id,
                        maintenance
                )
        );
    }

    // Delete maintenance record
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteMaintenance(
            @PathVariable Long id
    ) {
        maintenanceService.deleteMaintenance(id);

        return ResponseEntity.ok(
                "Maintenance record deleted successfully"
        );
    }

    // Get by machine
    @GetMapping("/machine/{machine}")
    public ResponseEntity<List<Maintenance>> getByMachine(
            @PathVariable String machine
    ) {
        return ResponseEntity.ok(
                maintenanceService.getByMachine(machine)
        );
    }

    // Get by status
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Maintenance>> getByStatus(
            @PathVariable String status
    ) {
        return ResponseEntity.ok(
                maintenanceService.getByStatus(status)
        );
    }

    // Get by priority
    @GetMapping("/priority/{priority}")
    public ResponseEntity<List<Maintenance>> getByPriority(
            @PathVariable String priority
    ) {
        return ResponseEntity.ok(
                maintenanceService.getByPriority(priority)
        );
    }
}