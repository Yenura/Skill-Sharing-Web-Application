package com.example.backend.models;

import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
public class MealRoutine {
    private String day;
    private List<Meal> meals;

    // Getters and Setters
    public String getDay() {
        return day;
    }

    public void setDay(String day) {
        this.day = day;
    }

    public List<Meal> getMeals() {
        return meals;
    }

    public void setMeals(List<Meal> meals) {
        this.meals = meals;
    }
} 
