package com.example.backend.repositories;

import com.example.backend.models.Analytics;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AnalyticsRepository extends MongoRepository<Analytics, String> {
    List<Analytics> findByUserIdAndTimestampAfter(String userId, LocalDateTime timestamp);
    List<Analytics> findByUserIdAndType(String userId, String type);
    List<Analytics> findByContentIdAndTimestampAfter(String contentId, LocalDateTime timestamp);
    List<Analytics> findByUserIdAndSkillType(String userId, String skillType);
} 
