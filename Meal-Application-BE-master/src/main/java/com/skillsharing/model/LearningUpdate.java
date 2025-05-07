package com.skillsharing.model;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "learning_updates")
public class LearningUpdate {
    
    @Id
    private String id;
    private String userId;
    private String title;
    private String description;
    private String category;
    private String difficulty;
    private List<String> skillsLearned;
    private double hoursSpent;
    private LocalDateTime completedAt;
    private LocalDateTime createdAt; // Add missing field
    private String resourceName; // Add missing field
    
    // Constructors
    public LearningUpdate() {}
    
    // Getters and Setters
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    
    public String getUserId() {
        return userId;
    }
    
    public void setUserId(String userId) {
        this.userId = userId;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public String getCategory() {
        return category;
    }
    
    public void setCategory(String category) {
        this.category = category;
    }
    
    public String getDifficulty() {
        return difficulty;
    }
    
    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }
    
    public List<String> getSkillsLearned() {
        return skillsLearned;
    }
    
    public void setSkillsLearned(List<String> skillsLearned) {
        this.skillsLearned = skillsLearned;
    }
    
    public double getHoursSpent() {
        return hoursSpent;
    }
    
    public void setHoursSpent(double hoursSpent) {
        this.hoursSpent = hoursSpent;
    }
    
    public LocalDateTime getCompletedAt() {
        return completedAt;
    }
    
    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public String getResourceName() {
        return resourceName;
    }
    
    public void setResourceName(String resourceName) {
        this.resourceName = resourceName;
    }
}
