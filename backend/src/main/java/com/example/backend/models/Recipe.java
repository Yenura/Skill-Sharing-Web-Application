package com.example.backend.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;

// MongoDB document annotation for the "recipes" collection
@Document(collection = "recipes")
public class Recipe {
    
    // The unique identifier for the recipe
    @Id
    private String id;
    
    // The title of the recipe
    private String title;
    
    // A brief description of the recipe
    private String description;
    
    // The list of ingredients required for the recipe
    private String ingredients;
    
    // The instructions to prepare the recipe
    private String instructions;
    
    // The time required to cook the recipe
    private String cookingTime;
    
    // The difficulty level of the recipe (e.g., "easy", "medium", "hard")
    private String difficultyLevel;
    
    // The type of cuisine for the recipe (e.g., "Italian", "Chinese")
    private String cuisineType;
    
    // A list of tags associated with the recipe (e.g., "vegetarian", "gluten-free")
    private List<String> tags;
    
    // The media URL (photo or video) related to the recipe
    private String mediaUrl;
    
    // The date and time when the recipe was created
    private LocalDateTime createdAt;
    
    // The date and time when the recipe was last updated
    private LocalDateTime updatedAt;
    
    // The author of the recipe (User reference)
    @DBRef
    private User author;
    
    // The count of likes the recipe has received
    private int likesCount;
    
    // The count of comments the recipe has received
    private int commentsCount;
    
    // Whether the recipe is public or not
    private boolean isPublic;

    // Getters and Setters

    // Gets the unique ID of the recipe
    public String getId() {
        return id;
    }

    // Sets the unique ID of the recipe
    public void setId(String id) {
        this.id = id;
    }

    // Gets the title of the recipe
    public String getTitle() {
        return title;
    }

    // Sets the title of the recipe
    public void setTitle(String title) {
        this.title = title;
    }

    // Gets the description of the recipe
    public String getDescription() {
        return description;
    }

    // Sets the description of the recipe
    public void setDescription(String description) {
        this.description = description;
    }

    // Gets the ingredients of the recipe
    public String getIngredients() {
        return ingredients;
    }

    // Sets the ingredients of the recipe
    public void setIngredients(String ingredients) {
        this.ingredients = ingredients;
    }

    // Gets the instructions for the recipe
    public String getInstructions() {
        return instructions;
    }

    // Sets the instructions for the recipe
    public void setInstructions(String instructions) {
        this.instructions = instructions;
    }

    // Gets the cooking time for the recipe
    public String getCookingTime() {
        return cookingTime;
    }

    // Sets the cooking time for the recipe
    public void setCookingTime(String cookingTime) {
        this.cookingTime = cookingTime;
    }

    // Gets the difficulty level of the recipe
    public String getDifficultyLevel() {
        return difficultyLevel;
    }

    // Sets the difficulty level of the recipe
    public void setDifficultyLevel(String difficultyLevel) {
        this.difficultyLevel = difficultyLevel;
    }

    // Gets the cuisine type of the recipe
    public String getCuisineType() {
        return cuisineType;
    }

    // Sets the cuisine type of the recipe
    public void setCuisineType(String cuisineType) {
        this.cuisineType = cuisineType;
    }

    // Gets the tags associated with the recipe
    public List<String> getTags() {
        return tags;
    }

    // Sets the tags associated with the recipe
    public void setTags(List<String> tags) {
        this.tags = tags;
    }

    // Gets the media URL (photo or video) for the recipe
    public String getMediaUrl() {
        return mediaUrl;
    }

    // Sets the media URL (photo or video) for the recipe
    public void setMediaUrl(String mediaUrl) {
        this.mediaUrl = mediaUrl;
    }

    // Gets the date and time when the recipe was created
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    // Sets the date and time when the recipe was created
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    // Gets the date and time when the recipe was last updated
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    // Sets the date and time when the recipe was last updated
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    // Gets the author (User) of the recipe
    public User getAuthor() {
        return author;
    }

    // Sets the author (User) of the recipe
    public void setAuthor(User author) {
        this.author = author;
    }

    // Gets the count of likes the recipe has received
    public int getLikesCount() {
        return likesCount;
    }

    // Sets the count of likes the recipe has received
    public void setLikesCount(int likesCount) {
        this.likesCount = likesCount;
    }

    // Gets the count of comments the recipe has received
    public int getCommentsCount() {
        return commentsCount;
    }

    // Sets the count of comments the recipe has received
    public void setCommentsCount(int commentsCount) {
        this.commentsCount = commentsCount;
    }

    // Gets whether the recipe is public or not.
    public boolean isPublic() {
        return isPublic;
    }

    // Sets whether the recipe is public or not
    public void setPublic(boolean isPublic) {
        this.isPublic = isPublic;
    }
}
