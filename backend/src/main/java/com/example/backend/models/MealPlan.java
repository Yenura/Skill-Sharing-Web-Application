package com.example.backend.models;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;
import java.util.List;

@Document(collection = "MealPlans")
@Getter
@Setter
public class MealPlan {
    @Id
    private String id;
    private String userId;
    private String planName;
    private String description;
    private String goal;
    private List<MealRoutine> routines;

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

    public String getPlanName() {
        return planName;
    }

    public void setPlanName(String planName) {
        this.planName = planName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getGoal() {
        return goal;
    }

    public void setGoal(String goal) {
        this.goal = goal;
    }

    public List<MealRoutine> getRoutines() {
        return routines;
    }

    public void setRoutines(List<MealRoutine> routines) {
        this.routines = routines;
    }
}
