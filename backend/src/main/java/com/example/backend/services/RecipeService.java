package com.example.backend.services;

import com.example.backend.models.Recipe;
import java.util.List;

public interface RecipeService {
    Recipe createRecipe(Recipe recipe);
    Recipe getRecipe(String id);
    List<Recipe> getRecipes(String cuisineType, String difficultyLevel, String cookingTime, List<String> tags);
    Recipe updateRecipe(String id, Recipe recipe);
    void deleteRecipe(String id);
    List<Recipe> getUserRecipes(String userId);
    List<Recipe> searchRecipes(String query);
    List<Recipe> getTrendingRecipes();
    List<Recipe> getLatestRecipes();
} 
