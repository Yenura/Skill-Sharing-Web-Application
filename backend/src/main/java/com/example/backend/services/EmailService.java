package com.example.backend.services;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class EmailService {
    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String emailFrom;

    public void sendPasswordResetEmail(String email, String resetToken) {
        if (mailSender == null || emailFrom.isEmpty()) {
            logger.warn("Email service not configured. Would have sent reset token {} to {}", resetToken, email);
            return;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(emailFrom);
            message.setTo(email);
            message.setSubject("Password Reset Request");
            message.setText("To reset your password, click the following link: " +
                          "http://localhost:3000/auth/reset-password?token=" + resetToken);
            mailSender.send(message);
            logger.info("Password reset email sent to {}", email);
        } catch (Exception e) {
            logger.error("Failed to send password reset email to {}: {}", email, e.getMessage());
        }
    }
} 
