package com.factoryx.factoryx_backend.controller;

import com.factoryx.factoryx_backend.entity.Production;
import com.factoryx.factoryx_backend.service.ProductionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/production")
@RequiredArgsConstructor
public class ProductionController {

    private final ProductionService productionService;

    // Get all production records
    @GetMapping
    public ResponseEntity<List<Production>> getAllProduction() {
        return ResponseEntity.ok(
                productionService.getAllProduction()
        );
    }

    // Get production by ID
    @GetMapping("/{id}")
    public ResponseEntity<Production> getProductionById(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                productionService.getProductionById(id)
        );
    }

    // Create production record
    @PostMapping
    public ResponseEntity<Production> createProduction(
            @RequestBody Production production
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(productionService.createProduction(production));
    }

    // Update production record
    @PutMapping("/{id}")
    public ResponseEntity<Production> updateProduction(
            @PathVariable Long id,
            @RequestBody Production production
    ) {
        return ResponseEntity.ok(
                productionService.updateProduction(id, production)
        );
    }

    // Delete production record
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProduction(
            @PathVariable Long id
    ) {
        productionService.deleteProduction(id);

        return ResponseEntity.ok(
                "Production record deleted successfully"
        );
    }

    // Get production by machine
    @GetMapping("/machine/{machine}")
    public ResponseEntity<List<Production>> getByMachine(
            @PathVariable String machine
    ) {
        return ResponseEntity.ok(
                productionService.getByMachine(machine)
        );
    }

    // Get production by date
    @GetMapping("/date/{date}")
    public ResponseEntity<List<Production>> getByDate(
            @PathVariable String date
    ) {
        return ResponseEntity.ok(
                productionService.getByDate(
                        LocalDate.parse(date)
                )
        );
    }

    // Get production by shift
    @GetMapping("/shift/{shift}")
    public ResponseEntity<List<Production>> getByShift(
            @PathVariable String shift
    ) {
        return ResponseEntity.ok(
                productionService.getByShift(shift)
        );
    }
}