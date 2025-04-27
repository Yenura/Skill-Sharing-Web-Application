package com.example.backend.models;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;

// MongoDB document annotation for the "notifications" collection
@Document(collection = "notifications")
@Getter
@Setter
public class Notification {
    
    // The unique identifier for the notification document
    @Id
    private String id;
    
    // The ID of the user who will receive the notification
    private String userId;
    
    // The content or message of the notification
    private String message;
    
    // The type of notification (e.g., "like", "comment", "group_invite", etc.)
    private String type; 
    
    // The ID of the related post, comment, group, etc., that triggered the notification
    private String sourceId; 
    
    // The type of the source (e.g., "post", "comment", "group", etc.)
    private String sourceType; 
    
    // The ID of the user who triggered the notification
    private String actionUserId; 
    
    // The timestamp when the notification was created
    private Date timestamp;
    
    // Whether the notification has been read by the user
    private boolean read;

    // Default constructor that initializes the timestamp to the current date and read to false
    public Notification() {
        this.timestamp = new Date();
        this.read = false;
    }

    // Getters and Setters

    // Gets the unique ID of the notification
    public String getId() {
        return id;
    }

    // Sets the unique ID of the notification
    public void setId(String id) {
        this.id = id;
    }

    // Gets the ID of the user who will receive the notification
    public String getUserId() {
        return userId;
    }

    // Sets the ID of the user who will receive the notification
    public void setUserId(String userId) {
        this.userId = userId;
    }

    // Gets the content or message of the notification
    public String getMessage() {
        return message;
    }

    // Sets the content or message of the notification
    public void setMessage(String message) {
        this.message = message;
    }

    // Gets the timestamp when the notification was created
    public Date getTimestamp() {
        return timestamp;
    }

    // Sets the timestamp when the notification was created
    public void setTimestamp(Date timestamp) {
        this.timestamp = timestamp;
    }

    // Gets whether the notification has been read.
    public boolean isRead() {
        return read;
    }

    // Sets whether the notification has been read
    public void setRead(boolean read) {
        this.read = read;
    }
}
