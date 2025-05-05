package com.example.backend.repositories;

import com.example.backend.models.Recipe;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface RecipeRepository extends MongoRepository<Recipe, String> {
    List<Recipe> findByCuisineTypeAndDifficultyAndCookingTimeAndTagsIn(
        String cuisineType, String difficulty, String cookingTime, List<String> tags);
    List<Recipe> findByCuisineTypeAndDifficultyAndCookingTime(
        String cuisineType, String difficulty, String cookingTime);
    List<Recipe> findByCuisineTypeAndDifficulty(String cuisineType, String difficulty);
    List<Recipe> findByCuisineTypeAndCookingTime(String cuisineType, String cookingTime);
    List<Recipe> findByDifficultyAndCookingTime(String difficulty, String cookingTime);
    List<Recipe> findByCuisineType(String cuisineType);
    List<Recipe> findByDifficulty(String difficulty);
    List<Recipe> findByCookingTime(String cookingTime);
    List<Recipe> findByTagsIn(List<String> tags);
    List<Recipe> findByAuthorId(String authorId);
    List<Recipe> findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String title, String description);
    List<Recipe> findByOrderByCreatedAtDesc();
    List<Recipe> findByTitleContainingIgnoreCase(String title);
    List<Recipe> findTop10ByTitleContainingIgnoreCase(String title);
    List<Recipe> findByCreatedAtAfter(LocalDateTime date);
    List<Recipe> findByOrderByLikesCountDesc();

    // Admin analytics methods
    List<Recipe> findByFeaturedTrue();
    
    List<Recipe> findTop10ByOrderByLikesCountDesc();
    
    long countByCreatedAtAfter(LocalDateTime date);
    
    @Aggregation("{ $group: { _id: null, total: { $sum: '$likesCount' } } }")
    long sumLikesCount();
    
    @Aggregation("{ $group: { _id: null, total: { $sum: '$viewsCount' } } }")
    long sumViewsCount();
    
    @Aggregation("{ $group: { _id: '$authorId', count: { $sum: 1 } } }")
    List<Object[]> findMostActiveUsers(int limit);
    
    @Aggregation("{ $group: { _id: '$cuisineType', count: { $sum: 1 } } }")
    List<Object[]> findPopularCuisineTypes();
} 
