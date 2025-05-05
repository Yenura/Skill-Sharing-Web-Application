package com.example.backend.services;

import com.example.backend.models.*;
import com.example.backend.repositories.*;
import com.example.backend.utils.SearchHighlighter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.TextCriteria;
import org.springframework.data.mongodb.core.query.TextQuery;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;
import java.time.LocalDateTime;

@Service
public class SearchService {
    
    @Autowired
    private MongoTemplate mongoTemplate;
    
    @Autowired
    private RecipeRepository recipeRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private GroupRepository groupRepository;
    
    @Autowired
    private SearchHighlighter highlighter;
    
    @Autowired
    private SearchTrendService searchTrendService;

    @Cacheable(value = "searchResults", key = "#criteria.toString()")
    public Map<String, Object> search(SearchCriteria criteria) {
        Map<String, Object> results = new HashMap<>();
        
        // Build base query
        Query query = buildSearchQuery(criteria);
        
        // Add faceted search
        if (criteria.getFacets() != null) {
            addFacetCriteria(query, criteria.getFacets());
        }
        
        // Execute search based on type and track search trends
        List<?> searchResults;
        switch (criteria.getType().toLowerCase()) {
            case "recipe":
                searchResults = searchRecipes(query, criteria);
                results.put("items", searchResults);
                results.put("facets", generateRecipeFacets());
                results.put("suggestions", generateRecipeSuggestions(criteria.getQuery()));
                trackSearchMetrics(criteria, searchResults);
                break;
            case "user":
                searchResults = searchUsers(query, criteria);
                results.put("items", searchResults);
                results.put("facets", generateUserFacets());
                trackSearchMetrics(criteria, searchResults);
                break;
            case "community":
                searchResults = searchCommunities(query, criteria);
                results.put("items", searchResults);
                results.put("facets", generateCommunityFacets());
                results.put("suggestions", generateCommunitySuggestions(criteria.getQuery()));
                trackSearchMetrics(criteria, searchResults);
                break;
            default:
                Map<String, Object> allResults = searchAll(criteria);
                results.put("items", allResults);
                trackSearchMetrics(criteria, new ArrayList<>(allResults.values()));
        }
        
        // Add trending and popular searches
        results.put("trending", searchTrendService.getTrendingSearches(criteria.getType()));
        results.put("popular", searchTrendService.getPopularSearches());
        
        return results;
    }
    
    private void trackSearchMetrics(SearchCriteria criteria, List<?> results) {
        double relevanceScore = calculateRelevanceScore(criteria.getQuery(), results);
        searchTrendService.trackSearch(
            criteria.getQuery(),
            criteria.getType(),
            results.size(),
            relevanceScore
        );
    }
    
    private double calculateRelevanceScore(String query, List<?> results) {
        if (results.isEmpty()) return 0.0;
        
        // Calculate relevance based on result count and quality
        double baseScore = Math.min(1.0, results.size() / 10.0);
        
        // Analyze result quality (e.g., text matching, popularity)
        double qualityScore = analyzeResultQuality(query, results);
        
        return (baseScore + qualityScore) / 2.0;
    }
    
    private double analyzeResultQuality(String query, List<?> results) {
        double score = 0.0;
        String[] queryTerms = query.toLowerCase().split("\\s+");
        
        for (Object result : results) {
            if (result instanceof Recipe) {
                Recipe recipe = (Recipe) result;
                score += calculateRecipeRelevance(recipe, queryTerms);
            } else if (result instanceof User) {
                User user = (User) result;
                score += calculateUserRelevance(user, queryTerms);
            } else if (result instanceof Group) {
                Group group = (Group) result;
                score += calculateGroupRelevance(group, queryTerms);
            }
        }
        
        return Math.min(1.0, score / results.size());
    }
    
    private double calculateRecipeRelevance(Recipe recipe, String[] queryTerms) {
        double score = 0.0;
        
        // Check title match
        for (String term : queryTerms) {
            if (recipe.getTitle() != null && recipe.getTitle().toLowerCase().contains(term.toLowerCase())) {
                score += 0.5; // Title matches are highly relevant
            }
        }
        
        return score;
    }
    
    private double calculateUserRelevance(User user, String[] queryTerms) {
        double score = 0.0;
        
        // Check username and bio matches
        for (String term : queryTerms) {
            if (user.getUsername() != null && user.getUsername().toLowerCase().contains(term.toLowerCase())) {
                score += 0.5; // Username matches are highly relevant
            }
            if (user.getBio() != null && user.getBio().toLowerCase().contains(term.toLowerCase())) {
                score += 0.3; // Bio matches are somewhat relevant
            }
        }
        
        return score;
    }
    
    private double calculateGroupRelevance(Group group, String[] queryTerms) {
        double score = 0.0;
        
        // Check name and description matches
        for (String term : queryTerms) {
            if (group.getName() != null && group.getName().toLowerCase().contains(term.toLowerCase())) {
                score += 0.5; // Name matches are highly relevant
            }
            if (group.getDescription() != null && group.getDescription().toLowerCase().contains(term.toLowerCase())) {
                score += 0.3; // Description matches are somewhat relevant
            }
        }
        
        return score;
    }
    
    private Query buildSearchQuery(SearchCriteria criteria) {
        TextCriteria textCriteria = TextCriteria.forDefaultLanguage().matchingAny(criteria.getQuery());
            
        Query query = TextQuery.queryText(textCriteria)
            .sortByScore()
            .with(PageRequest.of(
                criteria.getPage(),
                criteria.getSize(),
                Sort.by(criteria.getSortDirection().equals("ASC") ? Sort.Direction.ASC : Sort.Direction.DESC,
                criteria.getSortBy() != null ? criteria.getSortBy() : "score")
            ));
            
        return query;
    }
    
    private void addFacetCriteria(Query query, Map<String, List<String>> facets) {
        facets.forEach((field, values) -> {
            if (!values.isEmpty()) {
                query.addCriteria(Criteria.where(field).in(values));
            }
        });
    }
    
    private List<Recipe> searchRecipes(Query query, SearchCriteria criteria) {
        if (criteria.getFilters() != null) {
            criteria.getFilters().forEach(filter -> {
                if (filter.startsWith("cuisine:")) {
                    query.addCriteria(Criteria.where("cuisineType").is(filter.substring(8)));
                } else if (filter.startsWith("difficulty:")) {
                    query.addCriteria(Criteria.where("difficultyLevel").is(filter.substring(11)));
                }
            });
        }
        
        return mongoTemplate.find(query, Recipe.class);
    }
    
    private List<Group> searchCommunities(Query query, SearchCriteria criteria) {
        // Apply pagination if specified
        if (criteria.getPage() >= 0 && criteria.getSize() > 0) {
            query.with(PageRequest.of(criteria.getPage(), criteria.getSize()));
        }
        
        // Apply sorting if specified
        if (criteria.getSortBy() != null && !criteria.getSortBy().isEmpty()) {
            Sort sort = criteria.getSortDirection().equalsIgnoreCase("desc") 
                ? Sort.by(criteria.getSortBy()).descending() 
                : Sort.by(criteria.getSortBy()).ascending();
            query.with(sort);
        }
        
        List<Group> communities = mongoTemplate.find(query, Group.class);
        
        // Apply highlighting if query is not empty
        if (criteria.getQuery() != null && !criteria.getQuery().isEmpty()) {
            communities.forEach(community -> {
                if (community.getDescription() != null) {
                    community.setDescription(highlighter.highlightText(community.getDescription(), criteria.getQuery()));
                }
                if (community.getName() != null) {
                    community.setName(highlighter.highlightText(community.getName(), criteria.getQuery()));
                }
            });
        }
        
        return communities;
    }
    
    private List<User> searchUsers(Query query, SearchCriteria criteria) {
        // Apply pagination if specified
        if (criteria.getPage() >= 0 && criteria.getSize() > 0) {
            query.with(PageRequest.of(criteria.getPage(), criteria.getSize()));
        }
        
        // Apply sorting if specified
        if (criteria.getSortBy() != null && !criteria.getSortBy().isEmpty()) {
            Sort sort = criteria.getSortDirection().equalsIgnoreCase("desc") 
                ? Sort.by(criteria.getSortBy()).descending() 
                : Sort.by(criteria.getSortBy()).ascending();
            query.with(sort);
        }
        
        List<User> users = mongoTemplate.find(query, User.class);
        
        // Apply highlighting if query is not empty
        if (criteria.getQuery() != null && !criteria.getQuery().isEmpty()) {
            users.forEach(user -> {
                if (user.getBio() != null) {
                    user.setBio(highlighter.highlightText(user.getBio(), criteria.getQuery()));
                }
                if (user.getUsername() != null) {
                    user.setUsername(highlighter.highlightText(user.getUsername(), criteria.getQuery()));
                }
            });
        }
        
        return users;
    }
    
    private Map<String, Object> searchAll(SearchCriteria criteria) {
        Map<String, Object> results = new HashMap<>();
        results.put("recipes", searchRecipes(buildSearchQuery(criteria), criteria));
        results.put("users", searchUsers(buildSearchQuery(criteria), criteria));
        results.put("communities", searchCommunities(buildSearchQuery(criteria), criteria));
        return results;
    }
    
    @Cacheable(value = "autoComplete", key = "#prefix")
    public List<String> autoComplete(String prefix, String type) {
        Query query = new Query(Criteria.where("title").regex("^" + prefix, "i"))
            .limit(10);
            
        switch (type.toLowerCase()) {
            case "recipe":
                return mongoTemplate.find(query, Recipe.class).stream()
                    .map(Recipe::getTitle)
                    .collect(Collectors.toList());
            case "community":
                return mongoTemplate.find(query, Group.class).stream()
                    .map(Group::getName)
                    .collect(Collectors.toList());
            default:
                return new ArrayList<>();
        }
    }
    
    public Map<String, List<String>> generateRecipeFacets() {
        Map<String, List<String>> facets = new HashMap<>();
        facets.put("cuisineTypes", mongoTemplate.findDistinct("cuisineType", Recipe.class, String.class));
        facets.put("difficultyLevels", mongoTemplate.findDistinct("difficultyLevel", Recipe.class, String.class));
        return facets;
    }
    
    public Map<String, List<String>> generateUserFacets() {
        Map<String, List<String>> facets = new HashMap<>();
        facets.put("cookingExpertise", mongoTemplate.findDistinct("cookingExpertise", User.class, String.class));
        return facets;
    }
    
    public Map<String, List<String>> generateCommunityFacets() {
        Map<String, List<String>> facets = new HashMap<>();
        facets.put("categories", mongoTemplate.findDistinct("category", Group.class, String.class));
        facets.put("difficultyLevels", mongoTemplate.findDistinct("difficultyLevel", Group.class, String.class));
        return facets;
    }
    
    private List<String> generateRecipeSuggestions(String query) {
        // Get similar recipes based on tags and ingredients
        Query suggestQuery = new Query(new Criteria().orOperator(
            Criteria.where("tags").regex(query, "i"),
            Criteria.where("ingredients").regex(query, "i")
        )).limit(5);
        
        return mongoTemplate.find(suggestQuery, Recipe.class).stream()
            .map(Recipe::getTitle)
            .collect(Collectors.toList());
    }
    
    private List<String> generateCommunitySuggestions(String query) {
        if (query == null || query.isEmpty()) {
            return Collections.emptyList();
        }
        
        // Find communities with similar names or descriptions
        Query searchQuery = new Query(
            new Criteria().orOperator(
                Criteria.where("name").regex(".*" + query + ".*", "i"),
                Criteria.where("description").regex(".*" + query + ".*", "i")
            )
        );
        searchQuery.limit(10);
        
        List<Group> communities = mongoTemplate.find(searchQuery, Group.class);
        
        // Extract relevant terms from communities
        return communities.stream()
            .map(Group::getName)
            .distinct()
            .limit(5)
            .collect(Collectors.toList());
    }

    @Cacheable(value = "trendingSearches", key = "'trending'")
    public List<String> getTrendingSuggestions() {
        // Combine trending searches with popular content
        Set<String> suggestions = new LinkedHashSet<>();
        
        // Add trending searches
        suggestions.addAll(searchTrendService.getTrendingSearches("recipe"));
        
        // Add terms from trending recipes
        Query query = new Query();
        query.addCriteria(Criteria.where("createdAt").gt(LocalDateTime.now().minusWeeks(1)));
        query.with(Sort.by(Sort.Direction.DESC, "viewsCount"));
        query.limit(10);
        
        List<Recipe> trendingRecipes = mongoTemplate.find(query, Recipe.class);
        trendingRecipes.forEach(recipe -> {
            suggestions.add(recipe.getTitle());
            if (recipe.getTags() != null) {
                suggestions.addAll(recipe.getTags());
            }
        });
        
        return new ArrayList<>(suggestions).subList(0, Math.min(suggestions.size(), 10));
    }
    
    public void trackSearchClickThrough(String searchTerm, String type) {
        searchTrendService.trackClickThrough(searchTerm, type);
    }
    
    /**
     * Get available filters for a specific content type
     * @param type The content type (recipe, user, community)
     * @return Map of filter categories and their possible values
     */
    public Map<String, Object> getAvailableFilters(String type) {
        Map<String, Object> filters = new HashMap<>();
        
        switch (type.toLowerCase()) {
            case "recipe":
                filters.put("cuisineTypes", mongoTemplate.findDistinct("cuisineType", Recipe.class, String.class));
                filters.put("difficultyLevels", Arrays.asList("Easy", "Medium", "Hard", "Expert"));
                filters.put("cookingTime", Map.of(
                    "min", 5,
                    "max", 180,
                    "step", 5,
                    "unit", "minutes"
                ));
                filters.put("ingredients", getTopIngredients(20));
                filters.put("tags", getTopTags(20));
                break;
                
            case "user":
                filters.put("expertise", Arrays.asList("Beginner", "Intermediate", "Advanced", "Professional"));
                filters.put("interests", getPopularInterests(20));
                break;
                
            case "community":
                filters.put("categories", mongoTemplate.findDistinct("category", Group.class, String.class));
                filters.put("difficultyLevels", mongoTemplate.findDistinct("difficultyLevel", Group.class, String.class));
                filters.put("privacy", Arrays.asList("Public", "Private"));
                break;
                
            default:
                // Return all filters
                Map<String, Object> recipeFilters = getAvailableFilters("recipe");
                Map<String, Object> userFilters = getAvailableFilters("user");
                Map<String, Object> communityFilters = getAvailableFilters("community");
                
                filters.put("recipe", recipeFilters);
                filters.put("user", userFilters);
                filters.put("community", communityFilters);
        }
        
        return filters;
    }
    
    /**
     * Get available sort options for a specific content type
     * @param type The content type (recipe, user, community)
     * @return Map of sort option keys and their display names
     */
    public Map<String, String> getAvailableSortOptions(String type) {
        Map<String, String> sortOptions = new LinkedHashMap<>();
        
        switch (type.toLowerCase()) {
            case "recipe":
                sortOptions.put("relevance", "Most Relevant");
                sortOptions.put("createdAt_desc", "Newest First");
                sortOptions.put("createdAt_asc", "Oldest First");
                sortOptions.put("likesCount_desc", "Most Liked");
                sortOptions.put("viewsCount_desc", "Most Viewed");
                sortOptions.put("commentsCount_desc", "Most Commented");
                sortOptions.put("cookingTime_asc", "Quickest to Make");
                break;
                
            case "user":
                sortOptions.put("relevance", "Most Relevant");
                sortOptions.put("createdAt_desc", "Newest Members");
                sortOptions.put("followers_desc", "Most Followers");
                sortOptions.put("recipes_desc", "Most Recipes");
                break;
                
            case "community":
                sortOptions.put("relevance", "Most Relevant");
                sortOptions.put("createdAt_desc", "Newest First");
                sortOptions.put("memberCount_desc", "Most Members");
                sortOptions.put("recipeCount_desc", "Most Recipes");
                sortOptions.put("activityLevel_desc", "Most Active");
                break;
                
            default:
                sortOptions.put("relevance", "Most Relevant");
                sortOptions.put("createdAt_desc", "Newest First");
                sortOptions.put("createdAt_asc", "Oldest First");
                sortOptions.put("popularity_desc", "Most Popular");
        }
        
        return sortOptions;
    }
    
    /**
     * Search for recipes by ingredients
     * @param ingredients List of ingredients to search for
     * @param page Page number
     * @param size Page size
     * @param sortBy Sort option
     * @return Map containing search results and metadata
     */
    public Map<String, Object> searchByIngredients(List<String> ingredients, int page, int size, String sortBy) {
        Map<String, Object> results = new HashMap<>();
        
        // Create criteria for ingredient search
        Criteria criteria = new Criteria();
        List<Criteria> ingredientCriteria = new ArrayList<>();
        
        for (String ingredient : ingredients) {
            ingredientCriteria.add(Criteria.where("ingredients").regex(ingredient, "i"));
        }
        
        if (!ingredientCriteria.isEmpty()) {
            criteria = criteria.andOperator(ingredientCriteria.toArray(new Criteria[0]));
        }
        
        // Create query with pagination
        Query query = new Query(criteria);
        query.with(PageRequest.of(page, size));
        
        // Add sorting
        if (sortBy != null && !sortBy.isEmpty()) {
            if (sortBy.contains("_")) {
                String[] parts = sortBy.split("_");
                String field = parts[0];
                Sort.Direction direction = parts[1].equalsIgnoreCase("desc") ? 
                    Sort.Direction.DESC : Sort.Direction.ASC;
                query.with(Sort.by(direction, field));
            }
        } else {
            // Default sort by most ingredients matched
            query.with(Sort.by(Sort.Direction.DESC, "relevanceScore"));
        }
        
        // Execute query
        List<Recipe> recipes = mongoTemplate.find(query, Recipe.class);
        
        // Calculate match percentage for each recipe
        List<Map<String, Object>> enrichedResults = recipes.stream()
            .map(recipe -> {
                Map<String, Object> enriched = new HashMap<>();
                enriched.put("recipe", recipe);
                
                // Calculate match percentage
                Set<String> recipeIngredients = new HashSet<>(recipe.getIngredients());
                Set<String> searchIngredients = new HashSet<>(ingredients);
                
                int matchCount = 0;
                for (String searchIngredient : searchIngredients) {
                    for (String recipeIngredient : recipeIngredients) {
                        if (recipeIngredient.toLowerCase().contains(searchIngredient.toLowerCase())) {
                            matchCount++;
                            break;
                        }
                    }
                }
                
                double matchPercentage = searchIngredients.isEmpty() ? 0 : 
                    (double) matchCount / searchIngredients.size() * 100;
                enriched.put("matchPercentage", matchPercentage);
                
                // Add missing ingredients
                List<String> missingIngredients = new ArrayList<>();
                for (String searchIngredient : searchIngredients) {
                    boolean found = false;
                    for (String recipeIngredient : recipeIngredients) {
                        if (recipeIngredient.toLowerCase().contains(searchIngredient.toLowerCase())) {
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                        missingIngredients.add(searchIngredient);
                    }
                }
                enriched.put("missingIngredients", missingIngredients);
                
                return enriched;
            })
            .collect(Collectors.toList());
        
        // Add results to response
        results.put("items", enrichedResults);
        results.put("totalItems", mongoTemplate.count(query, Recipe.class));
        results.put("page", page);
        results.put("size", size);
        
        return results;
    }
    
    /**
     * Search for recipes by nutritional values
     * @param nutritionalCriteria Map of nutritional criteria
     * @param page Page number
     * @param size Page size
     * @return Map containing search results and metadata
     */
    public Map<String, Object> searchByNutritionalValues(Map<String, Object> nutritionalCriteria, int page, int size) {
        Map<String, Object> results = new HashMap<>();
        
        // Create criteria for nutritional search
        Criteria criteria = new Criteria();
        List<Criteria> nutritionalFilters = new ArrayList<>();
        
        for (Map.Entry<String, Object> entry : nutritionalCriteria.entrySet()) {
            String nutrient = entry.getKey();
            Map<String, Number> range = (Map<String, Number>) entry.getValue();
            
            if (range.containsKey("min")) {
                nutritionalFilters.add(Criteria.where("nutritionalInfo." + nutrient).gte(range.get("min")));
            }
            
            if (range.containsKey("max")) {
                nutritionalFilters.add(Criteria.where("nutritionalInfo." + nutrient).lte(range.get("max")));
            }
        }
        
        if (!nutritionalFilters.isEmpty()) {
            criteria = criteria.andOperator(nutritionalFilters.toArray(new Criteria[0]));
        }
        
        // Create query with pagination
        Query query = new Query(criteria);
        query.with(PageRequest.of(page, size));
        
        // Execute query
        List<Recipe> recipes = mongoTemplate.find(query, Recipe.class);
        long totalItems = mongoTemplate.count(query, Recipe.class);
        
        // Add results to response
        results.put("items", recipes);
        results.put("totalItems", totalItems);
        results.put("page", page);
        results.put("size", size);
        
        return results;
    }
    
    /**
     * Find similar content based on an existing item
     * @param id The ID of the item to find similar content for
     * @param type The type of the item (recipe, user, community)
     * @param limit Maximum number of similar items to return
     * @return Map containing similar items
     */
    public Map<String, Object> findSimilarContent(String id, String type, int limit) {
        Map<String, Object> results = new HashMap<>();
        
        switch (type.toLowerCase()) {
            case "recipe":
                Optional<Recipe> recipeOpt = recipeRepository.findById(id);
                if (recipeOpt.isPresent()) {
                    List<Recipe> similarRecipes = findSimilarRecipes(recipeOpt.get(), limit);
                    results.put("items", similarRecipes);
                    results.put("count", similarRecipes.size());
                }
                break;
                
            case "user":
                Optional<User> userOpt = userRepository.findById(id);
                if (userOpt.isPresent()) {
                    List<User> similarUsers = findSimilarUsers(userOpt.get(), limit);
                    results.put("items", similarUsers);
                    results.put("count", similarUsers.size());
                }
                break;
                
            case "community":
                Optional<Group> groupOpt = groupRepository.findById(id);
                if (groupOpt.isPresent()) {
                    List<Group> similarGroups = findSimilarGroups(groupOpt.get(), limit);
                    results.put("items", similarGroups);
                    results.put("count", similarGroups.size());
                }
                break;
                
            default:
                results.put("error", "Invalid content type");
        }
        
        return results;
    }
    
    /**
     * Get content filters for a specific type
     * @param type The content type (recipe, user, community)
     * @return Map of filter categories and their possible values
     */
    public Map<String, Object> getContentFilters(String type) {
        return switch (type.toLowerCase()) {
            case "recipe" -> getAvailableFilters("recipe");
            case "user" -> getAvailableFilters("user");
            case "community" -> getAvailableFilters("community");
            default -> new HashMap<>();
        };
    }
    
    /**
     * Search for recipes by cooking skill level
     * @param skillLevel The cooking skill level to search for
     * @param page Page number
     * @param size Page size
     * @return Map containing search results and metadata
     */
    public Map<String, Object> searchBySkillLevel(String skillLevel, int page, int size) {
        Map<String, Object> results = new HashMap<>();
        
        try {
            Criteria criteria = Criteria.where("skillLevel").is(skillLevel);
            Query query = new Query(criteria);
            
            // Count total results
            long totalCount = mongoTemplate.count(query, Recipe.class);
            
            // Apply pagination
            query.with(PageRequest.of(page, size));
            
            // Get paginated results
            List<Recipe> recipes = mongoTemplate.find(query, Recipe.class);
            
            results.put("items", recipes);
            results.put("totalItems", totalCount);
            results.put("totalPages", Math.ceil((double) totalCount / size));
            results.put("currentPage", page);
            
        } catch (Exception e) {
            results.put("error", "Error searching by skill level: " + e.getMessage());
        }
        
        return results;
    }
    
    // Helper methods
    
    private List<String> getTopIngredients(int limit) {
        // Get most frequently used ingredients
        // This is a simplified implementation
        Query query = new Query();
        query.limit(1000);  // Get a sample of recipes
        
        List<Recipe> recipes = mongoTemplate.find(query, Recipe.class);
        Map<String, Integer> ingredientCounts = new HashMap<>();
        
        for (Recipe recipe : recipes) {
            for (String ingredient : recipe.getIngredients()) {
                ingredientCounts.put(ingredient, ingredientCounts.getOrDefault(ingredient, 0) + 1);
            }
        }
        
        return ingredientCounts.entrySet().stream()
            .sorted(Map.Entry.<String, Integer>comparingByValue().reversed())
            .limit(limit)
            .map(Map.Entry::getKey)
            .collect(Collectors.toList());
    }
    
    private List<String> getTopTags(int limit) {
        // Get most frequently used tags
        Query query = new Query();
        query.limit(1000);  // Get a sample of recipes
        
        List<Recipe> recipes = mongoTemplate.find(query, Recipe.class);
        Map<String, Integer> tagCounts = new HashMap<>();
        
        for (Recipe recipe : recipes) {
            if (recipe.getTags() != null) {
                for (String tag : recipe.getTags()) {
                    tagCounts.put(tag, tagCounts.getOrDefault(tag, 0) + 1);
                }
            }
        }
        
        return tagCounts.entrySet().stream()
            .sorted(Map.Entry.<String, Integer>comparingByValue().reversed())
            .limit(limit)
            .map(Map.Entry::getKey)
            .collect(Collectors.toList());
    }
    
    private List<String> getPopularInterests(int limit) {
        // Get most popular user interests
        Query query = new Query();
        query.limit(1000);  // Get a sample of users
        
        List<User> users = mongoTemplate.find(query, User.class);
        Map<String, Integer> interestCounts = new HashMap<>();
        
        for (User user : users) {
            if (user.getInterests() != null) {
                for (String interest : user.getInterests()) {
                    interestCounts.put(interest, interestCounts.getOrDefault(interest, 0) + 1);
                }
            }
        }
        
        return interestCounts.entrySet().stream()
            .sorted(Map.Entry.<String, Integer>comparingByValue().reversed())
            .limit(limit)
            .map(Map.Entry::getKey)
            .collect(Collectors.toList());
    }
    
    private List<Recipe> findSimilarRecipes(Recipe recipe, int limit) {
        // Find similar recipes based on tags, ingredients, and cuisine type
        Criteria criteria = new Criteria();
        criteria.and("id").ne(recipe.getId());  // Exclude the current recipe
        
        List<Criteria> similarityCriteria = new ArrayList<>();
        
        // Similar by tags
        if (recipe.getTags() != null && !recipe.getTags().isEmpty()) {
            similarityCriteria.add(Criteria.where("tags").in(recipe.getTags()));
        }
        
        // Similar by cuisine type
        if (recipe.getCuisineType() != null) {
            similarityCriteria.add(Criteria.where("cuisineType").is(recipe.getCuisineType()));
        }
        
        // Similar by ingredients (at least 3 matching)
        if (recipe.getIngredients() != null && recipe.getIngredients().size() >= 3) {
            List<String> mainIngredients = recipe.getIngredients().subList(0, Math.min(5, recipe.getIngredients().size()));
            similarityCriteria.add(Criteria.where("ingredients").in(mainIngredients));
        }
        
        if (!similarityCriteria.isEmpty()) {
            criteria = criteria.orOperator(similarityCriteria.toArray(new Criteria[0]));
        }
        
        Query query = new Query(criteria);
        query.limit(limit);
        
        return mongoTemplate.find(query, Recipe.class);
    }
    
    private List<User> findSimilarUsers(User user, int limit) {
        // Find similar users based on expertise
        Criteria criteria = new Criteria();
        criteria.and("id").ne(user.getId());  // Exclude the current user
        
        List<Criteria> similarityCriteria = new ArrayList<>();
        
        // Similar by expertise level
        if (user.getCookingExpertise() != null) {
            similarityCriteria.add(Criteria.where("cookingExpertise").is(user.getCookingExpertise()));
        }
        
        if (!similarityCriteria.isEmpty()) {
            criteria = criteria.orOperator(similarityCriteria.toArray(new Criteria[0]));
        }
        
        Query query = new Query(criteria);
        query.limit(limit);
        
        return mongoTemplate.find(query, User.class);
    }
    
    private List<Group> findSimilarGroups(Group group, int limit) {
        // Implementation similar to findSimilarRecipes but for groups
        List<Group> similarGroups = new ArrayList<>();
        
        // Logic to find similar groups based on tags, category, etc.
        // This is a placeholder implementation
        
        return similarGroups.subList(0, Math.min(limit, similarGroups.size()));
    }
}
