package com.factoryx.factoryx_backend.service;

import com.factoryx.factoryx_backend.entity.Maintenance;
import com.factoryx.factoryx_backend.repository.MaintenanceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MaintenanceService {

    private final MaintenanceRepository maintenanceRepository;

    // Get all maintenance records
    public List<Maintenance> getAllMaintenance() {
        return maintenanceRepository.findAll();
    }

    // Get maintenance by ID
    public Maintenance getMaintenanceById(Long id) {
        return maintenanceRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Maintenance record not found with id: " + id
                        )
                );
    }

    // Create maintenance record
    public Maintenance createMaintenance(Maintenance maintenance) {

        if (maintenanceRepository.existsByMaintenanceId(
                maintenance.getMaintenanceId()
        )) {
            throw new RuntimeException(
                    "Maintenance ID already exists: "
                            + maintenance.getMaintenanceId()
            );
        }

        return maintenanceRepository.save(maintenance);
    }

    // Update maintenance record
    public Maintenance updateMaintenance(
            Long id,
            Maintenance updatedMaintenance
    ) {
        Maintenance maintenance = getMaintenanceById(id);

        maintenance.setMaintenanceId(
                updatedMaintenance.getMaintenanceId()
        );
        maintenance.setMachine(
                updatedMaintenance.getMachine()
        );
        maintenance.setIssue(
                updatedMaintenance.getIssue()
        );
        maintenance.setType(
                updatedMaintenance.getType()
        );
        maintenance.setPriority(
                updatedMaintenance.getPriority()
        );
        maintenance.setStatus(
                updatedMaintenance.getStatus()
        );
        maintenance.setAssignedTo(
                updatedMaintenance.getAssignedTo()
        );
        maintenance.setScheduledDate(
                updatedMaintenance.getScheduledDate()
        );
        maintenance.setCompletedDate(
                updatedMaintenance.getCompletedDate()
        );
        maintenance.setNotes(
                updatedMaintenance.getNotes()
        );

        return maintenanceRepository.save(maintenance);
    }

    // Delete maintenance record
    public void deleteMaintenance(Long id) {
        Maintenance maintenance = getMaintenanceById(id);
        maintenanceRepository.delete(maintenance);
    }

    // Get by machine
    public List<Maintenance> getByMachine(String machine) {
        return maintenanceRepository.findByMachine(machine);
    }

    // Get by status
    public List<Maintenance> getByStatus(String status) {
        return maintenanceRepository.findByStatus(status);
    }

    // Get by priority
    public List<Maintenance> getByPriority(String priority) {
        return maintenanceRepository.findByPriority(priority);
    }
}