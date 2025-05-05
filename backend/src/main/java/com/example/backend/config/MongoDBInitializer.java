package com.example.backend.config;

import com.example.backend.models.User;
import com.example.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.HashSet;

@Component
public class MongoDBInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(MongoDBInitializer.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        try {
            // Check if admin user exists
            Optional<User> adminUser = userRepository.findByEmail("admin@example.com");
            
            if (adminUser.isEmpty()) {
                logger.info("Creating default admin user");
                
                // Create admin user if it doesn't exist
                User admin = new User();
                admin.setUsername("admin");
                admin.setEmail("admin@example.com");
                admin.setPassword(passwordEncoder.encode("admin123"));
                HashSet<String> adminRoles = new HashSet<>();
                adminRoles.add("ROLE_ADMIN");
                admin.setRoles(adminRoles);
                admin.setCreatedAt(LocalDateTime.now());
                admin.setEnabled(true);
                
                userRepository.save(admin);
                logger.info("Default admin user created successfully");
                
                // Create a test user
                User testUser = new User();
                testUser.setUsername("testuser");
                testUser.setEmail("test@example.com");
                testUser.setPassword(passwordEncoder.encode("password123"));
                HashSet<String> userRoles = new HashSet<>();
                userRoles.add("ROLE_USER");
                testUser.setRoles(userRoles);
                testUser.setCreatedAt(LocalDateTime.now());
                testUser.setEnabled(true);
                
                userRepository.save(testUser);
                logger.info("Test user created successfully");
            } else {
                logger.info("Admin user already exists, skipping initialization");
            }
        } catch (Exception e) {
            logger.error("Error initializing MongoDB with default users", e);
        }
    }
}
