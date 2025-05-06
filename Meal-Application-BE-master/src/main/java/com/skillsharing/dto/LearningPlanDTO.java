package com.skillsharing.dto;

import java.util.List;

import javax.validation.constraints.NotBlank;

import lombok.Data;

@Data
public class LearningPlanDTO {
    private String id;

    @NotBlank(message = "Title is required")
    private String age;

    private String gender;

    private String height;

    private String weight;
    

    private String title;

    private String description;

    private List<ResourceDTO> resources;

    private List<WeekDTO> weeks;

    // Other fields and methods
    public String getId() {
        return id;
    }

    public void setId(String id) { // Add this setter
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

    // Removed duplicate getResources() method to resolve the error
    public List<ResourceDTO> getResources() {
        return resources;
    }
    public List<WeekDTO> getWeeks() {
        return weeks;
    }
    
    public void setWeeks(List<WeekDTO> weeks) {
        this.weeks = weeks;
    }

    public void setResources(List<ResourceDTO> toList) {
        throw new UnsupportedOperationException("Not supported yet.");
    }
}