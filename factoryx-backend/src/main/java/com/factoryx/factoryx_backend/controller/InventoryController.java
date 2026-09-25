package com.factoryx.factoryx_backend.controller;

import com.factoryx.factoryx_backend.entity.Inventory;
import com.factoryx.factoryx_backend.service.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
public class InventoryController {

    private final InventoryService inventoryService;

    // Get all inventory items
    @GetMapping
    public ResponseEntity<List<Inventory>> getAllInventory() {
        return ResponseEntity.ok(
                inventoryService.getAllInventory()
        );
    }

    // Get inventory item by ID
    @GetMapping("/{id}")
    public ResponseEntity<Inventory> getInventoryById(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                inventoryService.getInventoryById(id)
        );
    }

    // Create inventory item
    @PostMapping
    public ResponseEntity<Inventory> createInventory(
            @RequestBody Inventory inventory
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        inventoryService.createInventory(inventory)
                );
    }

    // Update inventory item
    @PutMapping("/{id}")
    public ResponseEntity<Inventory> updateInventory(
            @PathVariable Long id,
            @RequestBody Inventory inventory
    ) {
        return ResponseEntity.ok(
                inventoryService.updateInventory(
                        id,
                        inventory
                )
        );
    }

    // Delete inventory item
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteInventory(
            @PathVariable Long id
    ) {
        inventoryService.deleteInventory(id);

        return ResponseEntity.ok(
                "Inventory item deleted successfully"
        );
    }

    // Get items by category
    @GetMapping("/category/{category}")
    public ResponseEntity<List<Inventory>> getByCategory(
            @PathVariable String category
    ) {
        return ResponseEntity.ok(
                inventoryService.getByCategory(category)
        );
    }

    // Get items by status
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Inventory>> getByStatus(
            @PathVariable String status
    ) {
        return ResponseEntity.ok(
                inventoryService.getByStatus(status)
        );
    }
}