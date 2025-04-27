package com.example.backend.models;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;
import java.util.List;

// MongoDB Document annotation to specify that this class is mapped to the "MealPlans" collection
@Document(collection = "MealPlans")
// Lombok annotations to automatically generate getters and setters
@Getter
@Setter
public class MealPlan {
    
    // Unique identifier for each meal plan (MongoDB generated)
    @Id
    private String id;
    
    // ID of the user who owns the meal plan
    private String userId;
    
    // Name of the meal plan (e.g., "Weekly Meal Plan")
    private String planName;
    
    // A description of the meal plan (e.g., "A meal plan to help with weight loss")
    private String description;
    
    // The goal of the meal plan (e.g., "Weight Loss", "Muscle Gain")
    private String goal;
    
    // A list of routines that make up the meal plan (e.g., breakfast, lunch, dinner)
    private List<MealRoutine> routines;

    // Getters and Setters

    // Gets the unique identifier of the meal plan
    public String getId() {
        return id;
    }

    // Sets the unique identifier of the meal plan
    public void setId(String id) {
        this.id = id;
    }

    // Gets the user ID associated with the meal plan
    public String getUserId() {
        return userId;
    }

    // Sets the user ID associated with the meal plan
    public void setUserId(String userId) {
        this.userId = userId;
    }

    // Gets the name of the meal plan
    public String getPlanName() {
        return planName;
    }

    // Sets the name of the meal plan
    public void setPlanName(String planName) {
        this.planName = planName;
    }

    // Gets the description of the meal plan
    public String getDescription() {
        return description;
    }

    // Sets the description of the meal plan
    public void setDescription(String description) {
        this.description = description;
    }

    // Gets the goal of the meal plan
    public String getGoal() {
        return goal;
    }

    // Sets the goal of the meal plan
    public void setGoal(String goal) {
        this.goal = goal;
    }

    // Gets the list of meal routines associated with the meal plan
    public List<MealRoutine> getRoutines() {
        return routines;
    }

    // Sets the list of meal routines for the meal plan.
    public void setRoutines(List<MealRoutine> routines) {
        this.routines = routines;
    }
}
