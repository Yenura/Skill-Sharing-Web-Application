package com.example.backend.repositories;

import com.example.backend.models.NotificationPreference;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface NotificationPreferenceRepository extends MongoRepository<NotificationPreference, String> {
    
    Optional<NotificationPreference> findByUserId(String userId);
    
    void deleteByUserId(String userId);
}
