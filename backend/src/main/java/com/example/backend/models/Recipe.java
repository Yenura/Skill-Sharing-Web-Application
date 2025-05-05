package com.example.backend.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;

@Document(collection = "recipes")
public class Recipe {
    @Id
    private String id;
    private String title;
    private String description;
    private List<String> ingredients;
    private List<String> instructions;
    private String imageUrl; // Keeping for backward compatibility
    private List<MediaAsset> mediaAssets = new ArrayList<>(); // New field for multiple media files
    private String cuisineType;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    @DBRef
    private User author;
    private String authorId;  // Denormalized for quick access
    
    private int likesCount;
    private int commentsCount;
    private int viewsCount;
    private boolean isPublic;
    private List<String> tags = new ArrayList<>();
    private int cookingTime;
    private int servings;
    private String difficulty;

    public Recipe() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.isPublic = true;
        this.likesCount = 0;
        this.commentsCount = 0;
        this.viewsCount = 0;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public List<String> getIngredients() { return ingredients; }
    public void setIngredients(List<String> ingredients) { this.ingredients = ingredients; }
    
    public List<String> getInstructions() { return instructions; }
    public void setInstructions(List<String> instructions) { this.instructions = instructions; }
    
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    
    public List<MediaAsset> getMediaAssets() { return mediaAssets; }
    public void setMediaAssets(List<MediaAsset> mediaAssets) { this.mediaAssets = mediaAssets; }
    
    public String getCuisineType() { return cuisineType; }
    public void setCuisineType(String cuisineType) { this.cuisineType = cuisineType; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    public User getAuthor() { return author; }
    public void setAuthor(User author) { this.author = author; }
    
    public String getAuthorId() { return authorId; }
    public void setAuthorId(String authorId) { this.authorId = authorId; }
    
    public int getLikesCount() { return likesCount; }
    public void setLikesCount(int likesCount) { this.likesCount = likesCount; }
    
    public int getCommentsCount() { return commentsCount; }
    public void setCommentsCount(int commentsCount) { this.commentsCount = commentsCount; }
    
    public int getViewsCount() { return viewsCount; }
    public void setViewsCount(int viewsCount) { this.viewsCount = viewsCount; }
    
    public boolean isPublic() { return isPublic; }
    public void setPublic(boolean isPublic) { this.isPublic = isPublic; }
    
    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }
    
    public int getCookingTime() { return cookingTime; }
    public void setCookingTime(int cookingTime) { this.cookingTime = cookingTime; }
    public int getServings() { return servings; }
    public void setServings(int servings) { this.servings = servings; }
    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }
    
    // Admin features
    private boolean featured;
    private String featuredReason;
    private LocalDateTime featuredAt;

    public boolean isFeatured() { return featured; }
    public void setFeatured(boolean featured) { this.featured = featured; }

    public String getFeaturedReason() { return featuredReason; }
    public void setFeaturedReason(String featuredReason) { this.featuredReason = featuredReason; }

    public LocalDateTime getFeaturedAt() { return featuredAt; }
    public void setFeaturedAt(LocalDateTime featuredAt) { this.featuredAt = featuredAt; }
    
    // Helper method to add a media asset
    public void addMediaAsset(MediaAsset mediaAsset) {
        if (this.mediaAssets == null) {
            this.mediaAssets = new ArrayList<>();
        }
        this.mediaAssets.add(mediaAsset);
    }
}
