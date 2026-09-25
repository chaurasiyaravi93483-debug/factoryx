package com.factoryx.factoryx_backend.service;

import com.factoryx.factoryx_backend.dto.LoginRequest;
import com.factoryx.factoryx_backend.dto.RegisterRequest;
import com.factoryx.factoryx_backend.entity.User;
import com.factoryx.factoryx_backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final JwtService jwtService;


    // ==============================
    // REGISTER
    // ==============================

    public User register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {

            throw new RuntimeException(
                    "Email already registered"
            );
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(
                        passwordEncoder.encode(
                                request.getPassword()
                        )
                )
                .role("MANAGER")
                .build();

        return userRepository.save(user);
    }


    // ==============================
    // LOGIN
    // ==============================

    public String login(LoginRequest request) {

        User user =
                userRepository
                        .findByEmail(request.getEmail())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Invalid email or password"
                                )
                        );


        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword()
        )) {

            throw new RuntimeException(
                    "Invalid email or password"
            );
        }


        return jwtService.generateToken(
                user.getEmail(),
                user.getRole()
        );
    }
}