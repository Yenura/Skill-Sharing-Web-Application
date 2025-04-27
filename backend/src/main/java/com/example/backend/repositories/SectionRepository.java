package com.example.backend.repositories;

import com.example.backend.models.Section;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface SectionRepository extends MongoRepository<Section, String> {
    List<Section> findByLearningPlanId(String learningPlanId);
    List<Section> findByOrderIndexGreaterThanEqual(int orderIndex);
} 
