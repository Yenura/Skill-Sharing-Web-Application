package com.example.backend.models;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;

import java.util.List;

@Document(collection = "SkillShares")
@Getter
@Setter
public class SkillShare {
    @Id
    private String id;
    private String userId;
    private String mealDetails;
    private String dietaryPreferences;
    private List<String> mediaUrls;  // Changed from single mediaUrl to list
    private List<String> mediaTypes; // List to store media types (image/video)
    private String ingredients;
    private String title;
    private String description;
    private String skillType;
    private Date createdAt;

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
