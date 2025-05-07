package com.skillsharing.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.skillsharing.model.User;
import com.skillsharing.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataLoader implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Create a test user if it doesn't exist
        if (!userRepository.existsByEmail("test@example.com")) {
            User testUser = new User();
            testUser.setFirstName("Test");
            testUser.setLastName("User");
            testUser.setUsername("testuser");
            testUser.setEmail("test@example.com");
            testUser.setPassword(passwordEncoder.encode("password"));
            testUser.setRole("BEGINNER");
            testUser.setEnabled(true);
            
            userRepository.save(testUser);
            log.info("Test user created with email: test@example.com and password: password");
        } else {
            log.info("Test user already exists");
        }
    }
}
