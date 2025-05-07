package com.skillsharing.repository;

import com.skillsharing.model.LearningPlan;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface LearningPlanRepository extends MongoRepository<LearningPlan, String> {
    List<LearningPlan> findByUserId(String userId);
    // Find all plans for a user ordered by creation (assuming ID reflects order)
    List<LearningPlan> findByUserIdOrderByIdDesc(String userId);

    // Search plans by title (case-insensitive)
    List<LearningPlan> findByUserIdAndTitleContainingIgnoreCase(String userId, String title);

    // Count total plans for a user
    long countByUserId(String userId);

    // Find plans that include a specific resource title
    @Query("{ 'userId': ?0, 'resources.title': { $regex: ?1, $options: 'i' } }")
    List<LearningPlan> findByUserIdAndResourceTitleLike(String userId, String resourceTitle);

    // Find plans that have weeks with a specific status
    @Query("{ 'userId': ?0, 'weeks.status': ?1 }")
    List<LearningPlan> findByUserIdAndWeekStatus(String userId, String status);

    // Get most recent N plans for dashboard
    List<LearningPlan> findTop5ByUserIdOrderByIdDesc(String userId);
    boolean existsByUserIdAndSourcePlanId(String id, String planId);
}
