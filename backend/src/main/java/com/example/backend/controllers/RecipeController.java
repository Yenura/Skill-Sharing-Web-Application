package com.example.backend.controllers;

import com.example.backend.models.Recipe;
import com.example.backend.repositories.RecipeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;
import java.util.List;

@RestController
@RequestMapping("/api/recipes")
public class RecipeController {
    private final RecipeRepository recipeRepository;

    @Autowired
    public RecipeController(RecipeRepository recipeRepository) {
        this.recipeRepository = recipeRepository;
    }

    @GetMapping
    public ResponseEntity<List<Recipe>> getRecipes() {
        List<Recipe> recipes = recipeRepository.findAll();
        return new ResponseEntity<>(recipes, HttpStatus.OK);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Recipe>> getRecipesByUserId(@PathVariable String userId) {
        List<Recipe> recipes = recipeRepository.findByAuthorId(userId);
        return new ResponseEntity<>(recipes, HttpStatus.OK);
    }

    @GetMapping("/cuisine/{cuisineType}")
    public ResponseEntity<List<Recipe>> getRecipesByCuisineType(@PathVariable String cuisineType) {
        List<Recipe> recipes = recipeRepository.findByCuisineType(cuisineType);
        return new ResponseEntity<>(recipes, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Recipe> createRecipe(@RequestBody Recipe recipe) {
        Recipe savedRecipe = recipeRepository.save(recipe);
        return new ResponseEntity<>(savedRecipe, HttpStatus.CREATED);
    }

    @DeleteMapping("/{recipeId}")
    public ResponseEntity<Void> deleteRecipe(@PathVariable String recipeId) {
        recipeRepository.deleteById(recipeId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PutMapping("/{recipeId}")
    public ResponseEntity<Recipe> updateRecipe(@PathVariable String recipeId, @RequestBody Recipe updatedRecipe) {
        Optional<Recipe> optionalRecipe = recipeRepository.findById(recipeId);
        if (optionalRecipe.isPresent()) {
            Recipe existingRecipe = optionalRecipe.get();
            if (updatedRecipe.getMediaUrl() != null) {
                existingRecipe.setMediaUrl(updatedRecipe.getMediaUrl());
            }
            if (updatedRecipe.getDescription() != null) {
                existingRecipe.setDescription(updatedRecipe.getDescription());
            }
            Recipe savedRecipe = recipeRepository.save(existingRecipe);
            return new ResponseEntity<>(savedRecipe, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
} 
