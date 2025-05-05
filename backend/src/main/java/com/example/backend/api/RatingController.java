package com.example.backend.api;

import com.example.backend.models.Rating;
import com.example.backend.models.Recipe;
import com.example.backend.models.User;
import com.example.backend.repositories.RatingRepository;
import com.example.backend.repositories.RecipeRepository;
import com.example.backend.repositories.UserRepository;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/ratings")
public class RatingController {

    private final RatingRepository ratingRepository;
    private final RecipeRepository recipeRepository;
    private final UserRepository userRepository;

    public RatingController(RatingRepository ratingRepository,
                           RecipeRepository recipeRepository,
                           UserRepository userRepository) {
        this.ratingRepository = ratingRepository;
        this.recipeRepository = recipeRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<Rating>> getAllRatings() {
        List<Rating> ratings = ratingRepository.findAll();
        return new ResponseEntity<>(ratings, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Rating> getRatingById(@PathVariable String id) {
        Optional<Rating> rating = ratingRepository.findById(id);
        return rating.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/recipe/{recipeId}")
    public ResponseEntity<List<Rating>> getRatingsByRecipe(@PathVariable String recipeId) {
        List<Rating> ratings = ratingRepository.findByRecipeId(recipeId);
        return new ResponseEntity<>(ratings, HttpStatus.OK);
    }

    @GetMapping("/recipe/{recipeId}/summary")
    public ResponseEntity<Map<String, Object>> getRecipeRatingSummary(@PathVariable String recipeId) {
        List<Rating> ratings = ratingRepository.findByRecipeId(recipeId);
        
        if (ratings.isEmpty()) {
            Map<String, Object> emptySummary = new HashMap<>();
            emptySummary.put("averageRating", 0.0);
            emptySummary.put("totalRatings", 0);
            emptySummary.put("ratingDistribution", Map.of(
                "1", 0,
                "2", 0,
                "3", 0,
                "4", 0,
                "5", 0
            ));
            return new ResponseEntity<>(emptySummary, HttpStatus.OK);
        }
        
        double averageRating = ratings.stream()
                .mapToInt(Rating::getValue)
                .average()
                .orElse(0.0);
        
        Map<Integer, Long> distribution = ratings.stream()
                .collect(Collectors.groupingBy(Rating::getValue, Collectors.counting()));
        
        Map<String, Object> summary = new HashMap<>();
        summary.put("averageRating", averageRating);
        summary.put("totalRatings", ratings.size());
        
        Map<String, Integer> ratingDistribution = new HashMap<>();
        for (int i = 1; i <= 5; i++) {
            ratingDistribution.put(String.valueOf(i), distribution.getOrDefault(i, 0L).intValue());
        }
        summary.put("ratingDistribution", ratingDistribution);
        
        return new ResponseEntity<>(summary, HttpStatus.OK);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Rating>> getRatingsByUser(@PathVariable String userId) {
        List<Rating> ratings = ratingRepository.findByUserId(userId);
        return new ResponseEntity<>(ratings, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Rating> createRating(@RequestBody Map<String, Object> ratingData) {
        try {
            String recipeId = (String) ratingData.get("recipeId");
            String userId = (String) ratingData.get("userId");
            Integer value = (Integer) ratingData.get("rating");
            String comment = (String) ratingData.get("comment");
            
            if (value == null || value < 1 || value > 5) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
            
            Optional<Recipe> recipeOptional = recipeRepository.findById(recipeId);
            Optional<User> userOptional = userRepository.findById(userId);
            
            if (recipeOptional.isEmpty() || userOptional.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
            
            // Check if user has already rated this recipe
            Optional<Rating> existingRating = ratingRepository.findByRecipeIdAndUserId(recipeId, userId);
            
            if (existingRating.isPresent()) {
                // Update existing rating
                Rating rating = existingRating.get();
                rating.setValue(value);
                
                if (comment != null && !comment.trim().isEmpty()) {
                    rating.setComment(comment);
                }
                
                rating.setUpdatedAt(LocalDateTime.now());
                Rating updatedRating = ratingRepository.save(rating);
                return new ResponseEntity<>(updatedRating, HttpStatus.OK);
            } else {
                // Create new rating
                Rating rating = new Rating();
                rating.setRecipe(recipeOptional.get());
                rating.setUser(userOptional.get());
                rating.setValue(value);
                
                if (comment != null && !comment.trim().isEmpty()) {
                    rating.setComment(comment);
                }
                
                Rating savedRating = ratingRepository.save(rating);
                return new ResponseEntity<>(savedRating, HttpStatus.CREATED);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Rating> updateRating(@PathVariable String id, @RequestBody Map<String, Object> updates) {
        Optional<Rating> ratingOptional = ratingRepository.findById(id);
        
        if (ratingOptional.isPresent()) {
            Rating rating = ratingOptional.get();
            
            if (updates.containsKey("rating")) {
                Integer value = (Integer) updates.get("rating");
                if (value != null && value >= 1 && value <= 5) {
                    rating.setValue(value);
                }
            }
            
            if (updates.containsKey("comment")) {
                String comment = (String) updates.get("comment");
                if (comment != null) {
                    rating.setComment(comment);
                }
            }
            
            rating.setUpdatedAt(LocalDateTime.now());
            Rating updatedRating = ratingRepository.save(rating);
            return new ResponseEntity<>(updatedRating, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRating(@PathVariable String id) {
        if (ratingRepository.existsById(id)) {
            ratingRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
