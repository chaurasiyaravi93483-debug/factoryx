package com.factoryx.factoryx_backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String role = "MANAGER";

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // Forgot Password OTP
    @Column(name = "reset_otp")
    private String resetOtp;

    @Column(name = "reset_otp_expiry")
    private LocalDateTime resetOtpExpiry;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();

        if (role == null || role.isBlank()) {
            role = "MANAGER";
        }
    }
}