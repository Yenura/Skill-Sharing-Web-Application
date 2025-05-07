package com.skillsharing.dto;

import com.skillsharing.model.CommunityChallenge;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

public class CommunityChallengeDTO {
    private String id;
    private String communityId;
    private String communityName;
    private String title;
    private String description;
    private String creatorId;
    private String creatorName;
    private LocalDateTime createdAt;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Set<String> participants = new HashSet<>();
    private Set<String> submissions = new HashSet<>();
    private int participantCount;
    private int submissionCount;
    private boolean isParticipant;
    private String status; // "active", "upcoming", or "completed"
    
    // Default constructor
    public CommunityChallengeDTO() {
    }
    
    // Constructor from CommunityChallenge entity
    public CommunityChallengeDTO(CommunityChallenge challenge) {
        this.id = challenge.getId();
        this.communityId = challenge.getCommunityId();
        this.title = challenge.getTitle();
        this.description = challenge.getDescription();
        this.creatorId = challenge.getCreatorId();
        this.createdAt = challenge.getCreatedAt();
        this.startDate = challenge.getStartDate();
        this.endDate = challenge.getEndDate();
        this.participants = challenge.getParticipants();
        this.submissions = challenge.getSubmissions();
        this.participantCount = challenge.getParticipants().size();
        this.submissionCount = challenge.getSubmissions().size();
        
        // Determine challenge status
        LocalDateTime now = LocalDateTime.now();
        if (now.isBefore(startDate)) {
            this.status = "upcoming";
        } else if (now.isAfter(endDate)) {
            this.status = "completed";
        } else {
            this.status = "active";
        }
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

    public String getCommunityName() {
        return communityName;
    }

    public void setCommunityName(String communityName) {
        this.communityName = communityName;
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

    public String getCreatorName() {
        return creatorName;
    }

    public void setCreatorName(String creatorName) {
        this.creatorName = creatorName;
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

    public int getParticipantCount() {
        return participantCount;
    }

    public void setParticipantCount(int participantCount) {
        this.participantCount = participantCount;
    }

    public int getSubmissionCount() {
        return submissionCount;
    }

    public void setSubmissionCount(int submissionCount) {
        this.submissionCount = submissionCount;
    }

    public boolean isParticipant() {
        return isParticipant;
    }

    public void setParticipant(boolean isParticipant) {
        this.isParticipant = isParticipant;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
