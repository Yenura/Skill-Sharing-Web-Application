package com.example.backend.models;

import lombok.Getter;
import lombok.Setter;
import java.util.List;

// Lombok annotations to automatically generate getters and setters
@Getter
@Setter
public class MealRoutine {

    // The day of the week for this routine (e.g., "Monday", "Tuesday")
    private String day;
    
    // A list of meals associated with this day (e.g., breakfast, lunch, dinner)
    private List<Meal> meals;

    // Getters and Setters

    // Gets the day of the meal routine (e.g., "Monday")
    public String getDay() {
        return day;
    }

    // Sets the day of the meal routine (e.g., "Monday")
    public void setDay(String day) {
        this.day = day;
    }

    // Gets the list of meals for this day.
    public List<Meal> getMeals() {
        return meals;
    }

    // Sets the list of meals for this day
    public void setMeals(List<Meal> meals) {
        this.meals = meals;
    }
}
