package com.example.backend.model;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SearchResult {
    private String id;
    private String type;        // e.g., "learning_plan", "recipe", "group"
    private String title;
    private String description;
    private String creatorId;
    private String creatorName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Map<String, String> highlights;  // Field name -> highlighted snippet
    private double relevanceScore;
    private Map<String, Object> metadata;    // Additional type-specific data
    
    // Custom getters for type-specific metadata
    @SuppressWarnings("unchecked")
    public <T> T getMetadata(String key, Class<T> type) {
        return metadata != null ? type.cast(metadata.get(key)) : null;
    }
    
    public String getHighlight(String field) {
        return highlights != null ? highlights.get(field) : null;
    }
} 
