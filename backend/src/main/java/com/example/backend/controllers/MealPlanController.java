package com.example.backend.controllers;

import com.example.backend.models.MealPlan;
import com.example.backend.repositories.MealPlanRepository;
import com.example.backend.exception.ErrorDetails;
import com.example.backend.exception.ResourceNotFoundException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/meal-plans")
@CrossOrigin(origins = "http://localhost:3000")
public class MealPlanController {

    private final MealPlanRepository mealPlanRepository;

    @Autowired
    public MealPlanController(MealPlanRepository mealPlanRepository) {
        this.mealPlanRepository = mealPlanRepository;
    }

    @GetMapping
    public ResponseEntity<List<MealPlan>> getMealPlans() {
        try {
            List<MealPlan> mealPlans = mealPlanRepository.findAll();
            return ResponseEntity.ok(mealPlans);
        } catch (Exception ex) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{userId}")
    public ResponseEntity<?> getMealPlansByUserId(@PathVariable String userId) {
        try {
            List<MealPlan> mealPlans = mealPlanRepository.findByUserId(userId);
            if (mealPlans.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorDetails(new Date(), "No meal plans found for user: " + userId, null));
            }
            return ResponseEntity.ok(mealPlans);
        } catch (Exception ex) {
            return ResponseEntity.internalServerError()
                .body(new ErrorDetails(new Date(), "Error retrieving meal plans", ex.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> createMealPlan(@Valid @RequestBody MealPlan mealPlan) {
        try {
            MealPlan savedMealPlan = mealPlanRepository.save(mealPlan);
            return new ResponseEntity<>(savedMealPlan, HttpStatus.CREATED);
        } catch (Exception ex) {
            return ResponseEntity.internalServerError()
                .body(new ErrorDetails(new Date(), "Error creating meal plan", ex.getMessage()));
        }
    }

    @DeleteMapping("/{mealPlanId}")
    public ResponseEntity<?> deleteMealPlan(@PathVariable String mealPlanId) {
        try {
            if (!mealPlanRepository.existsById(mealPlanId)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorDetails(new Date(), "Meal plan not found with id: " + mealPlanId, null));
            }
            mealPlanRepository.deleteById(mealPlanId);
            return ResponseEntity.noContent().build();
        } catch (Exception ex) {
            return ResponseEntity.internalServerError()
                .body(new ErrorDetails(new Date(), "Error deleting meal plan", ex.getMessage()));
        }
    }

    @PutMapping("/{mealPlanId}")
    public ResponseEntity<?> updateMealPlan(
            @PathVariable String mealPlanId,
            @Valid @RequestBody MealPlan updatedMealPlan) {
        try {
            if (!mealPlanRepository.existsById(mealPlanId)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorDetails(new Date(), "Meal plan not found with id: " + mealPlanId, null));
            }
            
            MealPlan existingMealPlan = mealPlanRepository.findById(mealPlanId).get();
            existingMealPlan.setUserId(updatedMealPlan.getUserId());
            existingMealPlan.setPlanName(updatedMealPlan.getPlanName());
            existingMealPlan.setDescription(updatedMealPlan.getDescription());
            existingMealPlan.setGoal(updatedMealPlan.getGoal());
            existingMealPlan.setRoutines(updatedMealPlan.getRoutines());
            
            MealPlan savedMealPlan = mealPlanRepository.save(existingMealPlan);
            return ResponseEntity.ok(savedMealPlan);
        } catch (Exception ex) {
            return ResponseEntity.internalServerError()
                .body(new ErrorDetails(new Date(), "Error updating meal plan", ex.getMessage()));
        }
    }
}
