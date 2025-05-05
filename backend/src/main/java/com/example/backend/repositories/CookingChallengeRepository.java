package com.example.backend.repositories;

import com.example.backend.models.CookingChallenge;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CookingChallengeRepository extends MongoRepository<CookingChallenge, String> {
    
    // Find challenges by group
    List<CookingChallenge> findByGroupId(String groupId);
    
    // Find challenges by creator
    List<CookingChallenge> findByCreatedBy(String userId);
    
    // Find active challenges
    @Query("{'status': 'ACTIVE', 'endDate': {$gt: ?0}}")
    List<CookingChallenge> findActiveChallenges(LocalDateTime now);
    
    // Find upcoming challenges
    @Query("{'status': 'UPCOMING', 'startDate': {$gt: ?0}}")
    List<CookingChallenge> findUpcomingChallenges(LocalDateTime now);
    
    // Find completed challenges
    @Query("{'status': 'COMPLETED'}")
    List<CookingChallenge> findCompletedChallenges();
    
    // Find featured challenges
    List<CookingChallenge> findByFeaturedTrue();
    
    // Find challenges by tag
    List<CookingChallenge> findByTagsContaining(String tag);
    
    // Find challenges by difficulty
    List<CookingChallenge> findByDifficulty(String difficulty);
    
    // Find challenges with pagination
    Page<CookingChallenge> findAll(Pageable pageable);
    
    // Find challenges by status with pagination
    Page<CookingChallenge> findByStatus(String status, Pageable pageable);
    
    // Find challenges by participant (user has submitted)
    @Query("{'submissions.userId': ?0}")
    List<CookingChallenge> findChallengesByParticipant(String userId);
    
    // Count active challenges
    long countByStatus(String status);
}
