package com.example.backend.services;

import com.example.backend.models.CookingChallenge;
import com.example.backend.models.CookingChallenge.ChallengeSubmission;
import com.example.backend.models.Notification;
import com.example.backend.models.User;
import com.example.backend.repositories.CookingChallengeRepository;
import com.example.backend.repositories.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CookingChallengeService {
    private final CookingChallengeRepository challengeRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private static final Logger logger = LoggerFactory.getLogger(CookingChallengeService.class);

    public CookingChallengeService(
            CookingChallengeRepository challengeRepository,
            UserRepository userRepository,
            NotificationService notificationService) {
        this.challengeRepository = challengeRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    // Create a new challenge
    public CookingChallenge createChallenge(CookingChallenge challenge) {
        challenge.setStatus("UPCOMING");
        
        if (challenge.getStartDate() == null) {
            challenge.setStartDate(LocalDateTime.now());
        }
        
        if (challenge.getEndDate() == null) {
            // Default to 7 days from start
            challenge.setEndDate(challenge.getStartDate().plusDays(7));
        }
        
        CookingChallenge savedChallenge = challengeRepository.save(challenge);
        
        // Notify group members about the new challenge
        if (challenge.getGroupId() != null && !challenge.getGroupId().isEmpty()) {
            notifyGroupAboutChallenge(savedChallenge);
        }
        
        return savedChallenge;
    }
    
    // Get a challenge by ID
    public Optional<CookingChallenge> getChallengeById(String id) {
        return challengeRepository.findById(id);
    }
    
    // Update a challenge
    public CookingChallenge updateChallenge(String id, CookingChallenge updatedChallenge) {
        Optional<CookingChallenge> existingChallenge = challengeRepository.findById(id);
        
        if (existingChallenge.isPresent()) {
            CookingChallenge challenge = existingChallenge.get();
            
            // Update fields but preserve submissions
            challenge.setTitle(updatedChallenge.getTitle());
            challenge.setDescription(updatedChallenge.getDescription());
            challenge.setStartDate(updatedChallenge.getStartDate());
            challenge.setEndDate(updatedChallenge.getEndDate());
            challenge.setDifficulty(updatedChallenge.getDifficulty());
            challenge.setIngredients(updatedChallenge.getIngredients());
            challenge.setRules(updatedChallenge.getRules());
            challenge.setCriteria(updatedChallenge.getCriteria());
            challenge.setImageUrl(updatedChallenge.getImageUrl());
            challenge.setTags(updatedChallenge.getTags());
            challenge.setFeatured(updatedChallenge.isFeatured());
            
            // Don't update status if it's already COMPLETED
            if (!challenge.getStatus().equals("COMPLETED")) {
                challenge.setStatus(updatedChallenge.getStatus());
            }
            
            return challengeRepository.save(challenge);
        } else {
            throw new IllegalArgumentException("Challenge not found with id: " + id);
        }
    }
    
    // Delete a challenge
    public void deleteChallenge(String id) {
        challengeRepository.deleteById(id);
    }
    
    // Get all challenges with pagination
    public Page<CookingChallenge> getAllChallenges(Pageable pageable) {
        return challengeRepository.findAll(pageable);
    }
    
    // Get challenges by status
    public Page<CookingChallenge> getChallengesByStatus(String status, Pageable pageable) {
        return challengeRepository.findByStatus(status, pageable);
    }
    
    // Get active challenges
    public List<CookingChallenge> getActiveChallenges() {
        return challengeRepository.findActiveChallenges(LocalDateTime.now());
    }
    
    // Get upcoming challenges
    public List<CookingChallenge> getUpcomingChallenges() {
        return challengeRepository.findUpcomingChallenges(LocalDateTime.now());
    }
    
    // Get completed challenges
    public List<CookingChallenge> getCompletedChallenges() {
        return challengeRepository.findCompletedChallenges();
    }
    
    // Get challenges by group
    public List<CookingChallenge> getChallengesByGroup(String groupId) {
        return challengeRepository.findByGroupId(groupId);
    }
    
    // Get challenges by user (created by)
    public List<CookingChallenge> getChallengesByCreator(String userId) {
        return challengeRepository.findByCreatedBy(userId);
    }
    
    // Get challenges by participant
    public List<CookingChallenge> getChallengesByParticipant(String userId) {
        return challengeRepository.findChallengesByParticipant(userId);
    }
    
    // Submit an entry to a challenge
    public CookingChallenge submitChallengeEntry(String challengeId, ChallengeSubmission submission) {
        Optional<CookingChallenge> optionalChallenge = challengeRepository.findById(challengeId);
        
        if (optionalChallenge.isPresent()) {
            CookingChallenge challenge = optionalChallenge.get();
            
            // Check if challenge is active
            if (!challenge.getStatus().equals("ACTIVE")) {
                throw new IllegalStateException("Challenge is not active");
            }
            
            // Check if user has already submitted
            boolean alreadySubmitted = challenge.getSubmissions().stream()
                    .anyMatch(s -> s.getUserId().equals(submission.getUserId()));
            
            if (alreadySubmitted) {
                throw new IllegalStateException("User has already submitted an entry");
            }
            
            // Generate submission ID
            submission.setId(UUID.randomUUID().toString());
            submission.setSubmittedAt(LocalDateTime.now());
            
            // Add submission to challenge
            challenge.getSubmissions().add(submission);
            challenge.setParticipantCount(challenge.getParticipantCount() + 1);
            
            // Save challenge
            CookingChallenge updatedChallenge = challengeRepository.save(challenge);
            
            // Notify challenge creator about new submission
            notifyAboutNewSubmission(challenge, submission);
            
            return updatedChallenge;
        } else {
            throw new IllegalArgumentException("Challenge not found with id: " + challengeId);
        }
    }
    
    // Vote for a submission
    public CookingChallenge voteForSubmission(String challengeId, String submissionId, String userId) {
        Optional<CookingChallenge> optionalChallenge = challengeRepository.findById(challengeId);
        
        if (optionalChallenge.isPresent()) {
            CookingChallenge challenge = optionalChallenge.get();
            
            // Find the submission
            Optional<ChallengeSubmission> optionalSubmission = challenge.getSubmissions().stream()
                    .filter(s -> s.getId().equals(submissionId))
                    .findFirst();
            
            if (optionalSubmission.isPresent()) {
                ChallengeSubmission submission = optionalSubmission.get();
                
                // Check if user has already voted
                if (submission.getVoterIds().contains(userId)) {
                    throw new IllegalStateException("User has already voted for this submission");
                }
                
                // Add vote
                submission.getVoterIds().add(userId);
                submission.setVotes(submission.getVotes() + 1);
                
                // Save challenge
                return challengeRepository.save(challenge);
            } else {
                throw new IllegalArgumentException("Submission not found");
            }
        } else {
            throw new IllegalArgumentException("Challenge not found with id: " + challengeId);
        }
    }
    
    // Rate a submission
    public CookingChallenge rateSubmission(String challengeId, String submissionId, String userId, 
                                          ChallengeSubmission.Rating rating) {
        Optional<CookingChallenge> optionalChallenge = challengeRepository.findById(challengeId);
        
        if (optionalChallenge.isPresent()) {
            CookingChallenge challenge = optionalChallenge.get();
            
            // Find the submission
            Optional<ChallengeSubmission> optionalSubmission = challenge.getSubmissions().stream()
                    .filter(s -> s.getId().equals(submissionId))
                    .findFirst();
            
            if (optionalSubmission.isPresent()) {
                ChallengeSubmission submission = optionalSubmission.get();
                
                // Check if user has already rated
                boolean alreadyRated = submission.getRatings().stream()
                        .anyMatch(r -> r.getUserId().equals(userId));
                
                if (alreadyRated) {
                    throw new IllegalStateException("User has already rated this submission");
                }
                
                // Set user info
                Optional<User> user = userRepository.findById(userId);
                if (user.isPresent()) {
                    rating.setUsername(user.get().getUsername());
                }
                
                rating.setUserId(userId);
                rating.setRatedAt(LocalDateTime.now());
                
                // Add rating
                submission.getRatings().add(rating);
                
                // Save challenge
                return challengeRepository.save(challenge);
            } else {
                throw new IllegalArgumentException("Submission not found");
            }
        } else {
            throw new IllegalArgumentException("Challenge not found with id: " + challengeId);
        }
    }
    
    // Update challenge status based on dates
    public void updateChallengeStatuses() {
        LocalDateTime now = LocalDateTime.now();
        
        // Find upcoming challenges that should be active
        List<CookingChallenge> upcomingChallenges = challengeRepository.findByStatus("UPCOMING", PageRequest.of(0, 1000)).getContent();
        for (CookingChallenge challenge : upcomingChallenges) {
            if (challenge.getStartDate().isBefore(now)) {
                challenge.setStatus("ACTIVE");
                challengeRepository.save(challenge);
                logger.info("Challenge {} status updated to ACTIVE", challenge.getId());
            }
        }
        
        // Find active challenges that should be completed
        List<CookingChallenge> activeChallenges = challengeRepository.findByStatus("ACTIVE", PageRequest.of(0, 1000)).getContent();
        for (CookingChallenge challenge : activeChallenges) {
            if (challenge.getEndDate().isBefore(now)) {
                challenge.setStatus("COMPLETED");
                challengeRepository.save(challenge);
                logger.info("Challenge {} status updated to COMPLETED", challenge.getId());
                
                // Notify participants about challenge completion
                notifyAboutChallengeCompletion(challenge);
            }
        }
    }
    
    // Get challenge winners
    public List<ChallengeSubmission> getChallengeWinners(String challengeId) {
        Optional<CookingChallenge> optionalChallenge = challengeRepository.findById(challengeId);
        
        if (optionalChallenge.isPresent()) {
            CookingChallenge challenge = optionalChallenge.get();
            
            // Check if challenge is completed
            if (!challenge.getStatus().equals("COMPLETED")) {
                throw new IllegalStateException("Challenge is not completed yet");
            }
            
            // Sort submissions by votes (descending)
            return challenge.getSubmissions().stream()
                    .sorted((s1, s2) -> Integer.compare(s2.getVotes(), s1.getVotes()))
                    .limit(3) // Top 3 winners
                    .collect(Collectors.toList());
        } else {
            throw new IllegalArgumentException("Challenge not found with id: " + challengeId);
        }
    }
    
    // Private helper methods
    
    private void notifyGroupAboutChallenge(CookingChallenge challenge) {
        // This would typically fetch group members and send notifications
        // For now, we'll log the action
        logger.info("Notifying group {} about new challenge {}", 
                challenge.getGroupId(), challenge.getId());
    }
    
    private void notifyAboutNewSubmission(CookingChallenge challenge, ChallengeSubmission submission) {
        // Notify challenge creator
        Optional<User> creator = userRepository.findById(challenge.getCreatedBy());
        if (creator.isPresent()) {
            Map<String, Object> data = Map.of(
                "challengeId", challenge.getId(),
                "challengeTitle", challenge.getTitle(),
                "submissionId", submission.getId(),
                "submitterId", submission.getUserId(),
                "submitterName", submission.getUsername()
            );
            
            // Create notification for challenge creator
            Notification notification = new Notification();
            notification.setUserId(challenge.getCreatedBy());
            notification.setType("CHALLENGE_SUBMISSION");
            notification.setMessage("New submission to your challenge: " + challenge.getTitle());
            notification.setData(data);
            notification.setCreatedAt(LocalDateTime.now());
            notification.setRead(false);
            
            // Save notification using notification service
            notificationService.createNotification(notification);
        }
    }
    
    private void notifyAboutChallengeCompletion(CookingChallenge challenge) {
        // Get all participants
        List<String> participantIds = challenge.getSubmissions().stream()
                .map(ChallengeSubmission::getUserId)
                .collect(Collectors.toList());
        
        // Notify each participant
        for (String userId : participantIds) {
            Map<String, Object> data = Map.of(
                "challengeId", challenge.getId(),
                "challengeTitle", challenge.getTitle()
            );
            
            // Create notification
            Notification notification = new Notification();
            notification.setUserId(userId);
            notification.setType("CHALLENGE_COMPLETED");
            notification.setMessage("Challenge completed: " + challenge.getTitle());
            notification.setData(data);
            notification.setCreatedAt(LocalDateTime.now());
            notification.setRead(false);
            
            // Save notification
            notificationService.createNotification(notification);
        }
    }
}
