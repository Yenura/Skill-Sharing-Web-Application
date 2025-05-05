package com.example.backend.controllers;

import com.example.backend.models.Recipe;
import com.example.backend.models.User;
import com.example.backend.services.NotificationService;
import com.example.backend.services.RecipeService;
import com.example.backend.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/recipes")
public class RecipeController {
    private final RecipeService recipeService;
    private final UserService userService;
    private final NotificationService notificationService;

    @Autowired
    public RecipeController(RecipeService recipeService, UserService userService, NotificationService notificationService) {
        this.recipeService = recipeService;
        this.userService = userService;
        this.notificationService = notificationService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Recipe> getRecipeById(@PathVariable String id) {
        try {
            Recipe recipe = recipeService.getRecipe(id);
            if (recipe == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(recipe);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<Recipe>> getRecipes() {
        try {
            List<Recipe> recipes = recipeService.getRecipes(null, null, null, null);
            return ResponseEntity.ok(recipes);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Recipe>> getRecipesByUserId(@PathVariable String userId) {
        List<Recipe> recipes = recipeService.getUserRecipes(userId);
        return new ResponseEntity<>(recipes, HttpStatus.OK);
    }

    @GetMapping("/cuisine/{cuisineType}")
    public ResponseEntity<List<Recipe>> getRecipesByCuisineType(@PathVariable String cuisineType) {
        List<Recipe> recipes = recipeService.getRecipes(cuisineType, null, null, null);
        return new ResponseEntity<>(recipes, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Recipe> createRecipe(@RequestBody Recipe recipe, @RequestParam String userId) {
        try {
            if (userId == null || userService.findById(userId) == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            recipe.setAuthorId(userId);
            recipe.setCreatedAt(LocalDateTime.now());
            recipe.setUpdatedAt(LocalDateTime.now());
            Recipe savedRecipe = recipeService.createRecipe(recipe);
            return new ResponseEntity<>(savedRecipe, HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Recipe> updateRecipe(
        @PathVariable String id, 
        @RequestBody Recipe updatedRecipe,
        @RequestParam String userId
    ) {
        try {
            Recipe existingRecipe = recipeService.getRecipe(id);
            if (existingRecipe == null) {
                return ResponseEntity.notFound().build();
            }

            // Check if user is the author
            if (!existingRecipe.getAuthorId().equals(userId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            // Update all fields from the frontend model
            existingRecipe.setTitle(updatedRecipe.getTitle());
            existingRecipe.setDescription(updatedRecipe.getDescription());
            existingRecipe.setIngredients(updatedRecipe.getIngredients());
            existingRecipe.setInstructions(updatedRecipe.getInstructions());
            existingRecipe.setImageUrl(updatedRecipe.getImageUrl());
            existingRecipe.setCookingTime(updatedRecipe.getCookingTime());
            existingRecipe.setServings(updatedRecipe.getServings());
            existingRecipe.setCuisineType(updatedRecipe.getCuisineType());
            existingRecipe.setDifficulty(updatedRecipe.getDifficulty());
            existingRecipe.setTags(updatedRecipe.getTags());
            
            // Handle multiple media assets
            if (updatedRecipe.getMediaAssets() != null && !updatedRecipe.getMediaAssets().isEmpty()) {
                existingRecipe.setMediaAssets(updatedRecipe.getMediaAssets());
            }
            
            existingRecipe.setUpdatedAt(LocalDateTime.now());
            
            Recipe saved = recipeService.updateRecipe(id, existingRecipe);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRecipe(
        @PathVariable String id,
        @RequestParam String userId
    ) {
        try {
            Recipe recipe = recipeService.getRecipe(id);
            if (recipe == null) {
                return ResponseEntity.notFound().build();
            }

            // Check if user is the author
            if (!recipe.getAuthorId().equals(userId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            recipeService.deleteRecipe(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<Recipe> likeRecipe(
        @PathVariable String id,
        @RequestParam String userId
    ) {
        try {
            User user = userService.findById(userId);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            Recipe recipe = recipeService.getRecipe(id);
            if (recipe == null) {
                return ResponseEntity.notFound().build();
            }
            
            recipe.setLikesCount(recipe.getLikesCount() + 1);
            Recipe saved = recipeService.updateRecipe(id, recipe);
            
            // Send notification to recipe author
            notificationService.notifyRecipeLiked(recipe, user);
            
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/{id}/like")
    public ResponseEntity<Recipe> unlikeRecipe(
        @PathVariable String id,
        @RequestParam String userId
    ) {
        try {
            if (userId == null || userService.findById(userId) == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            Recipe recipe = recipeService.getRecipe(id);
            if (recipe == null) {
                return ResponseEntity.notFound().build();
            }
            
            recipe.setLikesCount(Math.max(0, recipe.getLikesCount() - 1));
            Recipe saved = recipeService.updateRecipe(id, recipe);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/{id}/bookmark")
    public ResponseEntity<Recipe> bookmarkRecipe(
        @PathVariable String id,
        @RequestParam String userId
    ) {
        try {
            if (userId == null || userService.findById(userId) == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            Recipe recipe = recipeService.getRecipe(id);
            if (recipe == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(recipe);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/{id}/bookmark")
    public ResponseEntity<Recipe> removeBookmark(
        @PathVariable String id,
        @RequestParam String userId
    ) {
        try {
            if (userId == null || userService.findById(userId) == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            Recipe recipe = recipeService.getRecipe(id);
            if (recipe == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(recipe);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
