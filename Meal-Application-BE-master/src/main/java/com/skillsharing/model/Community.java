package com.skillsharing.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Document(collection = "communities")
public class Community {
    @Id
    private String id;
    
    @Indexed
    private String name;
    
    private String description;
    private String category; // e.g., "baking", "vegan cooking", "international cuisine", "weeknight dinners"
    private String creatorId;
    private LocalDateTime createdAt;
    private String coverImage;
    private Set<String> members = new HashSet<>(); // User IDs of members
    private Set<String> moderators = new HashSet<>(); // User IDs of moderators
    private Set<String> posts = new HashSet<>(); // Post IDs associated with this community
    private boolean isPrivate = false;
    
    public Community() {
        this.createdAt = LocalDateTime.now();
    }
    
    // Constructor with essential fields
    public Community(String name, String description, String category, String creatorId) {
        this.name = name;
        this.description = description;
        this.category = category;
        this.creatorId = creatorId;
        this.createdAt = LocalDateTime.now();
        this.members.add(creatorId); // Creator is automatically a member
        this.moderators.add(creatorId); // Creator is automatically a moderator
    }

    // Getters and Setters
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

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getCreatorId() {
        return creatorId;
    }

    public void setCreatorId(String creatorId) {
        this.creatorId = creatorId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getCoverImage() {
        return coverImage;
    }

    public void setCoverImage(String coverImage) {
        this.coverImage = coverImage;
    }

    public Set<String> getMembers() {
        return members;
    }

    public void setMembers(Set<String> members) {
        this.members = members;
    }

    public Set<String> getModerators() {
        return moderators;
    }

    public void setModerators(Set<String> moderators) {
        this.moderators = moderators;
    }

    public Set<String> getPosts() {
        return posts;
    }

    public void setPosts(Set<String> posts) {
        this.posts = posts;
    }

    public boolean isPrivate() {
        return isPrivate;
    }

    public void setPrivate(boolean isPrivate) {
        this.isPrivate = isPrivate;
    }
    
    // Helper methods
    public void addMember(String userId) {
        this.members.add(userId);
    }
    
    public void removeMember(String userId) {
        this.members.remove(userId);
        // Also remove from moderators if they were one
        this.moderators.remove(userId);
    }
    
    public void addModerator(String userId) {
        // Ensure the user is a member before making them a moderator
        if (this.members.contains(userId)) {
            this.moderators.add(userId);
        }
    }
    
    public void removeModerator(String userId) {
        this.moderators.remove(userId);
    }
    
    public void addPost(String postId) {
        this.posts.add(postId);
    }
    
    public void removePost(String postId) {
        this.posts.remove(postId);
    }
    
    public boolean isMember(String userId) {
        return this.members.contains(userId);
    }
    
    public boolean isModerator(String userId) {
        return this.moderators.contains(userId);
    }
}
