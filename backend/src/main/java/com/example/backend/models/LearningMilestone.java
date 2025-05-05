package com.example.backend.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "learning_milestones")
public class LearningMilestone {
    @Id
    private String id;
    private String userId;
    private String title;
    private String description;
    private LocalDateTime achievedAt;
    private List<String> mediaUrls;
    private String skillType;
    private int skillLevel;
    private boolean isPublic;
    private String category; // e.g., "Technique", "Recipe", "Equipment"
    private LocalDateTime targetDate; // For future goals
    private boolean isCompleted;
    private List<String> relatedRecipes;
    private int experiencePoints;
    private String badge; // Badge earned for this milestone
    
    public LearningMilestone() {
        this.achievedAt = LocalDateTime.now();
        this.isCompleted = false;
        this.isPublic = true;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public LocalDateTime getAchievedAt() { return achievedAt; }
    public void setAchievedAt(LocalDateTime achievedAt) { this.achievedAt = achievedAt; }
    
    public List<String> getMediaUrls() { return mediaUrls; }
    public void setMediaUrls(List<String> mediaUrls) { this.mediaUrls = mediaUrls; }
    
    public String getSkillType() { return skillType; }
    public void setSkillType(String skillType) { this.skillType = skillType; }
    
    public int getSkillLevel() { return skillLevel; }
    public void setSkillLevel(int skillLevel) { this.skillLevel = skillLevel; }
    
    public boolean isPublic() { return isPublic; }
    public void setPublic(boolean isPublic) { this.isPublic = isPublic; }
    
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    
    public LocalDateTime getTargetDate() { return targetDate; }
    public void setTargetDate(LocalDateTime targetDate) { this.targetDate = targetDate; }
    
    public boolean isCompleted() { return isCompleted; }
    public void setCompleted(boolean completed) { isCompleted = completed; }
    
    public List<String> getRelatedRecipes() { return relatedRecipes; }
    public void setRelatedRecipes(List<String> relatedRecipes) { this.relatedRecipes = relatedRecipes; }
    
    public int getExperiencePoints() { return experiencePoints; }
    public void setExperiencePoints(int experiencePoints) { this.experiencePoints = experiencePoints; }
    
    public String getBadge() { return badge; }
    public void setBadge(String badge) { this.badge = badge; }
}