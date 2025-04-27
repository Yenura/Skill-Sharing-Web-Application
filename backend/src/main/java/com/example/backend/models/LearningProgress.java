package com.example.backend.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "learning_progress")
public class LearningProgress {
    @Id
    private String id;
    private String userId;
    private String skillType; // e.g., "cooking", "coding", "photography"
    private String title;
    private String description;
    private List<String> completedMilestones;
    private List<String> currentMilestones;
    private List<String> upcomingMilestones;
    private String status; // "in_progress", "completed", "on_hold"
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<String> resources; // URLs or references to learning materials
    private int progressPercentage;
    private List<String> tags;
    private boolean isPublic;

    public LearningProgress() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.progressPercentage = 0;
        this.isPublic = false;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getSkillType() { return skillType; }
    public void setSkillType(String skillType) { this.skillType = skillType; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public List<String> getCompletedMilestones() { return completedMilestones; }
    public void setCompletedMilestones(List<String> completedMilestones) { this.completedMilestones = completedMilestones; }
    public List<String> getCurrentMilestones() { return currentMilestones; }
    public void setCurrentMilestones(List<String> currentMilestones) { this.currentMilestones = currentMilestones; }
    public List<String> getUpcomingMilestones() { return upcomingMilestones; }
    public void setUpcomingMilestones(List<String> upcomingMilestones) { this.upcomingMilestones = upcomingMilestones; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    public List<String> getResources() { return resources; }
    public void setResources(List<String> resources) { this.resources = resources; }
    public int getProgressPercentage() { return progressPercentage; }
    public void setProgressPercentage(int progressPercentage) { this.progressPercentage = progressPercentage; }
    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }
    public boolean isPublic() { return isPublic; }
    public void setPublic(boolean isPublic) { this.isPublic = isPublic; }
} 
