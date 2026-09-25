package com.factoryx.factoryx_backend.service;

import com.factoryx.factoryx_backend.entity.Quality;
import com.factoryx.factoryx_backend.repository.QualityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class QualityService {

    private final QualityRepository qualityRepository;

    // Get all quality records
    public List<Quality> getAllQuality() {
        return qualityRepository.findAll();
    }

    // Get quality record by ID
    public Quality getQualityById(Long id) {
        return qualityRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Quality record not found with id: " + id
                        )
                );
    }

    // Create quality record
    public Quality createQuality(Quality quality) {

        if (qualityRepository.existsByQualityId(
                quality.getQualityId()
        )) {
            throw new RuntimeException(
                    "Quality ID already exists: "
                            + quality.getQualityId()
            );
        }

        return qualityRepository.save(quality);
    }

    // Update quality record
    public Quality updateQuality(
            Long id,
            Quality updatedQuality
    ) {
        Quality quality = getQualityById(id);

        quality.setQualityId(
                updatedQuality.getQualityId()
        );
        quality.setProduct(
                updatedQuality.getProduct()
        );
        quality.setMachine(
                updatedQuality.getMachine()
        );
        quality.setTeam(
                updatedQuality.getTeam()
        );
        quality.setQualityScore(
                updatedQuality.getQualityScore()
        );
        quality.setDefects(
                updatedQuality.getDefects()
        );
        quality.setStatus(
                updatedQuality.getStatus()
        );

        return qualityRepository.save(quality);
    }

    // Delete quality record
    public void deleteQuality(Long id) {
        Quality quality = getQualityById(id);
        qualityRepository.delete(quality);
    }

    // Get by machine
    public List<Quality> getByMachine(String machine) {
        return qualityRepository.findByMachine(machine);
    }

    // Get by status
    public List<Quality> getByStatus(String status) {
        return qualityRepository.findByStatus(status);
    }

    // Get by team
    public List<Quality> getByTeam(String team) {
        return qualityRepository.findByTeam(team);
    }
}