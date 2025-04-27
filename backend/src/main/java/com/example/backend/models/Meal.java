package com.example.backend.models;

import lombok.Getter;
import lombok.Setter;
import java.util.List;

// Lombok annotations for automatic generation of getters and setters
@Getter
@Setter
public class Meal {
    
    // The name of the meal (e.g., "Vegetable Stir Fry")
    private String name;
    
    // A brief description of the meal (e.g., "A healthy stir-fry with assorted vegetables")
    private String description;
    
    // The time required to prepare the meal (e.g., "20 minutes")
    private String time;
    
    // A list of ingredients required for the meal (e.g., ["carrot", "broccoli", "soy sauce"])
    private List<String> ingredients;
    
    // The instructions on how to prepare the meal (e.g., "1. Stir-fry vegetables. 2. Add soy sauce and cook for 5 minutes.")
    private String instructions;

    // Getters and Setters

    // Gets the name of the meal
    public String getName() {
        return name;
    }

    // Sets the name of the meal
    public void setName(String name) {
        this.name = name;
    }

    // Gets the description of the meal
    public String getDescription() {
        return description;
    }

    // Sets the description of the meal
    public void setDescription(String description) {
        this.description = description;
    }

    // Gets the time required to prepare the meal
    public String getTime() {
        return time;
    }

    // Sets the time required to prepare the meal
    public void setTime(String time) {
        this.time = time;
    }

    // Gets the list of ingredients for the meal
    public List<String> getIngredients() {
        return ingredients;
    }

    // Sets the list of ingredients for the meal
    public void setIngredients(List<String> ingredients) {
        this.ingredients = ingredients;
    }

    // Gets the instructions for the meal.
    public String getInstructions() {
        return instructions;
    }

    // Sets the instructions for the meal
    public void setInstructions(String instructions) {
        this.instructions = instructions;
    }
}
