package com.skillsharing.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.skillsharing.dto.AuthRequest;
import com.skillsharing.dto.RegisterRequest;
import com.skillsharing.model.User;
import com.skillsharing.repository.UserRepository;
import com.skillsharing.security.JwtService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public Map<String, Object> register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        var user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());

        userRepository.save(user);

        String token = jwtService.generateToken(new org.springframework.security.core.userdetails.User(
            user.getEmail(),
            user.getPassword(),
            java.util.Collections.emptyList()
        ));

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("user", user);
        return response;
    }

    public Map<String, Object> authenticate(AuthRequest request) {
        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );

            var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found with email: " + request.getEmail()));

            String token = jwtService.generateToken(new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                java.util.Collections.emptyList()
            ));

            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("user", user);
            return response;
        } catch (org.springframework.security.authentication.BadCredentialsException e) {
            throw new RuntimeException("Invalid email or password");
        } catch (Exception e) {
            throw new RuntimeException("Authentication failed: " + e.getMessage());
        }
    }
}
