package com.factoryx.factoryx_backend.controller;

import com.factoryx.factoryx_backend.service.RagService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rag")
public class RagController {

    private final RagService ragService;

    public RagController(RagService ragService) {
        this.ragService = ragService;
    }

    // =====================================================
    // RAG SEARCH
    // =====================================================

    @GetMapping("/search")
    public ResponseEntity<?> search(
            @RequestParam Long documentId,
            @RequestParam String query,
            @RequestParam(defaultValue = "3") int topK
    ) {

        try {

            List<RagService.RagSearchResult> results =
                    ragService.search(
                            documentId,
                            query,
                            topK
                    );

            return ResponseEntity.ok(results);

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());

        } catch (Exception e) {

            return ResponseEntity
                    .internalServerError()
                    .body(
                            "RAG search failed: "
                                    + e.getMessage()
                    );
        }
    }
}