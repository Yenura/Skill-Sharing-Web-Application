package com.example.backend.controllers;

import com.example.backend.dto.LearningProgressDTO;
import com.example.backend.models.LearningMilestone;
import com.example.backend.models.Recipe;
import com.example.backend.services.LearningMilestoneService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/learning")
@CrossOrigin(origins = "http://localhost:3000")
public class LearningMilestoneController {

    @Autowired
    private LearningMilestoneService milestoneService;

    @PostMapping("/milestones")
    public ResponseEntity<LearningMilestone> createMilestone(@RequestBody LearningMilestone milestone) {
        try {
            LearningMilestone savedMilestone = milestoneService.createMilestone(milestone);
            return new ResponseEntity<>(savedMilestone, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/progress/{userId}")
    public ResponseEntity<LearningProgressDTO> getUserProgress(@PathVariable String userId) {
        try {
            // Get skill levels
            Map<String, Integer> skillLevels = milestoneService.getUserSkillLevels(userId);
            
            // Calculate total XP and get tier
            int totalXP = skillLevels.values().stream().mapToInt(Integer::intValue).sum() * 100;
            String currentTier = milestoneService.calculateSkillTier(totalXP);
            
            // Get recent milestones
            List<LearningMilestone> recentMilestones = milestoneService.getUserMilestones(userId);
            
            // Create progress DTO
            LearningProgressDTO progressDTO = new LearningProgressDTO();
            progressDTO.setSkillLevels(skillLevels);
            progressDTO.setCurrentTier(currentTier);
            progressDTO.setTotalExperiencePoints(totalXP);
            progressDTO.setRecentMilestones(recentMilestones);
            
            // Set completion statistics
            int completed = (int) recentMilestones.stream().filter(LearningMilestone::isCompleted).count();
            int pending = (int) recentMilestones.stream().filter(m -> !m.isCompleted()).count();
            progressDTO.setCompletedMilestones(completed);
            progressDTO.setPendingMilestones(pending);
            progressDTO.setCompletionRate(completed > 0 ? (double) completed / (completed + pending) : 0.0);
            
            return ResponseEntity.ok(progressDTO);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/milestones/user/{userId}")
    public ResponseEntity<List<LearningMilestone>> getUserMilestones(@PathVariable String userId) {
        List<LearningMilestone> milestones = milestoneService.getUserMilestones(userId);
        return ResponseEntity.ok(milestones);
    }

    @GetMapping("/milestones/public/{userId}")
    public ResponseEntity<List<LearningMilestone>> getUserPublicMilestones(@PathVariable String userId) {
        List<LearningMilestone> milestones = milestoneService.getUserPublicMilestones(userId);
        return ResponseEntity.ok(milestones);
    }

    @GetMapping("/milestones/skill/{userId}/{skillType}")
    public ResponseEntity<List<LearningMilestone>> getMilestonesBySkill(
            @PathVariable String userId,
            @PathVariable String skillType) {
        List<LearningMilestone> milestones = milestoneService.getMilestonesBySkillType(userId, skillType);
        return ResponseEntity.ok(milestones);
    }

    @PutMapping("/milestones/{id}/complete")
    public ResponseEntity<Void> completeMilestone(@PathVariable String id) {
        try {
            milestoneService.completeMilestone(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/skills/{userId}")
    public ResponseEntity<Map<String, Integer>> getSkillLevels(@PathVariable String userId) {
        Map<String, Integer> skillLevels = milestoneService.getUserSkillLevels(userId);
        return ResponseEntity.ok(skillLevels);
    }

    @GetMapping("/milestones/pending/{userId}")
    public ResponseEntity<List<LearningMilestone>> getPendingMilestones(@PathVariable String userId) {
        List<LearningMilestone> pendingMilestones = milestoneService.getPendingMilestones(userId);
        return ResponseEntity.ok(pendingMilestones);
    }

    @PutMapping("/milestones/{id}/share")
    public ResponseEntity<Void> shareMilestone(
            @PathVariable String id,
            @RequestParam boolean isPublic) {
        try {
            milestoneService.shareMilestone(id, isPublic);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/milestones/{id}")
    public ResponseEntity<Void> deleteMilestone(@PathVariable String id) {
        try {
            milestoneService.deleteMilestone(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/recommendations/{userId}")
    public ResponseEntity<List<Recipe>> getRecommendedRecipes(@PathVariable String userId) {
        List<Recipe> recommendations = milestoneService.getRecommendedRecipes(userId);
        return ResponseEntity.ok(recommendations);
    }

    @GetMapping("/skill-tier")
    public ResponseEntity<String> getSkillTier(@RequestParam int totalXP) {
        String tier = milestoneService.calculateSkillTier(totalXP);
        return ResponseEntity.ok(tier);
    }
}