package com.skillsharing.repository;

import com.skillsharing.model.Community;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;
import java.util.Optional;

public interface CommunityRepository extends MongoRepository<Community, String> {
    
    // Find community by name (case-insensitive)
    Optional<Community> findByNameIgnoreCase(String name);
    
    // Find communities by category
    List<Community> findByCategory(String category);
    
    // Find communities where user is a member
    @Query("{ 'members': ?0 }")
    List<Community> findByMemberId(String userId);
    
    // Find communities where user is a moderator
    @Query("{ 'moderators': ?0 }")
    List<Community> findByModeratorId(String userId);
    
    // Find communities created by a specific user
    List<Community> findByCreatorId(String creatorId);
    
    // Find public communities (not private)
    List<Community> findByIsPrivate(boolean isPrivate);
    
    // Search communities by name containing the search term
    List<Community> findByNameContainingIgnoreCase(String searchTerm);
    
    // Search communities by description containing the search term
    List<Community> findByDescriptionContainingIgnoreCase(String searchTerm);
    
    // Find communities by category containing the search term
    List<Community> findByCategoryContainingIgnoreCase(String searchTerm);
    
    // Count number of members in a community
    @Query(value = "{ '_id': ?0 }", count = true)
    long countMembers(String communityId);
}
