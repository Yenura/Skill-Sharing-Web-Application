package com.example.backend.repositories;

import com.example.backend.models.LearningPlan;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LearningPlanRepository extends MongoRepository<LearningPlan, String> {
    List<LearningPlan> findByUserId(String userId);
    List<LearningPlan> findByStatusAndPublic(String status, boolean isPublic);
    List<LearningPlan> findByUserIdAndStatus(String userId, String status);
    List<LearningPlan> findBySkillTypeAndPublic(String skillType, boolean isPublic);
    List<LearningPlan> findByTagsContaining(String tag);
    List<LearningPlan> findByTitleContainingIgnoreCase(String title);
    List<LearningPlan> findTop10ByTitleContainingIgnoreCase(String title);
} 
