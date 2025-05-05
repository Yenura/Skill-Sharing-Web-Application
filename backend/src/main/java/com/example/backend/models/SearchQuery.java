package com.example.backend.models;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SearchQuery {
    private String query;           // Main search text
    private List<String> types;     // Content types to search in
    private List<String> tags;      // Tags to filter by
    private String category;        // Category filter
    private String creatorId;       // Filter by creator
    private Map<String, Object> filters;  // Additional filters
    private String sortBy;          // Field to sort by
    private String sortOrder;       // "asc" or "desc"
    private int page;              // Page number (0-based)
    private int size;              // Page size
    
    // Helper methods for filter manipulation
    @SuppressWarnings("unchecked")
    public <T> T getFilter(String key, Class<T> type) {
        return filters != null ? type.cast(filters.get(key)) : null;
    }
    
    public void addFilter(String key, Object value) {
        if (filters != null) {
            filters.put(key, value);
        }
    }
    
    public boolean hasFilter(String key) {
        return filters != null && filters.containsKey(key);
    }
} 
