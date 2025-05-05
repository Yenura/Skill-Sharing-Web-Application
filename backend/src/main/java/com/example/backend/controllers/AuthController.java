package com.example.backend.controllers;

import com.example.backend.config.TokenGenerator;
import com.example.backend.dto.LoginDTO;
import com.example.backend.dto.SignupDTO;
import com.example.backend.dto.ForgotPasswordDTO;
import com.example.backend.dto.ResetPasswordDTO;
import com.example.backend.models.User;
import com.example.backend.repositories.UserRepository;
import com.example.backend.services.EmailService;
import com.example.backend.exception.ErrorDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.UserDetailsManager;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.UUID;
import java.time.LocalDateTime;
import java.util.Date;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.Map;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/auth")
public class AuthController {
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    
    @Autowired
    private UserDetailsManager userDetailsManager;

    @Autowired
    private TokenGenerator tokenGenerator;

    @Autowired
    private DaoAuthenticationProvider daoAuthenticationProvider;

    @Autowired
    private EmailService emailService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody SignupDTO signupDTO) {
        try {
            // Check if email already exists
            if (userRepository.findByEmail(signupDTO.getEmail()).isPresent()) { // Use Optional's isPresent()
                return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new ErrorDetails(new Date(), "Email address already registered!", null)); // Updated error message
            }

            // Username uniqueness is no longer checked here

            User user = new User();
            user.setUsername(signupDTO.getUsername()); // Still set the username
            user.setEmail(signupDTO.getEmail());
            user.setPassword(passwordEncoder.encode(signupDTO.getPassword()));
            user.setEnabled(true);
            user = userRepository.save(user);

            Authentication authentication = UsernamePasswordAuthenticationToken.authenticated(
                user, signupDTO.getPassword(), Collections.EMPTY_LIST);
            return ResponseEntity.ok(tokenGenerator.createToken(authentication));
        } catch (Exception ex) {
            logger.error("Error in registration:", ex);
            return ResponseEntity.internalServerError()
                .body(new ErrorDetails(new Date(), "An unexpected error occurred", ex.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO loginDTO) {
        try {
            Authentication authentication = daoAuthenticationProvider.authenticate(
                    UsernamePasswordAuthenticationToken.unauthenticated(
                        loginDTO.getEmail(),
                        loginDTO.getPassword()
                    )
            );
            return ResponseEntity.ok(tokenGenerator.createToken(authentication));
        } catch (BadCredentialsException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new ErrorDetails(new Date(), "Invalid username or password", null));
        } catch (Exception ex) {
            logger.error("Login error:", ex);
            return ResponseEntity.internalServerError()
                .body(new ErrorDetails(new Date(), "An unexpected error occurred", ex.getMessage()));
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordDTO forgotPasswordDTO) {
        try {
            String email = forgotPasswordDTO.getEmail();
            Optional<User> userOptional = userRepository.findByEmail(email);
            
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                String resetToken = UUID.randomUUID().toString();
                user.setResetToken(resetToken);
                user.setResetTokenExpiry(LocalDateTime.now().plusHours(1));
                userRepository.save(user);
                emailService.sendPasswordResetEmail(email, resetToken);
            }
            
            return ResponseEntity.ok()
                .body(new ErrorDetails(new Date(), "If an account exists with that email, password reset instructions have been sent", null));
        } catch (Exception ex) {
            logger.error("Error in forgot password:", ex);
            return ResponseEntity.internalServerError()
                .body(new ErrorDetails(new Date(), "Error processing request", ex.getMessage()));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        String newPassword = request.get("newPassword");
        
        if (token == null || newPassword == null) {
            return ResponseEntity.badRequest().body("Token and new password are required");
        }
        
        User user = userRepository.findByResetToken(token);
        if (user == null) {
            return ResponseEntity.badRequest().body("Invalid token");
        }
        
        if (user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            return ResponseEntity.badRequest().body("Token has expired");
        }
        
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userRepository.save(user);
        
        return ResponseEntity.ok("Password has been reset successfully");
    }

    @PostMapping("/validate-token")
    public ResponseEntity<?> validateToken(@RequestHeader("Authorization") String token) {
        try {
            if (token == null || !token.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorDetails(new Date(), "Invalid token format", null));
            }
            
            String jwtToken = token.substring(7);
            boolean isValid = tokenGenerator.validateToken(jwtToken);
            
            if (isValid) {
                return ResponseEntity.ok()
                    .body(new ErrorDetails(new Date(), "Token is valid", null));
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorDetails(new Date(), "Token is invalid or expired", null));
            }
        } catch (Exception ex) {
            logger.error("Error validating token:", ex);
            return ResponseEntity.internalServerError()
                .body(new ErrorDetails(new Date(), "Error processing request", ex.getMessage()));
        }
    }
}
