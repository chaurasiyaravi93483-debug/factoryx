package com.factoryx.factoryx_backend.config;

import lombok.RequiredArgsConstructor;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;


    // =====================================================
    // PASSWORD ENCODER
    // =====================================================

    @Bean
    public PasswordEncoder passwordEncoder() {

        return new BCryptPasswordEncoder();
    }


    // =====================================================
    // SECURITY FILTER CHAIN
    // =====================================================

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http
    ) throws Exception {

        http

                // -------------------------------------------------
                // CSRF
                // -------------------------------------------------

                .csrf(csrf ->
                        csrf.disable()
                )


                // -------------------------------------------------
                // CORS
                // -------------------------------------------------

                // CorsConfig.java already provides
                // CorsConfigurationSource bean.
                .cors(cors -> {})


                // -------------------------------------------------
                // SESSION
                // -------------------------------------------------

                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )


                // -------------------------------------------------
                // AUTHORIZATION
                // -------------------------------------------------

                .authorizeHttpRequests(auth ->

                        auth

                                // CORS preflight
                                .requestMatchers(
                                        org.springframework.http.HttpMethod.OPTIONS,
                                        "/**"
                                )
                                .permitAll()


                                // Authentication + Health Check
                                .requestMatchers(
                                        "/api/auth/**",
                                        "/health"
                                )
                                .permitAll()


                                // All other APIs need JWT
                                .anyRequest()
                                .authenticated()
                )


                // -------------------------------------------------
                // JWT FILTER
                // -------------------------------------------------

                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );


        return http.build();
    }
}