package com.factoryx.factoryx_backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "quality")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Quality {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String qualityId;

    private String product;

    private String machine;

    private String team;

    private Double qualityScore;

    private Integer defects;

    private String status;
}