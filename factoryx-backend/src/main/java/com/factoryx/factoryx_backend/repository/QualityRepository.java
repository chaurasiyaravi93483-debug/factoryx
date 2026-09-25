package com.factoryx.factoryx_backend.repository;

import com.factoryx.factoryx_backend.entity.Quality;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface QualityRepository
        extends JpaRepository<Quality, Long> {

    Optional<Quality> findByQualityId(String qualityId);

    boolean existsByQualityId(String qualityId);

    List<Quality> findByMachine(String machine);

    List<Quality> findByStatus(String status);

    List<Quality> findByTeam(String team);
}