package com.factoryx.factoryx_backend.controller;

import com.factoryx.factoryx_backend.entity.Machine;
import com.factoryx.factoryx_backend.service.MachineService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/machines")
@RequiredArgsConstructor
public class MachineController {

    private final MachineService machineService;

    // GET /api/machines
    @GetMapping
    public ResponseEntity<List<Machine>> getAllMachines() {

        return ResponseEntity.ok(
                machineService.getAllMachines()
        );
    }

    // GET /api/machines/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Machine> getMachineById(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                machineService.getMachineById(id)
        );
    }

    // POST /api/machines
    @PostMapping
    public ResponseEntity<Machine> createMachine(
            @RequestBody Machine machine
    ) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(machineService.createMachine(machine));
    }

    // PUT /api/machines/{id}
    @PutMapping("/{id}")
    public ResponseEntity<Machine> updateMachine(
            @PathVariable Long id,
            @RequestBody Machine machine
    ) {

        return ResponseEntity.ok(
                machineService.updateMachine(id, machine)
        );
    }

    // DELETE /api/machines/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteMachine(
            @PathVariable Long id
    ) {

        machineService.deleteMachine(id);

        return ResponseEntity.ok(
                "Machine deleted successfully"
        );
    }
}