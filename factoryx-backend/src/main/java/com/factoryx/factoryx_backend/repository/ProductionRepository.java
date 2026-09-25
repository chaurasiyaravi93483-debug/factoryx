package com.factoryx.factoryx_backend.repository;

import com.factoryx.factoryx_backend.entity.Production;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface ProductionRepository extends JpaRepository<Production, Long> {

    List<Production> findByMachine(String machine);

    List<Production> findByDate(LocalDate date);

    List<Production> findByShift(String shift);
}