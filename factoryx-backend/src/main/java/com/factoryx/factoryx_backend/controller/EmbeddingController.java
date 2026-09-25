package com.factoryx.factoryx_backend.controller;

import com.factoryx.factoryx_backend.service.EmbeddingService;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/embedding")
public class EmbeddingController {

    private final EmbeddingService embeddingService;

    public EmbeddingController(
            EmbeddingService embeddingService
    ) {
        this.embeddingService = embeddingService;
    }


    // =====================================================
    // TEST EMBEDDING
    // =====================================================

    @GetMapping("/test")
    public ResponseEntity<?> testEmbedding(
            @RequestParam String text
    ) {

        try {

            float[] embedding =
                    embeddingService.generateEmbedding(text);

            return ResponseEntity.ok(
                    Map.of(
                            "text", text,
                            "dimensions", embedding.length,
                            "embedding", embedding
                    )
            );

        } catch (Exception e) {

            return ResponseEntity
                    .status(
                            HttpStatus.INTERNAL_SERVER_ERROR
                    )
                    .body(
                            "Embedding generation failed: "
                                    + e.getMessage()
                    );
        }
    }
}