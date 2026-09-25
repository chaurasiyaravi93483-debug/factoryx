package com.factoryx.factoryx_backend.service;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class AIService {

    private final ChatClient chatClient;
    private final RagService ragService;

    @Value("${spring.ai.openai.api-key:}")
    private String apiKey;

    @Value("${spring.ai.openai.base-url:}")
    private String baseUrl;

    @Value("${spring.ai.openai.chat.model:}")
    private String model;

    public AIService(
            ChatClient.Builder chatClientBuilder,
            RagService ragService
    ) {

        this.ragService = ragService;

        this.chatClient = chatClientBuilder
                .defaultSystem("""
                        You are FactoryX AI, an intelligent smart factory
                        operations assistant.

                        You are part of the FactoryX AI Smart Factory
                        Management System.

                        Help users analyze:

                        - Production
                        - Machine performance
                        - OEE
                        - Maintenance
                        - Quality
                        - Inventory
                        - Factory incidents

                        Give clear, practical and concise answers.

                        Use bullet points when useful.

                        Explain technical concepts in simple language.

                        Do not invent FactoryX data.

                        If required live factory data is unavailable,
                        clearly say that the required data is not currently
                        available.

                        Do not claim that an action was performed unless
                        the system actually performed it.

                        When document context is provided, use that context
                        to answer the user's question.

                        Do not invent information that is not present in
                        the provided document context.

                        If the document context does not contain the answer,
                        clearly say that the information was not found in
                        the provided document.

                        When generating factory reports:

                        - Use only the factory data provided in the prompt.
                        - Clearly separate facts from observations.
                        - Do not invent missing numbers.
                        - Mention important operational issues.
                        - Mention areas that require attention.
                        - Give practical recommendations.
                        """)
                .build();
    }


    // =====================================================
    // CONFIGURATION STATUS
    // =====================================================

    public Map<String, Object> getConfigurationStatus() {

        return Map.of(
                "apiKeyPresent",
                apiKey != null && !apiKey.isBlank(),

                "apiKeyLength",
                apiKey == null ? 0 : apiKey.length(),

                "baseUrl",
                baseUrl,

                "model",
                model
        );
    }


    // =====================================================
    // NORMAL AI CHAT
    // =====================================================

    public String generateResponse(String message) {

        if (message == null || message.trim().isEmpty()) {
            return "Please enter a question.";
        }

        try {

            String response = chatClient
                    .prompt()
                    .user(message.trim())
                    .call()
                    .content();

            if (response == null || response.isBlank()) {
                return "I couldn't generate a response right now.";
            }

            return response;

        } catch (Exception e) {

            e.printStackTrace();

            return "FactoryX AI is temporarily unavailable. Please try again.";
        }
    }


    // =====================================================
    // RAG + GROQ AI CHAT
    // =====================================================

    public String generateResponse(
            String message,
            Long documentId
    ) {

        if (message == null || message.trim().isEmpty()) {
            return "Please enter a question.";
        }

        if (documentId == null) {
            return generateResponse(message);
        }

        try {

            // Search relevant document chunks
            String context = ragService.buildContext(
                    documentId,
                    message.trim(),
                    3
            );


            // Create RAG prompt
            String ragPrompt = """
                    Answer the user's question using the document
                    context provided below.

                    DOCUMENT CONTEXT:
                    ----------------
                    %s
                    ----------------

                    USER QUESTION:
                    %s

                    Instructions:
                    - Use the document context as the primary source.
                    - Do not invent information.
                    - If the answer is not available in the context,
                      clearly say that it was not found in the document.
                    - Give a clear and concise answer.
                    - Use bullet points when useful.
                    """.formatted(
                    context,
                    message.trim()
            );


            // Send to Groq
            String response = chatClient
                    .prompt()
                    .user(ragPrompt)
                    .call()
                    .content();

            if (response == null || response.isBlank()) {
                return "I couldn't generate a response right now.";
            }

            return response;

        } catch (Exception e) {

            e.printStackTrace();

            return "FactoryX AI could not process the document-based question right now.";
        }
    }


    // =====================================================
    // AI FACTORY REPORT
    // =====================================================

    public String generateFactoryReport(
            String factoryData
    ) {

        if (factoryData == null ||
                factoryData.trim().isEmpty()) {

            return "Factory data is not available for report generation.";
        }


        try {

            String reportPrompt = """
                    Generate a FactoryX Smart Factory operational report
                    using ONLY the factory data provided below.

                    FACTORY DATA
                    ====================

                    %s

                    ====================

                    REPORT REQUIREMENTS

                    Create a professional factory management report with
                    the following sections:

                    1. Executive Summary
                    2. Production Analysis
                    3. Machine Performance
                    4. Maintenance Overview
                    5. Inventory Status
                    6. Quality Analysis
                    7. Incident Analysis
                    8. Key Issues Requiring Attention
                    9. Recommended Actions

                    Rules:

                    - Use only the provided data.
                    - Do not invent numbers.
                    - Do not assume missing information.
                    - If a section has insufficient data, clearly mention
                      that the data is unavailable.
                    - Highlight important issues.
                    - Use bullet points where appropriate.
                    - Keep the report clear and useful for a factory manager.
                    - Base recommendations only on observed data.
                    """.formatted(
                    factoryData
            );


            String response = chatClient
                    .prompt()
                    .user(reportPrompt)
                    .call()
                    .content();


            if (response == null ||
                    response.isBlank()) {

                return "FactoryX AI could not generate the report.";
            }


            return response;

        } catch (Exception e) {

            e.printStackTrace();

            return "FactoryX AI is temporarily unavailable while generating the factory report.";
        }
    }
}