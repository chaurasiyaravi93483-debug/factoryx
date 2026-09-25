package com.factoryx.factoryx_backend.service;

import com.factoryx.factoryx_backend.entity.Document;
import com.factoryx.factoryx_backend.repository.DocumentRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final DocumentTextExtractor documentTextExtractor;

    @Value("${file.upload-dir:uploads/documents}")
    private String uploadDir;

    public DocumentService(
            DocumentRepository documentRepository,
            DocumentTextExtractor documentTextExtractor
    ) {
        this.documentRepository = documentRepository;
        this.documentTextExtractor = documentTextExtractor;
    }


    // =====================================================
    // UPLOAD DOCUMENT
    // =====================================================

    public Document uploadDocument(
            MultipartFile file,
            String uploadedBy
    ) throws IOException {

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException(
                    "Please select a file."
            );
        }


        // =================================================
        // ALLOWED FILE TYPES
        // =================================================

        String originalFileName =
                file.getOriginalFilename();

        if (originalFileName == null ||
                originalFileName.isBlank()) {

            throw new IllegalArgumentException(
                    "Invalid file name."
            );
        }


        String extension = "";

        int dotIndex =
                originalFileName.lastIndexOf(".");

        if (dotIndex >= 0) {
            extension =
                    originalFileName
                            .substring(dotIndex)
                            .toLowerCase();
        }


        if (!extension.equals(".pdf") &&
                !extension.equals(".docx") &&
                !extension.equals(".txt")) {

            throw new IllegalArgumentException(
                    "Only PDF, DOCX and TXT files are allowed."
            );
        }


        // =================================================
        // CREATE UPLOAD DIRECTORY
        // =================================================

        Path directory =
                Paths.get(uploadDir)
                        .toAbsolutePath()
                        .normalize();

        Files.createDirectories(directory);


        // =================================================
        // UNIQUE FILE NAME
        // =================================================

        String storedFileName =
                UUID.randomUUID()
                        + extension;


        Path filePath =
                directory.resolve(storedFileName);


        // =================================================
        // SAVE FILE
        // =================================================

        Files.copy(
                file.getInputStream(),
                filePath,
                StandardCopyOption.REPLACE_EXISTING
        );


        // =================================================
        // DOCUMENT TYPE
        // =================================================

        String documentType;

        if (extension.equals(".pdf")) {

            documentType = "PDF";

        } else if (extension.equals(".docx")) {

            documentType = "DOCX";

        } else {

            documentType = "TXT";
        }


        // =================================================
        // SAVE METADATA
        // =================================================

        Document document =
                Document.builder()
                        .documentName(originalFileName)
                        .fileName(storedFileName)
                        .documentType(documentType)
                        .fileSize(file.getSize())
                        .filePath(filePath.toString())
                        .uploadedBy(
                                uploadedBy != null
                                        ? uploadedBy
                                        : "Unknown"
                        )
                        .uploadedAt(
                                LocalDateTime.now()
                        )
                        .status("Ready")
                        .build();


        return documentRepository.save(document);
    }


    // =====================================================
    // GET ALL DOCUMENTS
    // =====================================================

    public List<Document> getAllDocuments() {

        return documentRepository
                .findAllByOrderByUploadedAtDesc();
    }


    // =====================================================
    // GET DOCUMENT BY ID
    // =====================================================

    public Document getDocumentById(Long id) {

        return documentRepository
                .findById(id)
                .orElseThrow(
                        () -> new RuntimeException(
                                "Document not found."
                        )
                );
    }


    // =====================================================
    // DELETE DOCUMENT
    // =====================================================

    public void deleteDocument(Long id)
            throws IOException {

        Document document =
                getDocumentById(id);


        // Delete physical file

        if (document.getFilePath() != null) {

            Path filePath =
                    Paths.get(
                            document.getFilePath()
                    );

            Files.deleteIfExists(filePath);
        }


        // Delete database record

        documentRepository.delete(document);
    }


    // =====================================================
    // GET FILE PATH
    // =====================================================

    public Path getFilePath(Long id) {

        Document document =
                getDocumentById(id);

        return Paths.get(
                document.getFilePath()
        );
    }


    // =====================================================
    // EXTRACT PDF TEXT
    // =====================================================

    public String extractPdfText(Long id)
            throws IOException {

        Document document =
                getDocumentById(id);

        if (!"PDF".equalsIgnoreCase(
                document.getDocumentType()
        )) {
            throw new IllegalArgumentException(
                    "Text extraction is currently supported only for PDF files."
            );
        }

        Path filePath =
                Paths.get(document.getFilePath());

        return documentTextExtractor
                .extractText(filePath);
    }
}