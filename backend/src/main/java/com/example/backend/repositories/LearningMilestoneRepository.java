package com.example.backend.repositories;

import com.example.backend.models.LearningMilestone;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LearningMilestoneRepository extends MongoRepository<LearningMilestone, String> {
    List<LearningMilestone> findByUserId(String userId);
    List<LearningMilestone> findByUserIdOrderByAchievedAtDesc(String userId);
    List<LearningMilestone> findByUserIdAndIsPublicTrueOrderByAchievedAtDesc(String userId);
    List<LearningMilestone> findByUserIdAndSkillTypeOrderByAchievedAtDesc(String userId, String skillType);
    List<LearningMilestone> findByUserIdAndIsCompletedFalseOrderByTargetDateAsc(String userId);
    List<LearningMilestone> findByUserIdAndIsCompletedTrue(String userId);
    List<LearningMilestone> findByUserIdAndCategoryOrderByAchievedAtDesc(String userId, String category);
    long countByUserIdAndIsCompletedTrue(String userId);
    long countByUserIdAndSkillTypeAndIsCompletedTrue(String userId, String skillType);
}