package com.example.backend.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;

// This class represents a Comment entity that is stored in the MongoDB "comments" collection.
@Document(collection = "comments")
public class Comment {

    // The unique identifier for each Comment object in the collection.
    @Id
    private String id;
    
    // The ID of the post that the comment is associated with.
    private String postId;
    
    // The ID of the user who made the comment.
    private String userId;
    
    // The text content of the comment.
    private String commentText;
    
    // The timestamp of when the comment was made.
    private Date timestamp;

    // Default constructor for Comment class.
    public Comment() {}

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

    // Getter method for the 'commentText' field.
    public String getCommentText() {
        return commentText;
    }

    // Setter method for the 'commentText' field.
    public void setCommentText(String commentText) {
        this.commentText = commentText;
    }

    // Getter method for the 'timestamp' field.
    public Date getTimestamp() {
        return timestamp;
    }

    // Setter method for the 'timestamp' field.
    public void setTimestamp(Date timestamp) {
        this.timestamp = timestamp;
    }

    // Parameterized constructor to initialize the Comment object with given values.
    public Comment(String id, String postId, String userId, String commentText, Date timestamp) {
        this.id = id;
        this.postId = postId;
        this.userId = userId;
        this.commentText = commentText;
        this.timestamp = timestamp;
    }
}
