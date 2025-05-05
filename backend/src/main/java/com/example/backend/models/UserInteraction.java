package com.example.backend.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "user_interactions")
public class UserInteraction {
    @Id
    private String id;
    private String userId;
    private String recipeId;
    private String recipeTitle;
    private String interactionType; // view, like, comment, share
    private LocalDateTime timestamp;
    private double interactionWeight; // For recommendation scoring

    public UserInteraction() {
        this.timestamp = LocalDateTime.now();
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getRecipeId() { return recipeId; }
    public void setRecipeId(String recipeId) { this.recipeId = recipeId; }

    public String getRecipeTitle() { return recipeTitle; }
    public void setRecipeTitle(String recipeTitle) { this.recipeTitle = recipeTitle; }

    public String getInteractionType() { return interactionType; }
    public void setInteractionType(String interactionType) { this.interactionType = interactionType; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    public double getInteractionWeight() { return interactionWeight; }
    public void setInteractionWeight(double interactionWeight) { this.interactionWeight = interactionWeight; }
}