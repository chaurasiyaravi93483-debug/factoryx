package com.factoryx.factoryx_backend.repository;

import com.factoryx.factoryx_backend.entity.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface InventoryRepository
        extends JpaRepository<Inventory, Long> {

    Optional<Inventory> findByItemCode(String itemCode);

    boolean existsByItemCode(String itemCode);

    List<Inventory> findByCategory(String category);

    List<Inventory> findByStatus(String status);
}