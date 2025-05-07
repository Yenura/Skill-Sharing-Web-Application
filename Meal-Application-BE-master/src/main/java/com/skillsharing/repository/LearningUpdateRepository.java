package com.skillsharing.repository;

import com.skillsharing.model.LearningUpdate;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import java.time.LocalDateTime;
import java.util.List;

public interface LearningUpdateRepository extends MongoRepository<LearningUpdate, String> {
    // Find all updates for a user ordered by completion date (most recent first)
    List<LearningUpdate> findByUserIdOrderByCompletedAtDesc(String userId);
    
    // Find updates by category (TUTORIAL, COURSE, PROJECT)
    List<LearningUpdate> findByUserIdAndCategoryOrderByCompletedAtDesc(String userId, String category);
    
    // Find updates by difficulty level
    List<LearningUpdate> findByUserIdAndDifficultyOrderByCompletedAtDesc(String userId, String difficulty);
    
    // Find updates completed within a date range
    List<LearningUpdate> findByUserIdAndCompletedAtBetweenOrderByCompletedAtDesc(
        String userId, LocalDateTime startDate, LocalDateTime endDate);
    
    // Find updates that include a specific skill
    @Query("{ 'userId': ?0, 'skillsLearned': { $in: [?1] } }")
    List<LearningUpdate> findByUserIdAndSkill(String userId, String skill);
    
    // Count updates by category
    long countByUserIdAndCategory(String userId, String category);
    
    // Get total hours spent on learning meal plan
    @Query(value = "{ 'userId': ?0 }", 
           fields = "{ 'hoursSpent': 1 }")
    List<LearningUpdate> findHoursSpentByUserId(String userId);
    
    // Find most recent updates (for dashboard feed)
    List<LearningUpdate> findTop10ByUserIdInOrderByCompletedAtDesc(List<String> userIds);
    
    // Find updates by resource name (for search)
    List<LearningUpdate> findByUserIdAndResourceNameContainingIgnoreCaseOrderByCompletedAtDesc(
        String userId, String resourceName);
}
