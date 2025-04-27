package com.example.backend.repositories;

import com.example.backend.models.LearningProgress;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LearningProgressRepository extends MongoRepository<LearningProgress, String> {
    List<LearningProgress> findByUserId(String userId);
    List<LearningProgress> findByUserIdAndSkillType(String userId, String skillType);
    List<LearningProgress> findByUserIdAndStatus(String userId, String status);
    List<LearningProgress> findBySkillTypeAndPublic(String skillType, boolean isPublic);
} 
