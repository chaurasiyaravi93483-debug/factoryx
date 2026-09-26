package com.factoryx.factoryx_backend.controller;

import com.factoryx.factoryx_backend.dto.LoginRequest;
import com.factoryx.factoryx_backend.dto.RegisterRequest;
import com.factoryx.factoryx_backend.entity.User;
import com.factoryx.factoryx_backend.service.AuthService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;


    // =========================================
    // REGISTER
    // =========================================

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @Valid @RequestBody RegisterRequest request
    ) {

        try {

            User user = authService.register(request);

            Map<String, Object> response = new HashMap<>();

            response.put(
                    "message",
                    "Registration successful"
            );

            response.put(
                    "id",
                    user.getId()
            );

            response.put(
                    "name",
                    user.getName()
            );

            response.put(
                    "email",
                    user.getEmail()
            );

            response.put(
                    "role",
                    user.getRole()
            );

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(response);

        } catch (RuntimeException e) {

            Map<String, String> error = new HashMap<>();

            error.put(
                    "message",
                    e.getMessage()
            );

            return ResponseEntity
                    .badRequest()
                    .body(error);
        }
    }


    // =========================================
    // LOGIN
    // =========================================

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @Valid @RequestBody LoginRequest request
    ) {

        try {

            String token =
                    authService.login(request);

            Map<String, Object> response =
                    new HashMap<>();

            response.put(
                    "message",
                    "Login successful"
            );

            response.put(
                    "token",
                    token
            );

            response.put(
                    "email",
                    request.getEmail()
            );

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {

            Map<String, String> error =
                    new HashMap<>();

            error.put(
                    "message",
                    e.getMessage()
            );

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(error);
        }
    }


    // =========================================
    // FORGOT PASSWORD
    // SEND OTP
    // =========================================

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(
            @RequestBody Map<String, String> request
    ) {

        try {

            String email = request.get("email");

            if (email == null || email.isBlank()) {

                throw new RuntimeException(
                        "Email is required"
                );
            }

            authService.forgotPassword(email);

            Map<String, String> response =
                    new HashMap<>();

            response.put(
                    "message",
                    "OTP sent successfully to your email"
            );

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {

            Map<String, String> error =
                    new HashMap<>();

            error.put(
                    "message",
                    e.getMessage()
            );

            return ResponseEntity
                    .badRequest()
                    .body(error);
        }
    }


    // =========================================
    // VERIFY OTP
    // =========================================

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(
            @RequestBody Map<String, String> request
    ) {

        try {

            String email = request.get("email");
            String otp = request.get("otp");

            if (email == null || email.isBlank()) {

                throw new RuntimeException(
                        "Email is required"
                );
            }

            if (otp == null || otp.isBlank()) {

                throw new RuntimeException(
                        "OTP is required"
                );
            }

            authService.verifyOtp(
                    email,
                    otp
            );

            Map<String, String> response =
                    new HashMap<>();

            response.put(
                    "message",
                    "OTP verified successfully"
            );

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {

            Map<String, String> error =
                    new HashMap<>();

            error.put(
                    "message",
                    e.getMessage()
            );

            return ResponseEntity
                    .badRequest()
                    .body(error);
        }
    }


    // =========================================
    // RESET PASSWORD
    // =========================================

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(
            @RequestBody Map<String, String> request
    ) {

        try {

            String email = request.get("email");
            String otp = request.get("otp");
            String newPassword =
                    request.get("newPassword");

            if (email == null || email.isBlank()) {

                throw new RuntimeException(
                        "Email is required"
                );
            }

            if (otp == null || otp.isBlank()) {

                throw new RuntimeException(
                        "OTP is required"
                );
            }

            if (
                    newPassword == null ||
                            newPassword.isBlank()
            ) {

                throw new RuntimeException(
                        "New password is required"
                );
            }

            authService.resetPassword(
                    email,
                    otp,
                    newPassword
            );

            Map<String, String> response =
                    new HashMap<>();

            response.put(
                    "message",
                    "Password reset successfully"
            );

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {

            Map<String, String> error =
                    new HashMap<>();

            error.put(
                    "message",
                    e.getMessage()
            );

            return ResponseEntity
                    .badRequest()
                    .body(error);
        }
    }
}