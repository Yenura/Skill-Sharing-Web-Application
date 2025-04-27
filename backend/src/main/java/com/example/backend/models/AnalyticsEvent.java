package com.example.backend.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.Map;

// This class represents an AnalyticsEvent entity that is stored in the MongoDB "analytics_events" collection.
@Document(collection = "analytics_events")
public class AnalyticsEvent {
    
    // The unique identifier for each AnalyticsEvent object in the collection.
    @Id
    private String id;
    
    // The ID of the user associated with the analytics event.
    private String userId;
    
    // The type of the event (e.g., click, view, completion).
    private String eventType;
    
    // The ID of the content associated with the event (e.g., a specific course or module).
    private String contentId;
    
    // The timestamp when the event occurred.
    private LocalDateTime timestamp;
    
    // A Map of additional metadata that may be associated with the analytics event.
    private Map<String, Object> metadata;

    // Getter method for the 'id' field.
    public String getId() {
        return id;
    }

    // Setter method for the 'id' field.
    public void setId(String id) {
        this.id = id;
    }

    // Getter method for the 'userId' field.
    public String getUserId() {
        return userId;
    }

    // Setter method for the 'userId' field.
    public void setUserId(String userId) {
        this.userId = userId;
    }

    // Getter method for the 'eventType' field.
    public String getEventType() {
        return eventType;
    }

    // Setter method for the 'eventType' field.
    public void setEventType(String eventType) {
        this.eventType = eventType;
    }

    // Getter method for the 'contentId' field.
    public String getContentId() {
        return contentId;
    }

    // Setter method for the 'contentId' field.
    public void setContentId(String contentId) {
        this.contentId = contentId;
    }

    // Getter method for the 'timestamp' field.
    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    // Setter method for the 'timestamp' field.
    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    // Getter method for the 'metadata' field.
    public Map<String, Object> getMetadata() {
        return metadata;
    }

    // Setter method for the 'metadata' field..
    public void setMetadata(Map<String, Object> metadata) {
        this.metadata = metadata;
    }
}
