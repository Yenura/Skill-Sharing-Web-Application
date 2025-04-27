package com.example.backend.model;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;
import java.util.Map;

// Data annotation automatically generates getters, setters, toString, equals, and hashCode methods
@Data
// Builder pattern for creating instances with optional parameters
@Builder
// No arguments constructor for initializing the object with default values
@NoArgsConstructor
// All arguments constructor for initializing the object with all values
@AllArgsConstructor
public class SearchQuery {
    
    // The main search text that the user wants to search for
    private String query; 
    
    // List of content types (e.g., "recipe", "post") to search in
    private List<String> types; 
    
    // Tags to filter the search results
    private List<String> tags; 
    
    // The category filter for narrowing down search results
    private String category; 
    
    // The creator ID filter to search for content created by a specific user
    private String creatorId; 
    
    // Additional filters that can be applied to the search query, stored as key-value pairs
    private Map<String, Object> filters; 
    
    // The field by which the search results will be sorted
    private String sortBy; 
    
    // The order of sorting, can be "asc" for ascending or "desc" for descending
    private String sortOrder; 
    
    // The page number for paginated results (0-based index)
    private int page; 
    
    // The number of results to return per page
    private int size; 
    
    // Helper method to retrieve a filter value based on the key and type
    @SuppressWarnings("unchecked")
    public <T> T getFilter(String key, Class<T> type) {
        return filters != null ? type.cast(filters.get(key)) : null;
    }
    
    // Method to add a filter to the filters map.
    public void addFilter(String key, Object value) {
        if (filters != null) {
            filters.put(key, value);
        }
    }
    
    // Method to check if a specific filter exists in the filters map
    public boolean hasFilter(String key) {
        return filters != null && filters.containsKey(key);
    }
}
