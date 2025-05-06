package com.skillsharing.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.skillsharing.model.Notification;

public interface NotificationRepository extends MongoRepository<Notification, String> {
    List<Notification> findByUserIdOrderByCreatedAtDesc(String userId);
    List<Notification> findByUserIdAndReadOrderByCreatedAtDesc(String userId, boolean read);
    long countByUserIdAndRead(String userId, boolean read);
    
    // Add method to find by sender ID
    List<Notification> findBySenderId(String senderId);
}
