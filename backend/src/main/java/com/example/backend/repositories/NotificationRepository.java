package com.example.backend.repositories;

import com.example.backend.models.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface NotificationRepository extends MongoRepository<Notification, String> {
    Page<Notification> findByUserIdOrderByCreatedAtDesc(String userId, Pageable pageable);
    List<Notification> findByUserIdAndReadFalseOrderByCreatedAtDesc(String userId);
    List<Notification> findByUserIdAndReadFalse(String userId);
    void deleteByCreatedAtBefore(LocalDateTime dateTime);
    
    // Admin methods
    void deleteByUserId(String userId);
    long countByUserIdAndReadFalse(String userId);
}
