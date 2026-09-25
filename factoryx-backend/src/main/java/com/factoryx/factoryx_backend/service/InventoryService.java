package com.factoryx.factoryx_backend.service;

import com.factoryx.factoryx_backend.entity.Inventory;
import com.factoryx.factoryx_backend.repository.InventoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class InventoryService {

    private final InventoryRepository inventoryRepository;

    public List<Inventory> getAllInventory() {
        return inventoryRepository.findAll();
    }

    public Inventory getInventoryById(Long id) {
        return inventoryRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Inventory item not found with id: " + id
                        )
                );
    }

    public Inventory createInventory(Inventory inventory) {

        if (inventoryRepository.existsByItemCode(
                inventory.getItemCode()
        )) {
            throw new RuntimeException(
                    "Item code already exists: "
                            + inventory.getItemCode()
            );
        }

        return inventoryRepository.save(inventory);
    }

    public Inventory updateInventory(
            Long id,
            Inventory updatedInventory
    ) {
        Inventory inventory = getInventoryById(id);

        inventory.setItemCode(updatedInventory.getItemCode());
        inventory.setItemName(updatedInventory.getItemName());
        inventory.setCategory(updatedInventory.getCategory());
        inventory.setQuantity(updatedInventory.getQuantity());
        inventory.setMinimumStock(updatedInventory.getMinimumStock());
        inventory.setUnit(updatedInventory.getUnit());
        inventory.setStatus(updatedInventory.getStatus());
        inventory.setLocation(updatedInventory.getLocation());
        inventory.setSupplier(updatedInventory.getSupplier());

        return inventoryRepository.save(inventory);
    }

    public void deleteInventory(Long id) {
        Inventory inventory = getInventoryById(id);
        inventoryRepository.delete(inventory);
    }

    public List<Inventory> getByCategory(String category) {
        return inventoryRepository.findByCategory(category);
    }

    public List<Inventory> getByStatus(String status) {
        return inventoryRepository.findByStatus(status);
    }
}