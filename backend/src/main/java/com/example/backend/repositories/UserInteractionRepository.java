package com.example.backend.repositories;

import com.example.backend.models.UserInteraction;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface UserInteractionRepository extends MongoRepository<UserInteraction, String> {
    List<UserInteraction> findByUserId(String userId);
    List<UserInteraction> findByUserIdAndTimestampAfter(String userId, LocalDateTime timestamp);
    List<UserInteraction> findByRecipeId(String recipeId);
    List<UserInteraction> findByUserIdAndRecipeId(String userId, String recipeId);
    List<UserInteraction> findByUserIdAndInteractionType(String userId, String interactionType);
    long countByRecipeIdAndInteractionType(String recipeId, String interactionType);
}