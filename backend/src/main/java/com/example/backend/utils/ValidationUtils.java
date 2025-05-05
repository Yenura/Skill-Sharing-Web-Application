package com.example.backend.utils;

import com.example.backend.exception.LearningException;
import com.example.backend.exception.SearchException;
import com.example.backend.models.LearningMilestone;
import com.example.backend.models.SearchCriteria;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;
import java.util.regex.Pattern;

@Component
public class ValidationUtils {
    
    private static final Pattern SEARCH_TERM_PATTERN = Pattern.compile("^[\\w\\s\\-\\.,]+$");
    private static final int MIN_SEARCH_LENGTH = 2;
    private static final int MAX_SEARCH_LENGTH = 100;
    
    private static final int MAX_DAILY_MILESTONES = 5;
    private static final int MIN_MILESTONE_DESCRIPTION = 10;
    private static final int MAX_MILESTONE_DESCRIPTION = 500;

    public void validateSearchCriteria(SearchCriteria criteria) {
        if (criteria == null) {
            throw new SearchException.InvalidSearchCriteriaException("Search criteria cannot be null");
        }

        String query = criteria.getQuery();
        if (query == null || query.trim().isEmpty()) {
            throw new SearchException.InvalidSearchCriteriaException("Search query cannot be empty");
        }

        if (query.length() < MIN_SEARCH_LENGTH || query.length() > MAX_SEARCH_LENGTH) {
            throw new SearchException.InvalidSearchCriteriaException(
                "Search query must be between " + MIN_SEARCH_LENGTH + " and " + MAX_SEARCH_LENGTH + " characters"
            );
        }

        if (!SEARCH_TERM_PATTERN.matcher(query).matches()) {
            throw new SearchException.InvalidSearchCriteriaException(
                "Search query contains invalid characters"
            );
        }
    }

    public void validateMilestone(LearningMilestone milestone) {
        if (milestone == null) {
            throw new LearningException.InvalidMilestoneException("Milestone cannot be null");
        }

        if (milestone.getDescription() == null || 
            milestone.getDescription().length() < MIN_MILESTONE_DESCRIPTION || 
            milestone.getDescription().length() > MAX_MILESTONE_DESCRIPTION) {
            throw new LearningException.InvalidMilestoneException(
                "Milestone description must be between " + MIN_MILESTONE_DESCRIPTION + 
                " and " + MAX_MILESTONE_DESCRIPTION + " characters"
            );
        }

        if (milestone.getSkillType() == null || milestone.getSkillType().trim().isEmpty()) {
            throw new LearningException.InvalidMilestoneException("Skill type is required");
        }

        if (milestone.getSkillLevel() < 1 || milestone.getSkillLevel() > 10) {
            throw new LearningException.InvalidMilestoneException(
                "Skill level must be between 1 and 10"
            );
        }
    }

    public void validateDailyMilestoneLimit(String userId, List<LearningMilestone> todaysMilestones) {
        int count = (int) todaysMilestones.stream()
            .filter(m -> m.getAchievedAt().toLocalDate().equals(LocalDateTime.now().toLocalDate()))
            .count();

        if (count >= MAX_DAILY_MILESTONES) {
            throw new LearningException.InvalidMilestoneException(
                "Maximum daily milestone limit of " + MAX_DAILY_MILESTONES + " reached"
            );
        }
    }

    public void validateSkillProgression(int currentLevel, int newLevel) {
        if (newLevel > currentLevel + 1) {
            throw new LearningException.InvalidMilestoneException(
                "Cannot skip skill levels. Current level: " + currentLevel + ", attempted level: " + newLevel
            );
        }
    }

    public void validateMediaAssets(List<String> mediaUrls) {
        if (mediaUrls != null) {
            for (String url : mediaUrls) {
                if (!isValidMediaUrl(url)) {
                    throw new LearningException.InvalidMilestoneException(
                        "Invalid media URL format: " + url
                    );
                }
            }
        }
    }

    private boolean isValidMediaUrl(String url) {
        if (url == null || url.trim().isEmpty()) {
            return false;
        }
        
        try {
            return Pattern.compile(
                "^(https?://)?([\\w-]+\\.)+[\\w-]+(/[\\w-./?%&=]*)?$"
            ).matcher(url).matches();
        } catch (Exception e) {
            return false;
        }
    }

    public void validateSearchType(String type) {
        List<String> validTypes = List.of("recipe", "user", "community", "all");
        if (!validTypes.contains(type.toLowerCase())) {
            throw new SearchException.InvalidSearchCriteriaException(
                "Invalid search type. Valid types are: " + String.join(", ", validTypes)
            );
        }
    }

    public void validatePageParameters(int page, int size) {
        if (page < 0) {
            throw new SearchException.InvalidSearchCriteriaException("Page number cannot be negative");
        }
        if (size < 1 || size > 100) {
            throw new SearchException.InvalidSearchCriteriaException(
                "Page size must be between 1 and 100"
            );
        }
    }
}