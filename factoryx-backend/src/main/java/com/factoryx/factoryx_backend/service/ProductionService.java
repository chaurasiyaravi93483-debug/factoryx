package com.factoryx.factoryx_backend.service;

import com.factoryx.factoryx_backend.entity.Production;
import com.factoryx.factoryx_backend.repository.ProductionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductionService {

    private final ProductionRepository productionRepository;

    // Get all production records
    public List<Production> getAllProduction() {
        return productionRepository.findAll();
    }

    // Get production by ID
    public Production getProductionById(Long id) {
        return productionRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Production record not found with id: " + id
                        )
                );
    }

    // Create production record
    public Production createProduction(Production production) {
        return productionRepository.save(production);
    }

    // Update production record
    public Production updateProduction(
            Long id,
            Production updatedProduction
    ) {
        Production production = getProductionById(id);

        production.setMachine(updatedProduction.getMachine());
        production.setDate(updatedProduction.getDate());
        production.setShift(updatedProduction.getShift());
        production.setTargetQuantity(
                updatedProduction.getTargetQuantity()
        );
        production.setActualQuantity(
                updatedProduction.getActualQuantity()
        );
        production.setDefectiveQuantity(
                updatedProduction.getDefectiveQuantity()
        );
        production.setDowntime(
                updatedProduction.getDowntime()
        );

        return productionRepository.save(production);
    }

    // Delete production record
    public void deleteProduction(Long id) {
        Production production = getProductionById(id);
        productionRepository.delete(production);
    }

    // Get production by machine
    public List<Production> getByMachine(String machine) {
        return productionRepository.findByMachine(machine);
    }

    // Get production by date
    public List<Production> getByDate(
            java.time.LocalDate date
    ) {
        return productionRepository.findByDate(date);
    }

    // Get production by shift
    public List<Production> getByShift(String shift) {
        return productionRepository.findByShift(shift);
    }
}