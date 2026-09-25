package com.factoryx.factoryx_backend.repository;

import com.factoryx.factoryx_backend.entity.Document;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DocumentRepository extends JpaRepository<Document, Long> {

    List<Document> findAllByOrderByUploadedAtDesc();

    List<Document> findByDocumentNameContainingIgnoreCase(String documentName);

}