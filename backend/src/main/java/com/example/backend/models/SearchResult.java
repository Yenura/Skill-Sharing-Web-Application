package com.example.backend.model;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;

// Data annotation automatically generates getters, setters, toString, equals, and hashCode methods
@Data
// Builder pattern for creating instances with optional parameters
@Builder
// No arguments constructor for initializing the object with default values
@NoArgsConstructor
// All arguments constructor for initializing the object with all values
@AllArgsConstructor
public class SearchResult {
    
    // Unique identifier for the search result (e.g., ID of the recipe or learning plan)
    private String id; 
    
    // The type of the content being searched (e.g., "learning_plan", "recipe", "group")
    private String type; 
    
    // The title of the content (e.g., recipe name, group name, etc.)
    private String title; 
    
    // A short description of the content
    private String description; 
    
    // The ID of the creator of the content
    private String creatorId; 
    
    // The name of the creator of the content
    private String creatorName; 
    
    // The timestamp when the content was created
    private LocalDateTime createdAt; 
    
    // The timestamp when the content was last updated
    private LocalDateTime updatedAt; 
    
    // A map containing highlighted snippets for specific fields (e.g., search terms)
    private Map<String, String> highlights; 
    
    // A relevance score indicating how relevant the search result is to the search query
    private double relevanceScore; 
    
    // Additional metadata specific to the type of content, stored as key-value pairs
    private Map<String, Object> metadata; 
    
    // Custom getter to retrieve type-specific metadata from the metadata map
    @SuppressWarnings("unchecked")
    public <T> T getMetadata(String key, Class<T> type) {
        return metadata != null ? type.cast(metadata.get(key)) : null;
    }
    
    // Custom getter to retrieve a highlighted snippet for a specific field
    public String getHighlight(String field) {
        return highlights != null ? highlights.get(field) : null;
    }
}
