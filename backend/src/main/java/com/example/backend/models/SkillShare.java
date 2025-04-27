package com.example.backend.models;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;
import java.util.List;

// MongoDB collection "SkillShares" for storing skill share information
@Document(collection = "SkillShares")
// Lombok annotations to automatically generate getters and setters for all fields
@Getter
@Setter
public class SkillShare {
    // Unique identifier for the skill share
    @Id
    private String id;

    // ID of the user sharing the skill
    private String userId;

    // Details about the meal being shared
    private String mealDetails;

    // Dietary preferences associated with the skill share
    private String dietaryPreferences;

    // List of media URLs (images/videos) related to the skill share
    private List<String> mediaUrls;  // Changed from single mediaUrl to list

    // List to store media types (e.g., "image", "video")
    private List<String> mediaTypes; 

    // Ingredients related to the skill share (e.g., for a recipe)
    private String ingredients;

    // Title of the skill share (e.g., name of the recipe or skill)
    private String title;

    // Description providing more details about the skill share
    private String description;

    // Type of skill being shared (e.g., "Cooking", "Fitness", etc.)
    private String skillType;

    // Date and time when the skill share was created
    private Date createdAt;

    // Getters and Setters (Lombok generates these methods, but they are explicitly defined for clarity)
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

    public String getSkillType() {
        return skillType;
    }

    public void setSkillType(String skillType) {
        this.skillType = skillType;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }
}
