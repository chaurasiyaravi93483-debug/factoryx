package com.factoryx.factoryx_backend.dto;

import lombok.Data;

@Data
public class ChatRequest {

    private String message;

    private Long documentId;
}