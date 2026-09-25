package com.factoryx.factoryx_backend.service;

import org.springframework.ai.embedding.EmbeddingModel;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmbeddingService {

    private final EmbeddingModel embeddingModel;

    public EmbeddingService(
            EmbeddingModel embeddingModel
    ) {
        this.embeddingModel = embeddingModel;
    }

    // =====================================================
    // GENERATE SINGLE EMBEDDING
    // =====================================================

    public float[] generateEmbedding(String text) {

        if (text == null || text.isBlank()) {
            throw new IllegalArgumentException(
                    "Text cannot be empty."
            );
        }

        return embeddingModel.embed(text);
    }


    // =====================================================
    // GENERATE MULTIPLE EMBEDDINGS
    // =====================================================

    public List<float[]> generateEmbeddings(
            List<String> texts
    ) {

        if (texts == null || texts.isEmpty()) {
            throw new IllegalArgumentException(
                    "Texts cannot be empty."
            );
        }

        return texts.stream()
                .map(embeddingModel::embed)
                .toList();
    }
}