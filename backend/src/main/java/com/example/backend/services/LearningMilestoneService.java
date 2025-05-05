package com.example.backend.services;

import com.example.backend.models.LearningMilestone;
import com.example.backend.models.Recipe;
import com.example.backend.repositories.LearningMilestoneRepository;
import com.example.backend.repositories.RecipeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class LearningMilestoneService {
    
    @Autowired
    private LearningMilestoneRepository milestoneRepository;
    
    @Autowired
    private RecipeRepository recipeRepository;
    
    private static final Map<Integer, String> SKILL_TIERS = Map.of(
        0, "Beginner",
        100, "Novice Cook",
        300, "Home Chef",
        600, "Skilled Cook",
        1000, "Master Chef",
        2000, "Expert Chef",
        5000, "Culinary Master"
    );

    @Transactional
    public LearningMilestone createMilestone(LearningMilestone milestone) {
        milestone.setAchievedAt(LocalDateTime.now());
        
        // Calculate experience points based on milestone type and difficulty
        int baseXP = calculateBaseExperiencePoints(milestone);
        milestone.setExperiencePoints(baseXP);
        
        // Check and award badges
        String badge = determineEarnedBadge(milestone);
        if (badge != null) {
            milestone.setBadge(badge);
        }
        
        return milestoneRepository.save(milestone);
    }
    
    private int calculateBaseExperiencePoints(LearningMilestone milestone) {
        int basePoints = switch (milestone.getCategory()) {
            case "Technique" -> 50;
            case "Recipe" -> 30;
            case "Equipment" -> 20;
            default -> 10;
        };
        
        // Multiply by skill level
        return basePoints * milestone.getSkillLevel();
    }
    
    private String determineEarnedBadge(LearningMilestone milestone) {
        // Award badges based on achievements
        if (milestone.getSkillLevel() >= 5) {
            return milestone.getCategory() + " Master";
        } else if (milestone.getSkillLevel() >= 3) {
            return milestone.getCategory() + " Expert";
        }
        return null;
    }
    
    public List<LearningMilestone> getUserMilestones(String userId) {
        return milestoneRepository.findByUserIdOrderByAchievedAtDesc(userId);
    }
    
    public List<LearningMilestone> getUserPublicMilestones(String userId) {
        return milestoneRepository.findByUserIdAndIsPublicTrueOrderByAchievedAtDesc(userId);
    }
    
    public Map<String, Integer> getUserSkillLevels(String userId) {
        List<LearningMilestone> milestones = milestoneRepository.findByUserId(userId);
        Map<String, Integer> skillLevels = new HashMap<>();
        
        milestones.stream()
            .collect(Collectors.groupingBy(LearningMilestone::getSkillType))
            .forEach((skillType, typeMilestones) -> {
                int totalXP = typeMilestones.stream()
                    .mapToInt(LearningMilestone::getExperiencePoints)
                    .sum();
                skillLevels.put(skillType, calculateSkillLevel(totalXP));
            });
            
        return skillLevels;
    }
    
    private int calculateSkillLevel(int totalXP) {
        return (int) Math.floor(Math.sqrt(totalXP / 100.0));
    }
    
    public String calculateSkillTier(int totalXP) {
        return SKILL_TIERS.entrySet().stream()
            .filter(entry -> totalXP >= entry.getKey())
            .reduce((first, second) -> second)
            .map(Map.Entry::getValue)
            .orElse("Beginner");
    }
    
    @Transactional
    public void completeMilestone(String id) {
        LearningMilestone milestone = milestoneRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Milestone not found"));
            
        milestone.setCompleted(true);
        milestoneRepository.save(milestone);
    }
    
    public List<LearningMilestone> getPendingMilestones(String userId) {
        return milestoneRepository.findByUserIdAndIsCompletedFalseOrderByTargetDateAsc(userId);
    }
    
    @Transactional
    public void shareMilestone(String id, boolean isPublic) {
        LearningMilestone milestone = milestoneRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Milestone not found"));
            
        milestone.setPublic(isPublic);
        milestoneRepository.save(milestone);
    }
    
    public List<Recipe> getRecommendedRecipes(String userId) {
        // Get user's completed milestones to analyze skill level
        List<LearningMilestone> completedMilestones = milestoneRepository
            .findByUserIdAndIsCompletedTrue(userId);
            
        // Calculate current skill level
        int totalXP = completedMilestones.stream()
            .mapToInt(LearningMilestone::getExperiencePoints)
            .sum();
        int skillLevel = calculateSkillLevel(totalXP);
        
        // Get appropriate difficulty level based on skill
        String recommendedDifficulty = skillLevel <= 2 ? "Beginner" :
                                     skillLevel <= 4 ? "Intermediate" : "Advanced";
                                     
        // Find recipes matching the user's level
        return recipeRepository.findByDifficulty(recommendedDifficulty)
            .stream()
            .limit(5)
            .collect(Collectors.toList());
    }
    
    public void deleteMilestone(String id) {
        milestoneRepository.deleteById(id);
    }
    
    public List<LearningMilestone> getMilestonesBySkillType(String userId, String skillType) {
        return milestoneRepository.findByUserIdAndSkillTypeOrderByAchievedAtDesc(userId, skillType);
    }
}