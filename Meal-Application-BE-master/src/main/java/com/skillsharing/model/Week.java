package com.skillsharing.model;

// import lombok.Data;

// import javax.validation.constraints.NotBlank;

// @Data
public class Week {
    // @NotBlank(message = "Week title is required")
    private String title;

    private String description;

    // @NotBlank(message = "Status is required")
    private String status; // e.g., "Not Started", "In Progress", "Completed"

    //constructor
    public Week() {}
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

    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }
}