package com.factoryx.factoryx_backend.controller;

import com.factoryx.factoryx_backend.entity.Quality;
import com.factoryx.factoryx_backend.service.QualityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quality")
@RequiredArgsConstructor
public class QualityController {

    private final QualityService qualityService;

    // Get all quality records
    @GetMapping
    public ResponseEntity<List<Quality>> getAllQuality() {
        return ResponseEntity.ok(
                qualityService.getAllQuality()
        );
    }

    // Get quality record by ID
    @GetMapping("/{id}")
    public ResponseEntity<Quality> getQualityById(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                qualityService.getQualityById(id)
        );
    }

    // Create quality record
    @PostMapping
    public ResponseEntity<Quality> createQuality(
            @RequestBody Quality quality
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        qualityService.createQuality(quality)
                );
    }

    // Update quality record
    @PutMapping("/{id}")
    public ResponseEntity<Quality> updateQuality(
            @PathVariable Long id,
            @RequestBody Quality quality
    ) {
        return ResponseEntity.ok(
                qualityService.updateQuality(
                        id,
                        quality
                )
        );
    }

    // Delete quality record
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteQuality(
            @PathVariable Long id
    ) {
        qualityService.deleteQuality(id);

        return ResponseEntity.ok(
                "Quality record deleted successfully"
        );
    }

    // Get by machine
    @GetMapping("/machine/{machine}")
    public ResponseEntity<List<Quality>> getByMachine(
            @PathVariable String machine
    ) {
        return ResponseEntity.ok(
                qualityService.getByMachine(machine)
        );
    }

    // Get by status
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Quality>> getByStatus(
            @PathVariable String status
    ) {
        return ResponseEntity.ok(
                qualityService.getByStatus(status)
        );
    }

    // Get by team
    @GetMapping("/team/{team}")
    public ResponseEntity<List<Quality>> getByTeam(
            @PathVariable String team
    ) {
        return ResponseEntity.ok(
                qualityService.getByTeam(team)
        );
    }
}