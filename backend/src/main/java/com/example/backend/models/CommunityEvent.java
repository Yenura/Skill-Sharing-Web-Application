package com.example.backend.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "communityEvents")
public class CommunityEvent {
    @Id
    private String id;
    private String title;
    private String description;
    private String location;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String coverImage;
    
    @DBRef
    private Community community;
    
    @DBRef
    private User organizer;
    
    @DBRef
    private List<User> attendees;
    
    private LocalDateTime createdAt;

    public CommunityEvent() {
        this.attendees = new ArrayList<>();
        this.createdAt = LocalDateTime.now();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
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

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }

    public String getCoverImage() {
        return coverImage;
    }

    public void setCoverImage(String coverImage) {
        this.coverImage = coverImage;
    }

    public Community getCommunity() {
        return community;
    }

    public void setCommunity(Community community) {
        this.community = community;
    }

    public User getOrganizer() {
        return organizer;
    }

    public void setOrganizer(User organizer) {
        this.organizer = organizer;
    }

    public List<User> getAttendees() {
        return attendees;
    }

    public void setAttendees(List<User> attendees) {
        this.attendees = attendees;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public void addAttendee(User user) {
        if (!this.attendees.contains(user)) {
            this.attendees.add(user);
        }
    }
    
    public void removeAttendee(User user) {
        this.attendees.remove(user);
    }
    
    public int getAttendeeCount() {
        return this.attendees.size();
    }
}
