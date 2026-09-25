package com.factoryx.factoryx_backend.service;

import com.factoryx.factoryx_backend.entity.Machine;
import com.factoryx.factoryx_backend.repository.MachineRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MachineService {

    private final MachineRepository machineRepository;

    // Get all machines
    public List<Machine> getAllMachines() {
        return machineRepository.findAll();
    }

    // Get machine by ID
    public Machine getMachineById(Long id) {
        return machineRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Machine not found with id: " + id)
                );
    }

    // Create machine
    public Machine createMachine(Machine machine) {

        if (machineRepository.existsByMachineCode(machine.getMachineCode())) {
            throw new RuntimeException(
                    "Machine with code " + machine.getMachineCode() + " already exists"
            );
        }

        return machineRepository.save(machine);
    }

    // Update machine
    public Machine updateMachine(Long id, Machine updatedMachine) {

        Machine machine = getMachineById(id);

        machine.setMachineCode(updatedMachine.getMachineCode());
        machine.setMachineName(updatedMachine.getMachineName());
        machine.setType(updatedMachine.getType());
        machine.setLocation(updatedMachine.getLocation());
        machine.setStatus(updatedMachine.getStatus());
        machine.setEfficiency(updatedMachine.getEfficiency());
        machine.setTemperature(updatedMachine.getTemperature());
        machine.setVibration(updatedMachine.getVibration());
        machine.setLastMaintenance(updatedMachine.getLastMaintenance());

        return machineRepository.save(machine);
    }

    // Delete machine
    public void deleteMachine(Long id) {

        Machine machine = getMachineById(id);

        machineRepository.delete(machine);
    }
}