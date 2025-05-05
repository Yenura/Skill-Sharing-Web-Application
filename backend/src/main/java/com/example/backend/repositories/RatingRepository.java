package com.example.backend.repositories;

import com.example.backend.models.Rating;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RatingRepository extends MongoRepository<Rating, String> {
    List<Rating> findByRecipeId(String recipeId);
    List<Rating> findByUserId(String userId);
    Optional<Rating> findByRecipeIdAndUserId(String recipeId, String userId);
    long countByRecipeId(String recipeId);
}
