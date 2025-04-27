package com.example.backend.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;

// Represents a cooking community or group in the database
@Document(collection = "cooking_communities")
public class Group {

    // Unique identifier for each group
    @Id
    private String id;

    // Name of the cooking group
    private String name;

    // Description of the cooking group
    private String description;

    // URL or path to the group's cover image
    private String coverImage;

    // Category of the group (e.g., baking, vegan, international cuisine)
    private String category;

    // Difficulty level of the group's content (e.g., beginner, intermediate, advanced)
    private String difficultyLevel;

    // List of tags associated with the group (e.g., easy, healthy, dessert)
    private List<String> tags;

    // The time when the group was created
    private LocalDateTime createdAt;

    // The time when the group was last updated
    private LocalDateTime updatedAt;

    // User who created the group (DBRef is used for references to other collections)
    @DBRef
    private User createdBy;

    // Count of members currently in the group
    private int memberCount;

    // Count of recipes available in the group
    private int recipeCount;

    // Whether the group is private or public
    private boolean isPrivate;

    // List of rules for the group
    private List<String> rules;

    // Custom message shown when someone requests to join the group
    private String joinRequestMessage;

    // List of moderators in the group
    private List<String> moderators;

    // List of member IDs in the group
    private List<String> memberIds;

    // Getter and Setter methods for each field

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCoverImage() {
        return coverImage;
    }

    public void setCoverImage(String coverImage) {
        this.coverImage = coverImage;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getDifficultyLevel() {
        return difficultyLevel;
    }

    public void setDifficultyLevel(String difficultyLevel) {
        this.difficultyLevel = difficultyLevel;
    }

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public User getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(User createdBy) {
        this.createdBy = createdBy;
    }

    public int getMemberCount() {
        return memberCount;
    }

    public void setMemberCount(int memberCount) {
        this.memberCount = memberCount;
    }

    public int getRecipeCount() {
        return recipeCount;
    }

    public void setRecipeCount(int recipeCount) {
        this.recipeCount = recipeCount;
    }

    public boolean isPrivate() {
        return isPrivate;
    }

    public void setPrivate(boolean isPrivate) {
        this.isPrivate = isPrivate;
    }

    public List<String> getRules() {
        return rules;
    }

    public void setRules(List<String> rules) {
        this.rules = rules;
    }

    public String getJoinRequestMessage() {
        return joinRequestMessage;
    }

    public void setJoinRequestMessage(String joinRequestMessage) {
        this.joinRequestMessage = joinRequestMessage;
    }

    public List<String> getModerators() {
        return moderators;
    }

    public void setModerators(List<String> moderators) {
        this.moderators = moderators;
    }

    public List<String> getMemberIds() {
        return memberIds;
    }

    public void setMemberIds(List<String> memberIds) {
        this.memberIds = memberIds;
    }
}
