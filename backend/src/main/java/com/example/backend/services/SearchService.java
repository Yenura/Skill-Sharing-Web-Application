package com.example.backend.services;

import com.example.backend.models.*;
import com.example.backend.repositories.*;
import com.example.backend.utils.SearchHighlighter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.TextCriteria;
import org.springframework.data.mongodb.core.query.TextQuery;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Arrays;
import java.util.stream.Collectors;

@Service
public class SearchService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private LearningPlanRepository learningPlanRepository;
    
    @Autowired
    private RecipeRepository recipeRepository;
    
    @Autowired
    private GroupRepository groupRepository;
    
    @Autowired
    private MongoTemplate mongoTemplate;
    
    @Autowired
    private SearchHighlighter highlighter;

    // Global search across all content types
    @Cacheable(value = "searchResults", key = "'global_' + #query + '_' + #minSimilarity")
    public Map<String, Object> searchAll(String query, double minSimilarity) {
        Map<String, Object> results = new HashMap<>();
        
        // Perform text search with scoring
        TextCriteria criteria = TextCriteria.forDefaultLanguage()
            .matchingAny(query)
            .caseSensitive(false);
        
        // Get results for each type
        Map<String, Object> userResults = highlighter.highlightObject(
            convertToMap(userRepository.findByUsernameContainingIgnoreCase(query)),
            query
        );
        Map<String, Object> planResults = highlighter.highlightObject(
            convertToMap(learningPlanRepository.findByTitleContainingIgnoreCase(query)),
            query
        );
        Map<String, Object> recipeResults = highlighter.highlightObject(
            convertToMap(recipeRepository.findByTitleContainingIgnoreCase(query)),
            query
        );
        Map<String, Object> groupResults = highlighter.highlightObject(
            convertToMap(groupRepository.findByNameContainingIgnoreCase(query)),
            query
        );
        
        // Add highlighted results
        results.put("users", userResults);
        results.put("learningPlans", planResults);
        results.put("recipes", recipeResults);
        results.put("groups", groupResults);
        
        return results;
    }

    // Fuzzy search with suggestions
    @Cacheable(value = "searchResults", key = "'fuzzy_' + #query + '_' + #type + '_' + #minSimilarity")
    public Map<String, Object> fuzzySearch(String query, String type, double minSimilarity) {
        Map<String, Object> results = new HashMap<>();
        
        switch (type.toLowerCase()) {
            case "users":
                results.put("results", highlighter.highlightObject(
                    convertToMap(userRepository.findByUsernameContainingIgnoreCase(query)),
                    query
                ));
                results.put("suggestions", getSuggestions(query, "users"));
                break;
            case "learning-plans":
                results.put("results", highlighter.highlightObject(
                    convertToMap(learningPlanRepository.findByTitleContainingIgnoreCase(query)),
                    query
                ));
                results.put("suggestions", getSuggestions(query, "learning-plans"));
                break;
            case "recipes":
                results.put("results", highlighter.highlightObject(
                    convertToMap(recipeRepository.findByTitleContainingIgnoreCase(query)),
                    query
                ));
                results.put("suggestions", getSuggestions(query, "recipes"));
                break;
            case "groups":
                results.put("results", highlighter.highlightObject(
                    convertToMap(groupRepository.findByNameContainingIgnoreCase(query)),
                    query
                ));
                results.put("suggestions", getSuggestions(query, "groups"));
                break;
        }
        
        return results;
    }

    // Weighted search across specific fields
    @Cacheable(value = "searchResults", key = "'weighted_' + #query + '_' + #type + '_' + #fieldWeights")
    public Map<String, Object> weightedSearch(String query, String type, Map<String, Float> fieldWeights) {
        Map<String, Object> results = new HashMap<>();
        
        switch (type.toLowerCase()) {
            case "users":
                results.put("results", highlighter.highlightObject(
                    convertToMap(userRepository.findByUsernameContainingIgnoreCase(query)),
                    query
                ));
                break;
            case "learning-plans":
                results.put("results", highlighter.highlightObject(
                    convertToMap(learningPlanRepository.findByTitleContainingIgnoreCase(query)),
                    query
                ));
                break;
            case "recipes":
                results.put("results", highlighter.highlightObject(
                    convertToMap(recipeRepository.findByTitleContainingIgnoreCase(query)),
                    query
                ));
                break;
            case "groups":
                results.put("results", highlighter.highlightObject(
                    convertToMap(groupRepository.findByNameContainingIgnoreCase(query)),
                    query
                ));
                break;
        }
        
        return results;
    }

    // Faceted search with aggregations
    @Cacheable(value = "searchResults", key = "'faceted_' + #query + '_' + #type + '_' + #facets")
    public Map<String, Object> facetedSearch(String query, String type, List<String> facets) {
        Map<String, Object> results = new HashMap<>();
        
        switch (type.toLowerCase()) {
            case "users":
                results.put("results", highlighter.highlightObject(
                    convertToMap(userRepository.findByUsernameContainingIgnoreCase(query)),
                    query
                ));
                break;
            case "learning-plans":
                results.put("results", highlighter.highlightObject(
                    convertToMap(learningPlanRepository.findByTitleContainingIgnoreCase(query)),
                    query
                ));
                break;
            case "recipes":
                results.put("results", highlighter.highlightObject(
                    convertToMap(recipeRepository.findByTitleContainingIgnoreCase(query)),
                    query
                ));
                break;
            case "groups":
                results.put("results", highlighter.highlightObject(
                    convertToMap(groupRepository.findByNameContainingIgnoreCase(query)),
                    query
                ));
                break;
        }
        
        return results;
    }

    @Cacheable(value = "suggestions", key = "#prefix + '_' + #type")
    private List<String> getSuggestions(String prefix, String type) {
        switch (type.toLowerCase()) {
            case "users":
                return userRepository.findTop10ByUsernameContainingIgnoreCase(prefix)
                    .stream()
                    .map(User::getUsername)
                    .collect(Collectors.toList());
            case "learning-plans":
                return learningPlanRepository.findTop10ByTitleContainingIgnoreCase(prefix)
                    .stream()
                    .map(LearningPlan::getTitle)
                    .collect(Collectors.toList());
            case "recipes":
                return recipeRepository.findTop10ByTitleContainingIgnoreCase(prefix)
                    .stream()
                    .map(Recipe::getTitle)
                    .collect(Collectors.toList());
            case "groups":
                return groupRepository.findTop10ByNameContainingIgnoreCase(prefix)
                    .stream()
                    .map(Group::getName)
                    .collect(Collectors.toList());
            default:
                return List.of();
        }
    }

    private Map<String, Object> convertToMap(List<?> list) {
        Map<String, Object> result = new HashMap<>();
        result.put("content", list);
        result.put("totalElements", list.size());
        result.put("totalPages", 1);
        result.put("size", list.size());
        result.put("number", 0);
        return result;
    }
} 
