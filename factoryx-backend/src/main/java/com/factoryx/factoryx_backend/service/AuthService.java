package com.factoryx.factoryx_backend.service;

import com.factoryx.factoryx_backend.dto.LoginRequest;
import com.factoryx.factoryx_backend.dto.RegisterRequest;
import com.factoryx.factoryx_backend.entity.User;
import com.factoryx.factoryx_backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final JwtService jwtService;

    private final JavaMailSender mailSender;


    // =========================================
    // REGISTER
    // =========================================

    public User register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
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


    // =========================================
    // LOGIN
    // =========================================

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


    // =========================================
    // FORGOT PASSWORD - SEND OTP
    // =========================================

    public void forgotPassword(String email) {

        User user =
                userRepository
                        .findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Email not registered"
                                )
                        );

        // Generate 6 digit OTP
        String otp =
                String.format(
                        "%06d",
                        new Random().nextInt(1000000)
                );

        // OTP valid for 5 minutes
        LocalDateTime expiry =
                LocalDateTime.now().plusMinutes(5);

        user.setResetOtp(otp);
        user.setResetOtpExpiry(expiry);

        userRepository.save(user);

        // Send OTP through Gmail
        SimpleMailMessage message =
                new SimpleMailMessage();

        message.setTo(user.getEmail());

        message.setSubject(
                "FACTORYX AI - Password Reset OTP"
        );

        message.setText(
                "Hello " + user.getName() + ",\n\n"
                        + "Your FACTORYX AI password reset OTP is:\n\n"
                        + otp + "\n\n"
                        + "This OTP is valid for 5 minutes.\n\n"
                        + "If you did not request a password reset, "
                        + "please ignore this email.\n\n"
                        + "Regards,\n"
                        + "FACTORYX AI Team"
        );

        mailSender.send(message);
    }


    // =========================================
    // VERIFY OTP
    // =========================================

    public void verifyOtp(
            String email,
            String otp
    ) {

        User user =
                userRepository
                        .findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Email not registered"
                                )
                        );

        if (user.getResetOtp() == null ||
                user.getResetOtpExpiry() == null) {

            throw new RuntimeException(
                    "OTP not requested"
            );
        }

        if (
                LocalDateTime.now()
                        .isAfter(user.getResetOtpExpiry())
        ) {

            user.setResetOtp(null);
            user.setResetOtpExpiry(null);

            userRepository.save(user);

            throw new RuntimeException(
                    "OTP has expired"
            );
        }

        if (!user.getResetOtp().equals(otp)) {

            throw new RuntimeException(
                    "Invalid OTP"
            );
        }
    }


    // =========================================
    // RESET PASSWORD
    // =========================================

    public void resetPassword(
            String email,
            String otp,
            String newPassword
    ) {

        User user =
                userRepository
                        .findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Email not registered"
                                )
                        );

        // Check OTP exists
        if (user.getResetOtp() == null ||
                user.getResetOtpExpiry() == null) {

            throw new RuntimeException(
                    "OTP not requested"
            );
        }

        // Check OTP expiry
        if (
                LocalDateTime.now()
                        .isAfter(user.getResetOtpExpiry())
        ) {

            user.setResetOtp(null);
            user.setResetOtpExpiry(null);

            userRepository.save(user);

            throw new RuntimeException(
                    "OTP has expired"
            );
        }

        // Check OTP
        if (!user.getResetOtp().equals(otp)) {

            throw new RuntimeException(
                    "Invalid OTP"
            );
        }

        // Password validation
        if (newPassword == null ||
                newPassword.length() < 6) {

            throw new RuntimeException(
                    "Password must contain at least 6 characters"
            );
        }

        // Update password
        user.setPassword(
                passwordEncoder.encode(newPassword)
        );

        // Clear OTP
        user.setResetOtp(null);
        user.setResetOtpExpiry(null);

        userRepository.save(user);
    }
}