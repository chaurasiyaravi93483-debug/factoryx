package com.factoryx.factoryx_backend.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.factoryx.factoryx_backend.entity.DocumentChunk;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
public class RagService {

    private final DocumentChunkService documentChunkService;
    private final EmbeddingService embeddingService;
    private final ObjectMapper objectMapper;

    public RagService(
            DocumentChunkService documentChunkService,
            EmbeddingService embeddingService
    ) {
        this.documentChunkService = documentChunkService;
        this.embeddingService = embeddingService;
        this.objectMapper = new ObjectMapper();
    }

    // =====================================================
    // RAG SEARCH
    // =====================================================

    public List<RagSearchResult> search(
            Long documentId,
            String query,
            int topK
    ) {

        if (query == null || query.isBlank()) {
            throw new IllegalArgumentException(
                    "Query cannot be empty."
            );
        }

        if (topK <= 0) {
            topK = 3;
        }

        // Generate embedding for user query
        float[] queryEmbedding =
                embeddingService.generateEmbedding(query);

        // Get document chunks
        List<DocumentChunk> chunks =
                documentChunkService.getChunks(documentId);

        if (chunks.isEmpty()) {
            return List.of();
        }

        List<RagSearchResult> results =
                new ArrayList<>();

        for (DocumentChunk chunk : chunks) {

            if (chunk.getEmbedding() == null ||
                    chunk.getEmbedding().isBlank()) {
                continue;
            }

            try {

                List<Float> storedEmbedding =
                        objectMapper.readValue(
                                chunk.getEmbedding(),
                                new TypeReference<List<Float>>() {}
                        );

                float[] chunkEmbedding =
                        new float[storedEmbedding.size()];

                for (int i = 0;
                     i < storedEmbedding.size();
                     i++) {

                    chunkEmbedding[i] =
                            storedEmbedding.get(i);
                }

                double similarity =
                        cosineSimilarity(
                                queryEmbedding,
                                chunkEmbedding
                        );

                results.add(
                        new RagSearchResult(
                                chunk.getId(),
                                chunk.getDocumentId(),
                                chunk.getChunkIndex(),
                                chunk.getContent(),
                                similarity
                        )
                );

            } catch (Exception e) {

                throw new RuntimeException(
                        "Failed to process chunk embedding.",
                        e
                );
            }
        }

        // Highest similarity first
        results.sort(
                Comparator.comparingDouble(
                        RagSearchResult::similarity
                ).reversed()
        );

        // Top K results
        return results.stream()
                .limit(topK)
                .toList();
    }

    // =====================================================
    // COSINE SIMILARITY
    // =====================================================

    private double cosineSimilarity(
            float[] vectorA,
            float[] vectorB
    ) {

        if (vectorA.length != vectorB.length) {
            throw new IllegalArgumentException(
                    "Embedding dimensions do not match."
            );
        }

        double dotProduct = 0.0;
        double normA = 0.0;
        double normB = 0.0;

        for (int i = 0; i < vectorA.length; i++) {

            dotProduct +=
                    vectorA[i] * vectorB[i];

            normA +=
                    vectorA[i] * vectorA[i];

            normB +=
                    vectorB[i] * vectorB[i];
        }

        if (normA == 0 || normB == 0) {
            return 0.0;
        }

        return dotProduct /
                (Math.sqrt(normA) * Math.sqrt(normB));
    }

    public String buildContext(
            Long documentId,
            String query,
            int topK
    ) {

        List<RagSearchResult> results =
                search(documentId, query, topK);

        if (results.isEmpty()) {
            return "No relevant information found in the document.";
        }

        StringBuilder context = new StringBuilder();

        for (RagSearchResult result : results) {

            context.append("\n--- Document Chunk ")
                    .append(result.chunkIndex())
                    .append(" ---\n");

            context.append(result.content());

            context.append("\n");
        }

        return context.toString();
    }

    // =====================================================
    // SEARCH RESULT
    // =====================================================

    public record RagSearchResult(
            Long chunkId,
            Long documentId,
            Integer chunkIndex,
            String content,
            double similarity
    ) {
    }
}