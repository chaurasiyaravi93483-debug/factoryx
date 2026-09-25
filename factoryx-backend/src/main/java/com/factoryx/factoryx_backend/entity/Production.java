package com.factoryx.factoryx_backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "production")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Production {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String machine;

    private LocalDate date;

    private String shift;

    private Integer targetQuantity;

    private Integer actualQuantity;

    private Integer defectiveQuantity;

    private Double downtime;

    public Double getProductionEfficiency() {

        if (targetQuantity == null || targetQuantity == 0) {
            return 0.0;
        }

        return (actualQuantity * 100.0) / targetQuantity;
    }

    public Double getDefectRate() {

        if (actualQuantity == null || actualQuantity == 0) {
            return 0.0;
        }

        return (defectiveQuantity * 100.0) / actualQuantity;
    }
}