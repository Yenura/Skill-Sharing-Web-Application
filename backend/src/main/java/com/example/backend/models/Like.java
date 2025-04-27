package com.example.backend.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

// This class represents a Like entity that is stored in the MongoDB "likes" collection.
@Document(collection = "likes")
public class Like {
    
    // The unique identifier for each Like object in the collection.
    @Id
    private String id;
    
    // The ID of the post that is being liked.
    private String postId;
    
    // The ID of the user who liked the post.
    private String userId;

    // Default constructor for Like class.
    public Like() {}

    // Parameterized constructor to initialize the Like object with given values.
    public Like(String id, String postId, String userId) {
        this.id = id;
        this.postId = postId;
        this.userId = userId;
    }

    // Getter method for the 'id' field.
    public String getId() {
        return id;
    }

    // Setter method for the 'id' field.
    public void setId(String id) {
        this.id = id;
    }

    // Getter method for the 'postId' field.
    public String getPostId() {
        return postId;
    }

    // Setter method for the 'postId' field.
    public void setPostId(String postId) {
        this.postId = postId;
    }

    // Getter method for the 'userId' field.
    public String getUserId() {
        return userId;
    }

    // Setter method for the 'userId' field.
    public void setUserId(String userId) {
        this.userId = userId;
    }
}
