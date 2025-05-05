package com.example.backend.services;

import com.example.backend.models.*;
import com.example.backend.repositories.*;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.*;
import java.util.stream.Stream;

@Service
public class RecommendationService {
    private static final Logger logger = LoggerFactory.getLogger(RecommendationService.class);
    
    // Constants for map keys
    private static final String KEY_RELEVANCE_SCORE = "relevanceScore";
    private static final String KEY_TITLE = "title";
    
    private final RecipeRepository recipeRepository;
    private final SearchTrendRepository searchTrendRepository;
    private final UserInteractionService userInteractionService;

    public RecommendationService(
            RecipeRepository recipeRepository,
            SearchTrendRepository searchTrendRepository,
            UserInteractionService userInteractionService) {
        this.recipeRepository = recipeRepository;
        this.searchTrendRepository = searchTrendRepository;
        this.userInteractionService = userInteractionService;
    }

    public List<Map<String, Object>> getPersonalizedRecommendations(String userId) {
        logger.info("Generating personalized recommendations for user: {}", userId);
        
        try {
            // Get trending recipes based on search trends
            List<SearchTrend> trendingSearches = searchTrendRepository.findAll();
            
            // Process and score recommendations
            List<Map<String, Object>> recommendations = processRecommendations(userId, trendingSearches);
            
            // Sort by relevance score
            recommendations.sort((a, b) -> 
                Double.compare((Double) b.get(KEY_RELEVANCE_SCORE), (Double) a.get(KEY_RELEVANCE_SCORE)));
            
            // Extract top recommendations
            return recommendations.stream()
                    .limit(10)
                    .map(r -> {
                        Map<String, Object> rec = new HashMap<>();
                        rec.put(KEY_TITLE, r.get(KEY_TITLE));
                        rec.put(KEY_RELEVANCE_SCORE, r.get(KEY_RELEVANCE_SCORE));
                        return rec;
                    })
                    .toList();
                    
        } catch (Exception e) {
            logger.error("Error generating recommendations for user {}: {}", userId, e.getMessage());
            return new ArrayList<>();
        }
    }

    public List<String> getTrendingRecipes() {
        return recipeRepository.findByOrderByCreatedAtDesc().stream().map(Recipe::getTitle).toList();
    }

    public List<String> getSimilarRecipes(String recipeId) {
        List<Recipe> similarRecipes = recipeRepository.findByTagsIn(recipeRepository.findById(recipeId).orElseThrow().getTags());
        return similarRecipes.stream().map(Recipe::getTitle).toList();
    }

    private List<Map<String, Object>> processRecommendations(String userId, List<SearchTrend> trendingSearches) {
        List<Map<String, Object>> recommendations = new ArrayList<>();
        
        // Process trending searches
        for (SearchTrend trend : trendingSearches) {
            Map<String, Object> rec = new HashMap<>();
            rec.put(KEY_TITLE, "Trending: " + trend.getSearchTerm());
            rec.put(KEY_RELEVANCE_SCORE, calculateRelevanceScore(trend));
            recommendations.add(rec);
        }
        
        // Add user interaction-based recommendations
        List<UserInteraction> interactions = userInteractionService.getUserInteractions(userId);
        for (UserInteraction interaction : interactions) {
            Map<String, Object> rec = new HashMap<>();
            rec.put(KEY_TITLE, "Based on your interest in " + interaction.getRecipeTitle());
            rec.put(KEY_RELEVANCE_SCORE, 0.8); // Example score
            recommendations.add(rec);
        }
        
        return recommendations;
    }

    private double calculateRelevanceScore(SearchTrend trend) {
        // Example calculation
        return Math.min(1.0, trend.getSearchCount() / 100.0);
    }
}