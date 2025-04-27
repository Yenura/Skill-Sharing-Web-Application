package com.example.backend.models;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;

@Document(collection = "notifications")
@Getter
@Setter
public class Notification {
    @Id
    private String id;
    private String userId;
    private String message;
    private String type; // "like", "comment", "group_invite", etc.
    private String sourceId; // ID of the related post, comment, group, etc.
    private String sourceType; // "post", "comment", "group", etc.
    private String actionUserId; // ID of the user who triggered the notification
    private Date timestamp;
    private boolean read;

    public Notification() {
        this.timestamp = new Date();
        this.read = false;
    }

    // Getters and Setters
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

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Date getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Date timestamp) {
        this.timestamp = timestamp;
    }

    public boolean isRead() {
        return read;
    }

    public void setRead(boolean read) {
        this.read = read;
    }
}
