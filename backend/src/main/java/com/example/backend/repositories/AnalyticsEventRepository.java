package com.example.backend.repositories;

import com.example.backend.models.AnalyticsEvent;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AnalyticsEventRepository extends MongoRepository<AnalyticsEvent, String> {
    List<AnalyticsEvent> findByUserIdAndTimestampAfter(String userId, LocalDateTime timestamp);
    List<AnalyticsEvent> findByEventTypeAndTimestampAfter(String eventType, LocalDateTime timestamp);
    List<AnalyticsEvent> findByContentIdAndTimestampAfter(String contentId, LocalDateTime timestamp);
    List<AnalyticsEvent> findByUserIdAndEventType(String userId, String eventType);
} 
