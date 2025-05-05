package com.example.backend.models;

import java.util.List;
import java.util.Map;

public class SearchCriteria {
    private String query;
    private String type; // recipe, user, community, etc.
    private List<String> filters; // e.g., cuisine types, difficulty levels
    private Map<String, List<String>> facets; // Faceted search criteria
    private int page;
    private int size;
    private String sortBy;
    private String sortDirection;
    private Map<String, Float> fieldWeights; // For weighted searching
    private double minScore; // Minimum relevance score
    private boolean publicOnly = true;

    public SearchCriteria() {
        this.page = 0;
        this.size = 20;
        this.sortDirection = "DESC";
        this.minScore = 0.5;
    }

    // Getters and Setters
    public String getQuery() { return query; }
    public void setQuery(String query) { this.query = query; }
    
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    
    public List<String> getFilters() { return filters; }
    public void setFilters(List<String> filters) { this.filters = filters; }
    
    public Map<String, List<String>> getFacets() { return facets; }
    public void setFacets(Map<String, List<String>> facets) { this.facets = facets; }
    
    public int getPage() { return page; }
    public void setPage(int page) { this.page = page; }
    
    public int getSize() { return size; }
    public void setSize(int size) { this.size = size; }
    
    public String getSortBy() { return sortBy; }
    public void setSortBy(String sortBy) { this.sortBy = sortBy; }
    
    public String getSortDirection() { return sortDirection; }
    public void setSortDirection(String sortDirection) { this.sortDirection = sortDirection; }
    
    public Map<String, Float> getFieldWeights() { return fieldWeights; }
    public void setFieldWeights(Map<String, Float> fieldWeights) { this.fieldWeights = fieldWeights; }
    
    public double getMinScore() { return minScore; }
    public void setMinScore(double minScore) { this.minScore = minScore; }
    
    public boolean isPublicOnly() {
        return publicOnly;
    }
    
    public void setPublicOnly(boolean publicOnly) {
        this.publicOnly = publicOnly;
    }
}