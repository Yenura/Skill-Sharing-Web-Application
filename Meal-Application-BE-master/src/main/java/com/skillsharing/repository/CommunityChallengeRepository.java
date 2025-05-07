package com.skillsharing.repository;

import com.skillsharing.model.CommunityChallenge;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

public interface CommunityChallengeRepository extends MongoRepository<CommunityChallenge, String> {
    
    // Find challenges by community ID
    List<CommunityChallenge> findByCommunityId(String communityId);
    
    // Find challenges created by a specific user
    List<CommunityChallenge> findByCreatorId(String creatorId);
    
    // Find active challenges (current date is between start and end dates)
    @Query("{ 'communityId': ?0, 'startDate': { $lte: ?1 }, 'endDate': { $gte: ?1 } }")
    List<CommunityChallenge> findActiveChallenges(String communityId, LocalDateTime currentDate);
    
    // Find upcoming challenges (start date is in the future)
    @Query("{ 'communityId': ?0, 'startDate': { $gt: ?1 } }")
    List<CommunityChallenge> findUpcomingChallenges(String communityId, LocalDateTime currentDate);
    
    // Find completed challenges (end date is in the past)
    @Query("{ 'communityId': ?0, 'endDate': { $lt: ?1 } }")
    List<CommunityChallenge> findCompletedChallenges(String communityId, LocalDateTime currentDate);
    
    // Find challenges where a user is participating
    @Query("{ 'participants': ?0 }")
    List<CommunityChallenge> findByParticipantId(String userId);
    
    // Find challenges with submissions from a specific user
    @Query("{ 'submissions': ?0 }")
    List<CommunityChallenge> findBySubmissionId(String postId);
    
    // Search challenges by title containing the search term
    List<CommunityChallenge> findByTitleContainingIgnoreCase(String searchTerm);
    
    // Count number of participants in a challenge
    @Query(value = "{ '_id': ?0 }", count = true)
    long countParticipants(String challengeId);
}
