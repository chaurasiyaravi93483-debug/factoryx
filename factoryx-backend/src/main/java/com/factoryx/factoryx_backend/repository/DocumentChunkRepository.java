package com.factoryx.factoryx_backend.repository;

import com.factoryx.factoryx_backend.entity.DocumentChunk;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DocumentChunkRepository
        extends JpaRepository<DocumentChunk, Long> {

    List<DocumentChunk> findByDocumentIdOrderByChunkIndexAsc(
            Long documentId
    );

    void deleteByDocumentId(Long documentId);
}