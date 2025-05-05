package com.example.backend.repositories;

import com.example.backend.models.Community;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommunityRepository extends MongoRepository<Community, String> {
    List<Community> findByCategory(String category);
    List<Community> findByNameContainingIgnoreCase(String name);
    List<Community> findByIsPrivate(boolean isPrivate);
    List<Community> findByModeratorsId(String userId);
    List<Community> findByMembersId(String userId);
}
