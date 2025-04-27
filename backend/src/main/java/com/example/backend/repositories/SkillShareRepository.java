package com.example.backend.repositories;

import com.example.backend.models.SkillShare;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SkillShareRepository extends MongoRepository<SkillShare, String> {
    List<SkillShare> findByUserId(String userId);
}
