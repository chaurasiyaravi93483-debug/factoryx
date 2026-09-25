package com.factoryx.factoryx_backend.controller;

import com.factoryx.factoryx_backend.entity.Document;
import com.factoryx.factoryx_backend.entity.DocumentChunk;
import com.factoryx.factoryx_backend.service.DocumentChunkService;
import com.factoryx.factoryx_backend.service.DocumentService;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/documents")
public class DocumentController {

    private final DocumentService documentService;
    private final DocumentChunkService documentChunkService;


    public DocumentController(
            DocumentService documentService,
            DocumentChunkService documentChunkService
    ) {
        this.documentService = documentService;
        this.documentChunkService = documentChunkService;
    }


    // =====================================================
    // UPLOAD
    // =====================================================

    @PostMapping("/upload")
    public ResponseEntity<?> uploadDocument(
            @RequestParam("file") MultipartFile file,
            Principal principal
    ) {

        try {

            String username =
                    principal != null
                            ? principal.getName()
                            : "Unknown";

            Document document =
                    documentService.uploadDocument(
                            file,
                            username
                    );

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(document);

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());

        } catch (Exception e) {

            return ResponseEntity
                    .status(
                            HttpStatus.INTERNAL_SERVER_ERROR
                    )
                    .body(
                            "Document upload failed."
                    );
        }
    }


    // =====================================================
    // GET ALL DOCUMENTS
    // =====================================================

    @GetMapping
    public ResponseEntity<List<Document>> getAllDocuments() {

        return ResponseEntity.ok(
                documentService.getAllDocuments()
        );
    }


    // =====================================================
    // GET DOCUMENT BY ID
    // =====================================================

    @GetMapping("/{id}")
    public ResponseEntity<Document> getDocument(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                documentService.getDocumentById(id)
        );
    }


    // =====================================================
    // EXTRACT PDF TEXT
    // =====================================================

    @GetMapping("/{id}/text")
    public ResponseEntity<?> extractDocumentText(
            @PathVariable Long id
    ) {

        try {

            String text =
                    documentService.extractPdfText(id);

            return ResponseEntity.ok(text);

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());

        } catch (Exception e) {

            return ResponseEntity
                    .status(
                            HttpStatus.INTERNAL_SERVER_ERROR
                    )
                    .body(
                            "Text extraction failed: "
                                    + e.getMessage()
                    );
        }
    }


    // =====================================================
    // CREATE DOCUMENT CHUNKS
    // =====================================================

    @GetMapping("/{id}/chunks")
    public ResponseEntity<?> createDocumentChunks(
            @PathVariable Long id
    ) {

        try {

            String text =
                    documentService.extractPdfText(id);

            List<DocumentChunk> chunks =
                    documentChunkService.createChunks(
                            id,
                            text
                    );

            return ResponseEntity.ok(chunks);

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());

        } catch (Exception e) {

            return ResponseEntity
                    .status(
                            HttpStatus.INTERNAL_SERVER_ERROR
                    )
                    .body(
                            "Chunk creation failed: "
                                    + e.getMessage()
                    );
        }
    }


    // =====================================================
    // GET EXISTING DOCUMENT CHUNKS
    // =====================================================

    @GetMapping("/{id}/chunks/list")
    public ResponseEntity<?> getDocumentChunks(
            @PathVariable Long id
    ) {

        try {

            List<DocumentChunk> chunks =
                    documentChunkService.getChunks(id);

            return ResponseEntity.ok(chunks);

        } catch (Exception e) {

            return ResponseEntity
                    .status(
                            HttpStatus.INTERNAL_SERVER_ERROR
                    )
                    .body(
                            "Failed to get document chunks: "
                                    + e.getMessage()
                    );
        }
    }


    // =====================================================
    // DOWNLOAD DOCUMENT
    // =====================================================

    @GetMapping("/{id}/download")
    public ResponseEntity<?> downloadDocument(
            @PathVariable Long id
    ) {

        try {

            Path path =
                    documentService.getFilePath(id);

            Resource resource =
                    new UrlResource(
                            path.toUri()
                    );


            if (!resource.exists()) {

                return ResponseEntity
                        .notFound()
                        .build();
            }


            Document document =
                    documentService.getDocumentById(id);


            MediaType mediaType =
                    MediaType.APPLICATION_OCTET_STREAM;


            if ("PDF".equalsIgnoreCase(
                    document.getDocumentType()
            )) {

                mediaType =
                        MediaType.APPLICATION_PDF;
            }


            return ResponseEntity.ok()
                    .contentType(mediaType)
                    .header(
                            HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=\"" +
                                    document.getDocumentName() +
                                    "\""
                    )
                    .body(resource);

        } catch (Exception e) {

            return ResponseEntity
                    .status(
                            HttpStatus.INTERNAL_SERVER_ERROR
                    )
                    .body(
                            "Document download failed."
                    );
        }
    }


    // =====================================================
    // DELETE
    // =====================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDocument(
            @PathVariable Long id
    ) {

        try {

            documentService.deleteDocument(id);

            return ResponseEntity.ok(
                    "Document deleted successfully."
            );

        } catch (Exception e) {

            return ResponseEntity
                    .status(
                            HttpStatus.INTERNAL_SERVER_ERROR
                    )
                    .body(
                            "Document deletion failed."
                    );
        }
    }
}