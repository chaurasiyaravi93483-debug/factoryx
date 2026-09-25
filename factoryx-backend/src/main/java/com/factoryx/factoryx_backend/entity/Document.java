package com.factoryx.factoryx_backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "documents")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Document {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String documentName;

    @Column(nullable = false)
    private String fileName;

    private String documentType;

    private Long fileSize;

    private String filePath;

    private String uploadedBy;

    private LocalDateTime uploadedAt;

    private String status;
}