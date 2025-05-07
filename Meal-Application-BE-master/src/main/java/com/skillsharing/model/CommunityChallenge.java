package com.skillsharing.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Document(collection = "community_challenges")
public class CommunityChallenge {
    @Id
    private String id;
    
    private String communityId;
    private String title;
    private String description;
    private String creatorId;
    private LocalDateTime createdAt;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Set<String> participants = new HashSet<>(); // User IDs of participants
    private Set<String> submissions = new HashSet<>(); // Post IDs of challenge submissions
    
    public CommunityChallenge() {
        this.createdAt = LocalDateTime.now();
    }
    
    // Constructor with essential fields
    public CommunityChallenge(String communityId, String title, String description, 
                             String creatorId, LocalDateTime startDate, LocalDateTime endDate) {
        this.communityId = communityId;
        this.title = title;
        this.description = description;
        this.creatorId = creatorId;
        this.createdAt = LocalDateTime.now();
        this.startDate = startDate;
        this.endDate = endDate;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCommunityId() {
        return communityId;
    }

    public void setCommunityId(String communityId) {
        this.communityId = communityId;
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

    public LocalDateTime getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDateTime startDate) {
        this.startDate = startDate;
    }

    public LocalDateTime getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDateTime endDate) {
        this.endDate = endDate;
    }

    public Set<String> getParticipants() {
        return participants;
    }

    public void setParticipants(Set<String> participants) {
        this.participants = participants;
    }

    public Set<String> getSubmissions() {
        return submissions;
    }

    public void setSubmissions(Set<String> submissions) {
        this.submissions = submissions;
    }
    
    // Helper methods
    public void addParticipant(String userId) {
        this.participants.add(userId);
    }
    
    public void removeParticipant(String userId) {
        this.participants.remove(userId);
    }
    
    public void addSubmission(String postId) {
        this.submissions.add(postId);
    }
    
    public boolean isActive() {
        LocalDateTime now = LocalDateTime.now();
        return now.isAfter(startDate) && now.isBefore(endDate);
    }
    
    public boolean isUpcoming() {
        return LocalDateTime.now().isBefore(startDate);
    }
    
    public boolean isCompleted() {
        return LocalDateTime.now().isAfter(endDate);
    }
}
