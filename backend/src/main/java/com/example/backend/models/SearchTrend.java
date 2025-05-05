package com.example.backend.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "search_trends")
public class SearchTrend {
    @Id
    private String id;
    private String searchTerm;
    private String searchType;
    private int searchCount;
    private int resultCount;
    private int clickThroughCount;
    private double averageRelevanceScore;
    private double popularityScore;
    private LocalDateTime firstSearched;
    private LocalDateTime lastSearched;
    private boolean isPopular;

    public SearchTrend() {
        this.searchCount = 1;
        this.clickThroughCount = 0;
        this.firstSearched = LocalDateTime.now();
        this.lastSearched = LocalDateTime.now();
        this.isPopular = false;
    }

    public void incrementSearchCount() {
        this.searchCount++;
        this.lastSearched = LocalDateTime.now();
    }

    public void incrementClickThrough() {
        this.clickThroughCount++;
    }

    public void updateRelevanceScore(double newScore) {
        this.averageRelevanceScore = (this.averageRelevanceScore * this.searchCount + newScore) / (this.searchCount + 1);
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getSearchTerm() { return searchTerm; }
    public void setSearchTerm(String searchTerm) { this.searchTerm = searchTerm; }

    public String getSearchType() { return searchType; }
    public void setSearchType(String searchType) { this.searchType = searchType; }

    public int getSearchCount() { return searchCount; }
    public void setSearchCount(int searchCount) { this.searchCount = searchCount; }

    public int getResultCount() { return resultCount; }
    public void setResultCount(int resultCount) { this.resultCount = resultCount; }

    public int getClickThroughCount() { return clickThroughCount; }
    public void setClickThroughCount(int clickThroughCount) { this.clickThroughCount = clickThroughCount; }

    public double getAverageRelevanceScore() { return averageRelevanceScore; }
    public void setAverageRelevanceScore(double averageRelevanceScore) { this.averageRelevanceScore = averageRelevanceScore; }

    public double getPopularityScore() { return popularityScore; }
    public void setPopularityScore(double popularityScore) { this.popularityScore = popularityScore; }

    public LocalDateTime getFirstSearched() { return firstSearched; }
    public void setFirstSearched(LocalDateTime firstSearched) { this.firstSearched = firstSearched; }

    public LocalDateTime getLastSearched() { return lastSearched; }
    public void setLastSearched(LocalDateTime lastSearched) { this.lastSearched = lastSearched; }

    public boolean isPopular() { return isPopular; }
    public void setPopular(boolean popular) { isPopular = popular; }
}