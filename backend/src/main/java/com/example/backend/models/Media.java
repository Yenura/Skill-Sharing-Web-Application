package com.example.backend.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

// MongoDB document annotation for the "media" collection
@Document(collection = "media")
public class Media {
    
    // The unique identifier for the media document
    @Id
    private String id;
    
    // The ID of the post associated with this media
    private String postId;
    
    // The type of the media (e.g., "image", "video", "audio")
    private String mediaType;
    
    // The URL where the media is stored
    private String mediaUrl;
    
    // A description of the media
    private String description;

    // Getters and Setters

    // Gets the unique ID of the media
    public String getId() {
        return id;
    }

    // Sets the unique ID of the media
    public void setId(String id) {
        this.id = id;
    }

    // Gets the ID of the post associated with this media
    public String getPostId() {
        return postId;
    }

    // Sets the ID of the post associated with this media
    public void setPostId(String postId) {
        this.postId = postId;
    }

    // Gets the type of media (e.g., "image", "video", "audio")
    public String getMediaType() {
        return mediaType;
    }

    // Sets the type of media (e.g., "image", "video", "audio")
    public void setMediaType(String mediaType) {
        this.mediaType = mediaType;
    }

    // Gets the URL of the media
    public String getMediaUrl() {
        return mediaUrl;
    }

    // Sets the URL of the media
    public void setMediaUrl(String mediaUrl) {
        this.mediaUrl = mediaUrl;
    }

    // Gets the description of the media
    public String getDescription() {
        return description;
    }

    // Sets the description of the media
    public void setDescription(String description) {
        this.description = description;
    }

    // Default constructor.
    public Media() {}

    // Constructor to initialize all fields of the Media class
    public Media(String id, String postId, String mediaType, String mediaUrl, String description) {
        this.id = id;
        this.postId = postId;
        this.mediaType = mediaType;
        this.mediaUrl = mediaUrl;
        this.description = description;
    }
}
