package com.example.backend.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.Map;

// This class represents an Analytics entity that is stored in the MongoDB "analytics" collection.
@Document(collection = "analytics")
public class Analytics {
    
    // The unique identifier for each Analytics object in the collection.
    @Id
    private String id;
    
    // The ID of the user associated with the analytics data.
    private String userId;
    
    // The type of the analytics data (e.g., activity, performance).
    private String type;
    
    // The skill type related to the analytics data (e.g., coding, design).
    private String skillType;
    
    // The progress percentage (e.g., completion of a task or activity).
    private double progressPercentage;
    
    // The timestamp when the analytics data was recorded.
    private LocalDateTime timestamp;
    
    // The ID of the content associated with the analytics data (e.g., a specific course or module).
    private String contentId;
    
    // A description of the analytics data (e.g., what it represents or why it's being tracked).
    private String description;
    
    // A Map of additional metadata that may be associated with the analytics data.
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

    // Getter method for the 'type' field.
    public String getType() {
        return type;
    }

    // Setter method for the 'type' field.
    public void setType(String type) {
        this.type = type;
    }

    // Getter method for the 'skillType' field.
    public String getSkillType() {
        return skillType;
    }

    // Setter method for the 'skillType' field.
    public void setSkillType(String skillType) {
        this.skillType = skillType;
    }

    // Getter method for the 'progressPercentage' field.
    public double getProgressPercentage() {
        return progressPercentage;
    }

    // Setter method for the 'progressPercentage' field.
    public void setProgressPercentage(double progressPercentage) {
        this.progressPercentage = progressPercentage;
    }

    // Getter method for the 'timestamp' field.
    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    // Setter method for the 'timestamp' field.
    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    // Getter method for the 'contentId' field.
    public String getContentId() {
        return contentId;
    }

    // Setter method for the 'contentId' field.
    public void setContentId(String contentId) {
        this.contentId = contentId;
    }

    // Getter method for the 'description' field.
    public String getDescription() {
        return description;
    }

    // Setter method for the 'description' field.
    public void setDescription(String description) {
        this.description = description;
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
