package com.example.backend.controllers;

import com.example.backend.models.LearningProgress;
import com.example.backend.repositories.LearningProgressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/learning-progress")
public class LearningProgressController {

    private final LearningProgressRepository learningProgressRepository;

    @Autowired
    public LearningProgressController(LearningProgressRepository learningProgressRepository) {
        this.learningProgressRepository = learningProgressRepository;
    }

    @PostMapping
    public ResponseEntity<LearningProgress> createLearningProgress(@RequestBody LearningProgress learningProgress) {
        learningProgress.setCreatedAt(LocalDateTime.now());
        learningProgress.setUpdatedAt(LocalDateTime.now());
        LearningProgress savedProgress = learningProgressRepository.save(learningProgress);
        return new ResponseEntity<>(savedProgress, HttpStatus.CREATED);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<LearningProgress>> getUserLearningProgress(@PathVariable String userId) {
        List<LearningProgress> progressList = learningProgressRepository.findByUserId(userId);
        return new ResponseEntity<>(progressList, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<LearningProgress> getLearningProgressById(@PathVariable String id) {
        Optional<LearningProgress> progress = learningProgressRepository.findById(id);
        return progress.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PutMapping("/{id}")
    public ResponseEntity<LearningProgress> updateLearningProgress(
            @PathVariable String id,
            @RequestBody LearningProgress updatedProgress) {
        return learningProgressRepository.findById(id)
                .map(existingProgress -> {
                    existingProgress.setTitle(updatedProgress.getTitle());
                    existingProgress.setDescription(updatedProgress.getDescription());
                    existingProgress.setCompletedMilestones(updatedProgress.getCompletedMilestones());
                    existingProgress.setCurrentMilestones(updatedProgress.getCurrentMilestones());
                    existingProgress.setUpcomingMilestones(updatedProgress.getUpcomingMilestones());
                    existingProgress.setStatus(updatedProgress.getStatus());
                    existingProgress.setResources(updatedProgress.getResources());
                    existingProgress.setProgressPercentage(updatedProgress.getProgressPercentage());
                    existingProgress.setTags(updatedProgress.getTags());
                    existingProgress.setUpdatedAt(LocalDateTime.now());
                    
                    LearningProgress savedProgress = learningProgressRepository.save(existingProgress);
                    return new ResponseEntity<>(savedProgress, HttpStatus.OK);
                })
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLearningProgress(@PathVariable String id) {
        if (learningProgressRepository.existsById(id)) {
            learningProgressRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/skill/{skillType}")
    public ResponseEntity<List<LearningProgress>> getLearningProgressBySkillType(
            @PathVariable String skillType,
            @RequestParam(required = false) String userId) {
        if (userId != null) {
            List<LearningProgress> progressList = learningProgressRepository.findByUserIdAndSkillType(userId, skillType);
            return new ResponseEntity<>(progressList, HttpStatus.OK);
        } else {
            List<LearningProgress> progressList = learningProgressRepository.findBySkillTypeAndPublic(skillType, true);
            return new ResponseEntity<>(progressList, HttpStatus.OK);
        }
    }
} 
