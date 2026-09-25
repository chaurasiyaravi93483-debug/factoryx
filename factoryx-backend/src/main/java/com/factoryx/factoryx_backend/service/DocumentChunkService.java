package com.factoryx.factoryx_backend.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.factoryx.factoryx_backend.entity.DocumentChunk;
import com.factoryx.factoryx_backend.repository.DocumentChunkRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class DocumentChunkService {

    private final DocumentChunkRepository chunkRepository;
    private final EmbeddingService embeddingService;
    private final ObjectMapper objectMapper;

    public DocumentChunkService(
            DocumentChunkRepository chunkRepository,
            EmbeddingService embeddingService
    ) {
        this.chunkRepository = chunkRepository;
        this.embeddingService = embeddingService;
        this.objectMapper = new ObjectMapper();
    }

    // =====================================================
    // CREATE CHUNKS + GENERATE EMBEDDINGS
    // =====================================================

    @Transactional
    public List<DocumentChunk> createChunks(
            Long documentId,
            String text
    ) {

        if (text == null || text.isBlank()) {
            throw new IllegalArgumentException(
                    "Document text is empty."
            );
        }

        // Delete old chunks
        chunkRepository.deleteByDocumentId(documentId);

        int chunkSize = 1000;
        int overlap = 200;

        List<DocumentChunk> chunks = new ArrayList<>();

        int start = 0;
        int chunkIndex = 0;

        while (start < text.length()) {

            int end = Math.min(
                    start + chunkSize,
                    text.length()
            );

            String content =
                    text.substring(start, end).trim();

            if (!content.isBlank()) {

                // Generate embedding using Ollama
                float[] embedding =
                        embeddingService.generateEmbedding(
                                content
                        );

                String embeddingJson;

                try {

                    embeddingJson =
                            objectMapper.writeValueAsString(
                                    embedding
                            );

                } catch (JsonProcessingException e) {

                    throw new RuntimeException(
                            "Failed to convert embedding to JSON.",
                            e
                    );
                }

                DocumentChunk chunk =
                        DocumentChunk.builder()
                                .documentId(documentId)
                                .content(content)
                                .chunkIndex(chunkIndex)
                                .embedding(embeddingJson)
                                .build();

                chunks.add(chunk);

                chunkIndex++;
            }

            if (end >= text.length()) {
                break;
            }

            start = end - overlap;
        }

        return chunkRepository.saveAll(chunks);
    }

    // =====================================================
    // GET CHUNKS
    // =====================================================

    public List<DocumentChunk> getChunks(
            Long documentId
    ) {

        return chunkRepository
                .findByDocumentIdOrderByChunkIndexAsc(
                        documentId
                );
    }
}