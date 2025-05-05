package com.example.backend.services;

import com.example.backend.models.UserInteraction;
import com.example.backend.repositories.UserInteractionRepository;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@Service
public class UserInteractionService {
    private static final Logger logger = LoggerFactory.getLogger(UserInteractionService.class);
    private final UserInteractionRepository userInteractionRepository;
    
    private static final Map<String, Double> INTERACTION_WEIGHTS = new HashMap<>();
    static {
        INTERACTION_WEIGHTS.put("view", 1.0);
        INTERACTION_WEIGHTS.put("like", 2.0);
        INTERACTION_WEIGHTS.put("comment", 3.0);
        INTERACTION_WEIGHTS.put("share", 4.0);
    }

    public UserInteractionService(UserInteractionRepository userInteractionRepository) {
        this.userInteractionRepository = userInteractionRepository;
    }

    @Transactional
    public UserInteraction trackInteraction(String userId, String recipeId, String recipeTitle, String interactionType) {
        logger.info("Tracking {} interaction for user {} on recipe {}", interactionType, userId, recipeId);
        UserInteraction interaction = new UserInteraction();
        interaction.setUserId(userId);
        interaction.setRecipeId(recipeId);
        interaction.setRecipeTitle(recipeTitle);
        interaction.setInteractionType(interactionType);
        interaction.setInteractionWeight(INTERACTION_WEIGHTS.getOrDefault(interactionType, 1.0));
        
        UserInteraction saved = userInteractionRepository.save(interaction);
        logger.debug("Saved interaction with id: {}", saved.getId());
        return saved;
    }

    public List<UserInteraction> getUserInteractions(String userId) {
        logger.debug("Fetching all interactions for user: {}", userId);
        return userInteractionRepository.findByUserId(userId);
    }

    public List<UserInteraction> getRecentUserInteractions(String userId, LocalDateTime since) {
        logger.debug("Fetching interactions for user {} since {}", userId, since);
        return userInteractionRepository.findByUserIdAndTimestampAfter(userId, since);
    }

    public List<UserInteraction> getRecipeInteractions(String recipeId) {
        logger.debug("Fetching all interactions for recipe: {}", recipeId);
        return userInteractionRepository.findByRecipeId(recipeId);
    }

    public long getInteractionCount(String recipeId, String interactionType) {
        logger.debug("Counting {} interactions for recipe {}", interactionType, recipeId);
        return userInteractionRepository.countByRecipeIdAndInteractionType(recipeId, interactionType);
    }

    public List<UserInteraction> getUserRecipeInteractions(String userId, String recipeId) {
        logger.debug("Fetching interactions between user {} and recipe {}", userId, recipeId);
        return userInteractionRepository.findByUserIdAndRecipeId(userId, recipeId);
    }

    public List<UserInteraction> getInteractionsByType(String userId, String interactionType) {
        logger.debug("Fetching {} interactions for user {}", interactionType, userId);
        return userInteractionRepository.findByUserIdAndInteractionType(userId, interactionType);
    }
}