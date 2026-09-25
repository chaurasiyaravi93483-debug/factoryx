package com.factoryx.factoryx_backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "machines")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Machine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String machineCode;

    @Column(nullable = false)
    private String machineName;

    private String type;

    private String location;

    private String status;

    private Double efficiency;

    private Double temperature;

    private Double vibration;

    private String lastMaintenance;
}