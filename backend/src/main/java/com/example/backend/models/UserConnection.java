package com.example.backend.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

// MongoDB document representing user connections (friends)
@Document(collection = "userConnections")
public class UserConnection {

    // Unique identifier for the user connection (MongoDB ID)
    @Id
    private String id;

    // ID of the user to whom this connection belongs
    private String userId;

    // List of IDs representing the user's friends (connections)
    private List<String> friendIds = new ArrayList<>();

    // Default constructor for creating empty UserConnection objects
    public UserConnection() {}

    // Getter for the unique identifier
    public String getId() {
        return id;
    }

    // Setter for the unique identifier
    public void setId(String id) {
        this.id = id;
    }

    // Getter for the user ID (the user who owns the connection)
    public String getUserId() {
        return userId;
    }

    // Setter for the user ID.
    public void setUserId(String userId) {
        this.userId = userId;
    }

    // Getter for the list of friend IDs
    public List<String> getFriendIds() {
        return friendIds;
    }

    // Setter for the list of friend IDs
    public void setFriendIds(List<String> friendIds) {
        this.friendIds = friendIds;
    }
}
