package com.example.backend.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;

// Lombok annotations to automatically generate getters, setters, toString, equals, and hashCode methods
@Data
// No-arguments constructor to initialize the object with default values
@NoArgsConstructor
// All-arguments constructor to initialize the object with all values
@AllArgsConstructor
// Indicates that this class will be mapped to a MongoDB collection "sections"
@Document(collection = "sections")
public class Section {

    // Unique identifier for the section
    @Id
    private String id;

    // Title of the section, cannot be blank
    @NotBlank(message = "Title is required")
    private String title;

    // Description of the section (optional)
    private String description;

    // Learning plan ID associated with this section, cannot be blank
    @NotBlank(message = "Learning plan ID is required")
    private String learningPlanId;

    // List of content IDs related to this section (e.g., lessons, articles, etc.)
    private List<String> contentIds;

    // The order of the section in the learning plan, cannot be null
    @NotNull(message = "Order index is required")
    private int orderIndex;

    // Getters, and Setters (Lombok generates these methods, but they are explicitly defined for clarity)
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

    public String getLearningPlanId() {
        return learningPlanId;
    }

    public void setLearningPlanId(String learningPlanId) {
        this.learningPlanId = learningPlanId;
    }

    public int getOrderIndex() {
        return orderIndex;
    }

    public void setOrderIndex(int orderIndex) {
        this.orderIndex = orderIndex;
    }

    public List<String> getContentIds() {
        return contentIds;
    }

    public void setContentIds(List<String> contentIds) {
        this.contentIds = contentIds;
    }
}
