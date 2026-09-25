package com.factoryx.factoryx_backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "incidents")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Incident {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String incidentId;

    @Column(nullable = false)
    private String title;

    private String machine;

    private String location;

    private String severity;

    private String status;

    private String assignedTeam;

    private LocalDateTime createdAt;
}