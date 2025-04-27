package com.example.backend.controllers;

import com.example.backend.models.LearningPlan;
import com.example.backend.models.LearningModule;
import com.example.backend.repositories.LearningPlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/learning-plans")
public class LearningPlanController {

    private final LearningPlanRepository learningPlanRepository;

    @Autowired
    public LearningPlanController(LearningPlanRepository learningPlanRepository) {
        this.learningPlanRepository = learningPlanRepository;
    }

    @PostMapping
    public ResponseEntity<LearningPlan> createLearningPlan(@RequestBody LearningPlan learningPlan) {
        learningPlan.setCreatedAt(LocalDateTime.now());
        learningPlan.setUpdatedAt(LocalDateTime.now());
        LearningPlan savedPlan = learningPlanRepository.save(learningPlan);
        return new ResponseEntity<>(savedPlan, HttpStatus.CREATED);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<LearningPlan>> getUserLearningPlans(@PathVariable String userId) {
        List<LearningPlan> plans = learningPlanRepository.findByUserId(userId);
        return new ResponseEntity<>(plans, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<LearningPlan> getLearningPlanById(@PathVariable String id) {
        Optional<LearningPlan> plan = learningPlanRepository.findById(id);
        return plan.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PutMapping("/{id}")
    public ResponseEntity<LearningPlan> updateLearningPlan(
            @PathVariable String id,
            @RequestBody LearningPlan updatedPlan) {
        return learningPlanRepository.findById(id)
                .map(existingPlan -> {
                    existingPlan.setTitle(updatedPlan.getTitle());
                    existingPlan.setDescription(updatedPlan.getDescription());
                    existingPlan.setModules(updatedPlan.getModules());
                    existingPlan.setStatus(updatedPlan.getStatus());
                    existingPlan.setPublic(updatedPlan.isPublic());
                    existingPlan.setTags(updatedPlan.getTags());
                    existingPlan.setUpdatedAt(LocalDateTime.now());
                    existingPlan.setTotalModules(updatedPlan.getModules().size());
                    existingPlan.setCompletedModules((int) updatedPlan.getModules().stream()
                            .filter(module -> "completed".equals(module.getStatus()))
                            .count());
                    
                    LearningPlan savedPlan = learningPlanRepository.save(existingPlan);
                    return new ResponseEntity<>(savedPlan, HttpStatus.OK);
                })
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLearningPlan(@PathVariable String id) {
        if (learningPlanRepository.existsById(id)) {
            learningPlanRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/public")
    public ResponseEntity<List<LearningPlan>> getPublicLearningPlans() {
        List<LearningPlan> plans = learningPlanRepository.findByStatusAndPublic("active", true);
        return new ResponseEntity<>(plans, HttpStatus.OK);
    }

    @GetMapping("/skill/{skillType}")
    public ResponseEntity<List<LearningPlan>> getLearningPlansBySkillType(
            @PathVariable String skillType,
            @RequestParam(required = false) String userId) {
        if (userId != null) {
            List<LearningPlan> plans = learningPlanRepository.findByUserIdAndStatus(userId, "active");
            return new ResponseEntity<>(plans, HttpStatus.OK);
        } else {
            List<LearningPlan> plans = learningPlanRepository.findBySkillTypeAndPublic(skillType, true);
            return new ResponseEntity<>(plans, HttpStatus.OK);
        }
    }

    @GetMapping("/tag/{tag}")
    public ResponseEntity<List<LearningPlan>> getLearningPlansByTag(@PathVariable String tag) {
        List<LearningPlan> plans = learningPlanRepository.findByTagsContaining(tag);
        return new ResponseEntity<>(plans, HttpStatus.OK);
    }
} 
