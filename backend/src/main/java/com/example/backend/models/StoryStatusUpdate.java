package com.example.backend.models;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;

// MongoDB collection "workoutStatusUpdates" for storing status updates related to workouts
@Document(collection = "workoutStatusUpdates")
// Lombok annotations to automatically generate getters and setters for all fields
@Getter
@Setter
public class StoryStatusUpdate {
    // Unique identifier for the story status update
    @Id
    private String id;

    // ID of the user who posted the workout status update
    private String userId;

    // Timestamp when the status update was posted
    private Date timestamp;

    // Title or short description for the status update (e.g., "Morning workout completed")
    private String title;

    // URL or path to an image related to the status update (e.g., workout image)
    private String image;

    // Detailed description of the workout status update
    private String description;

    // Type of exercise (e.g., "Cardio", "Strength", "Yoga")
    private String exerciseType;

    // Duration of the workout in minutes
    private int timeDuration;

    // Intensity level of the workout (e.g., "Low", "Medium", "High")
    private String intensity;

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

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Date getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Date timestamp) {
        this.timestamp = timestamp;
    }
}
