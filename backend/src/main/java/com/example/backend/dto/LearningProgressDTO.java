package com.example.backend.dto;

import com.example.backend.models.LearningMilestone;
import java.util.List;
import java.util.Map;

public class LearningProgressDTO {
    private Map<String, Integer> skillLevels;
    private String currentTier;
    private int totalExperiencePoints;
    private List<LearningMilestone> recentMilestones;
    private Map<String, Integer> categoryProgress;
    private List<String> earnedBadges;
    private Map<String, Double> skillGrowthRate;
    private List<String> recommendedSkills;
    private int completedMilestones;
    private int pendingMilestones;
    private double completionRate;

    // Default constructor
    public LearningProgressDTO() {}

    // Getters and Setters
    public Map<String, Integer> getSkillLevels() {
        return skillLevels;
    }

    public void setSkillLevels(Map<String, Integer> skillLevels) {
        this.skillLevels = skillLevels;
    }

    public String getCurrentTier() {
        return currentTier;
    }

    public void setCurrentTier(String currentTier) {
        this.currentTier = currentTier;
    }

    public int getTotalExperiencePoints() {
        return totalExperiencePoints;
    }

    public void setTotalExperiencePoints(int totalExperiencePoints) {
        this.totalExperiencePoints = totalExperiencePoints;
    }

    public List<LearningMilestone> getRecentMilestones() {
        return recentMilestones;
    }

    public void setRecentMilestones(List<LearningMilestone> recentMilestones) {
        this.recentMilestones = recentMilestones;
    }

    public Map<String, Integer> getCategoryProgress() {
        return categoryProgress;
    }

    public void setCategoryProgress(Map<String, Integer> categoryProgress) {
        this.categoryProgress = categoryProgress;
    }

    public List<String> getEarnedBadges() {
        return earnedBadges;
    }

    public void setEarnedBadges(List<String> earnedBadges) {
        this.earnedBadges = earnedBadges;
    }

    public Map<String, Double> getSkillGrowthRate() {
        return skillGrowthRate;
    }

    public void setSkillGrowthRate(Map<String, Double> skillGrowthRate) {
        this.skillGrowthRate = skillGrowthRate;
    }

    public List<String> getRecommendedSkills() {
        return recommendedSkills;
    }

    public void setRecommendedSkills(List<String> recommendedSkills) {
        this.recommendedSkills = recommendedSkills;
    }

    public int getCompletedMilestones() {
        return completedMilestones;
    }

    public void setCompletedMilestones(int completedMilestones) {
        this.completedMilestones = completedMilestones;
    }

    public int getPendingMilestones() {
        return pendingMilestones;
    }

    public void setPendingMilestones(int pendingMilestones) {
        this.pendingMilestones = pendingMilestones;
    }

    public double getCompletionRate() {
        return completionRate;
    }

    public void setCompletionRate(double completionRate) {
        this.completionRate = completionRate;
    }
}