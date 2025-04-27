package com.example.backend.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

// This class represents a Content entity stored in the "contents" MongoDB collection.
@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "contents")
public class Content {

    // Unique identifier for each Content document..
    @Id
    private String id;

    // The title of the content, cannot be blank.
    @NotBlank(message = "Title is required")
    private String title;

    // Optional description of the content.
    private String description;

    // The type of content (TEXT, VIDEO, QUIZ, ASSIGNMENT), cannot be null.
    @NotNull(message = "Content type is required")
    private ContentType type;

    // The actual content, cannot be blank.
    @NotBlank(message = "Content is required")
    private String content;

    // URL for media (e.g., video, image) associated with the content.
    private String mediaUrl;

    // Duration of the content in minutes, applicable for videos or assignments.
    private Integer durationMinutes;

    // The section ID to which the content belongs, cannot be blank.
    @NotBlank(message = "Section ID is required")
    private String sectionId;

    // The author ID who created the content, cannot be blank.
    @NotBlank(message = "Author ID is required")
    private String authorId;

    // The order index for sorting the content.
    @NotNull(message = "Order index is required")
    private int orderIndex;

    // The timestamp when the content was created.
    @CreatedDate
    private LocalDateTime createdAt;

    // The timestamp when the content was last modified.
    @LastModifiedDate
    private LocalDateTime updatedAt;

    // Enum to define the possible content types: TEXT, VIDEO, QUIZ, ASSIGNMENT.
    public enum ContentType {
        TEXT,
        VIDEO,
        QUIZ,
        ASSIGNMENT
    }

    // Getter and Setter methods for each field

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

    public ContentType getType() {
        return type;
    }

    public void setType(ContentType type) {
        this.type = type;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getMediaUrl() {
        return mediaUrl;
    }

    public void setMediaUrl(String mediaUrl) {
        this.mediaUrl = mediaUrl;
    }

    public Integer getDurationMinutes() {
        return durationMinutes;
    }

    public void setDurationMinutes(Integer durationMinutes) {
        this.durationMinutes = durationMinutes;
    }

    public String getSectionId() {
        return sectionId;
    }

    public void setSectionId(String sectionId) {
        this.sectionId = sectionId;
    }

    public String getAuthorId() {
        return authorId;
    }

    public void setAuthorId(String authorId) {
        this.authorId = authorId;
    }

    public int getOrderIndex() {
        return orderIndex;
    }

    public void setOrderIndex(int orderIndex) {
        this.orderIndex = orderIndex;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
