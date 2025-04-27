package com.example.backend.repositories;

import com.example.backend.models.Recipe;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RecipeRepository extends MongoRepository<Recipe, String> {
    List<Recipe> findByCuisineTypeAndDifficultyLevelAndCookingTimeAndTagsIn(
        String cuisineType, String difficultyLevel, String cookingTime, List<String> tags);
    List<Recipe> findByCuisineTypeAndDifficultyLevelAndCookingTime(
        String cuisineType, String difficultyLevel, String cookingTime);
    List<Recipe> findByCuisineTypeAndDifficultyLevel(String cuisineType, String difficultyLevel);
    List<Recipe> findByCuisineTypeAndCookingTime(String cuisineType, String cookingTime);
    List<Recipe> findByDifficultyLevelAndCookingTime(String difficultyLevel, String cookingTime);
    List<Recipe> findByCuisineType(String cuisineType);
    List<Recipe> findByDifficultyLevel(String difficultyLevel);
    List<Recipe> findByCookingTime(String cookingTime);
    List<Recipe> findByTagsIn(List<String> tags);
    List<Recipe> findByAuthorId(String authorId);
    List<Recipe> findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String title, String description);
    List<Recipe> findByOrderByCreatedAtDesc();
    List<Recipe> findByTitleContainingIgnoreCase(String title);
    List<Recipe> findTop10ByTitleContainingIgnoreCase(String title);
} 
