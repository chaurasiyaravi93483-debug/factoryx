package com.factoryx.factoryx_backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "inventory")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Inventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String itemCode;

    @Column(nullable = false)
    private String itemName;

    private String category;

    private Integer quantity;

    private Integer minimumStock;

    private String unit;

    private String status;

    private String location;

    private String supplier;
}