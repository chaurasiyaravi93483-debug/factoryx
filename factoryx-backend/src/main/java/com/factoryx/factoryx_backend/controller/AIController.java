package com.factoryx.factoryx_backend.controller;

import com.factoryx.factoryx_backend.dto.ChatRequest;
import com.factoryx.factoryx_backend.service.AIService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AIController {

    private final AIService aiService;

    @PostMapping("/chat")
    public ResponseEntity<Map<String, String>> chat(
            @RequestBody ChatRequest request
    ) {

        String response;

        if (request.getDocumentId() != null) {

            response = aiService.generateResponse(
                    request.getMessage(),
                    request.getDocumentId()
            );

        } else {

            response = aiService.generateResponse(
                    request.getMessage()
            );
        }

        return ResponseEntity.ok(
                Map.of("response", response)
        );
    }

    @GetMapping("/config-check")
    public ResponseEntity<Map<String, Object>> configCheck() {

        return ResponseEntity.ok(
                aiService.getConfigurationStatus()
        );
    }
}