package com.example.backend.services.impl;

import com.example.backend.models.Recipe;
import com.example.backend.repositories.RecipeRepository;
import com.example.backend.services.RecipeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class RecipeServiceImpl implements RecipeService {

    @Autowired
    private RecipeRepository recipeRepository;

    @Override
    public Recipe createRecipe(Recipe recipe) {
        recipe.setCreatedAt(LocalDateTime.now());
        recipe.setUpdatedAt(LocalDateTime.now());
        return recipeRepository.save(recipe);
    }

    @Override
    public Recipe getRecipe(String id) {
        return recipeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Recipe not found"));
    }

    @Override
    public List<Recipe> getRecipes(String cuisineType, String difficultyLevel, String cookingTime, List<String> tags) {
        if (cuisineType != null && difficultyLevel != null && cookingTime != null && tags != null) {
            return recipeRepository.findByCuisineTypeAndDifficultyLevelAndCookingTimeAndTagsIn(
                    cuisineType, difficultyLevel, cookingTime, tags);
        } else if (cuisineType != null && difficultyLevel != null && cookingTime != null) {
            return recipeRepository.findByCuisineTypeAndDifficultyLevelAndCookingTime(
                    cuisineType, difficultyLevel, cookingTime);
        } else if (cuisineType != null && difficultyLevel != null) {
            return recipeRepository.findByCuisineTypeAndDifficultyLevel(cuisineType, difficultyLevel);
        } else if (cuisineType != null && cookingTime != null) {
            return recipeRepository.findByCuisineTypeAndCookingTime(cuisineType, cookingTime);
        } else if (difficultyLevel != null && cookingTime != null) {
            return recipeRepository.findByDifficultyLevelAndCookingTime(difficultyLevel, cookingTime);
        } else if (cuisineType != null) {
            return recipeRepository.findByCuisineType(cuisineType);
        } else if (difficultyLevel != null) {
            return recipeRepository.findByDifficultyLevel(difficultyLevel);
        } else if (cookingTime != null) {
            return recipeRepository.findByCookingTime(cookingTime);
        } else if (tags != null) {
            return recipeRepository.findByTagsIn(tags);
        } else {
            return recipeRepository.findAll();
        }
    }

    @Override
    public Recipe updateRecipe(String id, Recipe recipe) {
        Recipe existingRecipe = getRecipe(id);
        recipe.setId(id);
        recipe.setCreatedAt(existingRecipe.getCreatedAt());
        recipe.setUpdatedAt(LocalDateTime.now());
        return recipeRepository.save(recipe);
    }

    @Override
    public void deleteRecipe(String id) {
        recipeRepository.deleteById(id);
    }

    @Override
    public List<Recipe> getUserRecipes(String userId) {
        return recipeRepository.findByAuthorId(userId);
    }

    @Override
    public List<Recipe> searchRecipes(String query) {
        // This is a simple implementation. For better search, consider using MongoDB text search
        return recipeRepository.findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(query, query);
    }

    @Override
    public List<Recipe> getTrendingRecipes() {
        // Get recipes sorted by likes count in descending order
        return recipeRepository.findAll(Sort.by(Sort.Direction.DESC, "likesCount"));
    }

    @Override
    public List<Recipe> getLatestRecipes() {
        return recipeRepository.findByOrderByCreatedAtDesc();
    }
} 
