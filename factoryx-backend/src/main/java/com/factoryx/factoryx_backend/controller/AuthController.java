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

            User user =
                    authService.register(request);

            Map<String, Object> response =
                    new HashMap<>();

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
}