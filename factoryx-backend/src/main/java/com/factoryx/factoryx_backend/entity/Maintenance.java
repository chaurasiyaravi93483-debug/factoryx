package com.factoryx.factoryx_backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "maintenance")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Maintenance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String maintenanceId;

    private String machine;

    private String issue;

    private String type;

    private String priority;

    private String status;

    private String assignedTo;

    private LocalDate scheduledDate;

    private LocalDate completedDate;

    private String notes;
}