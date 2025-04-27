package com.example.backend.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;
import java.util.List;

// This class represents a Bookmark entity that is stored in the MongoDB "bookmarks" collection.
@Document(collection = "bookmarks")
public class Bookmark {

    // The unique identifier for each Bookmark object in the collection.
    @Id
    private String id;
    
    // The ID of the user who created the bookmark.
    private String userId;
    
    // The ID of the resource being bookmarked. It could be a postId or an external URL.
    private String resourceId;
    
    // The type of resource being bookmarked, such as "post", "external", etc.
    private String resourceType;
    
    // The title or name of the bookmarked resource.
    private String title;
    
    // A note that the user may attach to the bookmark for additional context.
    private String note;
    
    // A list of tags associated with the bookmark for better categorization.
    private List<String> tags;
    
    // The timestamp of when the bookmark was created.
    private Date createdAt;

    // Default constructor that sets the 'createdAt' field to the current date and time.
    public Bookmark() {
        this.createdAt = new Date();
    }

    // Getter method for the 'id' field.
    public String getId() {
        return id;
    }

    // Setter method for the 'id' field.
    public void setId(String id) {
        this.id = id;
    }

    // Getter method for the 'userId' field.
    public String getUserId() {
        return userId;
    }

    // Setter method for the 'userId' field.
    public void setUserId(String userId) {
        this.userId = userId;
    }

    // Getter method for the 'resourceId' field.
    public String getResourceId() {
        return resourceId;
    }

    // Setter method for the 'resourceId' field.
    public void setResourceId(String resourceId) {
        this.resourceId = resourceId;
    }

    // Getter method for the 'title' field.
    public String getTitle() {
        return title;
    }

    // Setter method for the 'title' field.
    public void setTitle(String title) {
        this.title = title;
    }

    // Getter method for the 'note' field.
    public String getNote() {
        return note;
    }

    // Setter method for the 'note' field.
    public void setNote(String note) {
        this.note = note;
    }

    // Getter method for the 'tags' field.
    public List<String> getTags() {
        return tags;
    }

    // Setter method for the 'tags' field.
    public void setTags(List<String> tags) {
        this.tags = tags;
    }

    // Getter method for the 'createdAt' field.
    public Date getCreatedAt() {
        return createdAt;
    }

    // Setter method for the 'createdAt' field.
    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }
}
