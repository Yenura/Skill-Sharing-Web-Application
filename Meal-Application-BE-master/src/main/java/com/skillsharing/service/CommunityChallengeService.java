package com.skillsharing.service;

import com.skillsharing.dto.CommunityChallengeDTO;
import com.skillsharing.model.Community;
import com.skillsharing.model.CommunityChallenge;
import com.skillsharing.model.User;
import com.skillsharing.repository.CommunityChallengeRepository;
import com.skillsharing.repository.CommunityRepository;
import com.skillsharing.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CommunityChallengeService {

    @Autowired
    private CommunityChallengeRepository challengeRepository;
    
    @Autowired
    private CommunityRepository communityRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    // Create a new challenge
    public CommunityChallengeDTO createChallenge(CommunityChallenge challenge, String userId) {
        // Verify that the user is a moderator of the community
        Optional<Community> communityOpt = communityRepository.findById(challenge.getCommunityId());
        
        if (communityOpt.isPresent()) {
            Community community = communityOpt.get();
            
            if (community.isModerator(userId)) {
                challenge.setCreatorId(userId);
                challenge.setCreatedAt(LocalDateTime.now());
                
                CommunityChallenge savedChallenge = challengeRepository.save(challenge);
                CommunityChallengeDTO dto = new CommunityChallengeDTO(savedChallenge);
                
                // Set additional fields
                Optional<User> creator = userRepository.findById(userId);
                creator.ifPresent(user -> dto.setCreatorName(user.getFullName()));
                
                dto.setCommunityName(community.getName());
                
                return dto;
            }
        }
        
        return null;
    }
    
    // Get challenge by ID
    public CommunityChallengeDTO getChallengeById(String challengeId, String currentUserId) {
        Optional<CommunityChallenge> challengeOpt = challengeRepository.findById(challengeId);
        
        if (challengeOpt.isPresent()) {
            CommunityChallenge challenge = challengeOpt.get();
            CommunityChallengeDTO dto = new CommunityChallengeDTO(challenge);
            
            // Set creator name
            Optional<User> creator = userRepository.findById(challenge.getCreatorId());
            creator.ifPresent(user -> dto.setCreatorName(user.getFullName()));
            
            // Set community name
            Optional<Community> community = communityRepository.findById(challenge.getCommunityId());
            community.ifPresent(c -> dto.setCommunityName(c.getName()));
            
            // Set participation status for current user
            if (currentUserId != null) {
                dto.setParticipant(challenge.getParticipants().contains(currentUserId));
            }
            
            return dto;
        }
        
        return null;
    }
    
    // Get all challenges for a community
    public List<CommunityChallengeDTO> getChallengesByCommunity(String communityId, String currentUserId) {
        List<CommunityChallenge> challenges = challengeRepository.findByCommunityId(communityId);
        
        Optional<Community> communityOpt = communityRepository.findById(communityId);
        String communityName = communityOpt.map(Community::getName).orElse("");
        
        return challenges.stream()
                .map(challenge -> {
                    CommunityChallengeDTO dto = new CommunityChallengeDTO(challenge);
                    
                    // Set creator name
                    Optional<User> creator = userRepository.findById(challenge.getCreatorId());
                    creator.ifPresent(user -> dto.setCreatorName(user.getFullName()));
                    
                    dto.setCommunityName(communityName);
                    
                    // Set participation status for current user
                    if (currentUserId != null) {
                        dto.setParticipant(challenge.getParticipants().contains(currentUserId));
                    }
                    
                    return dto;
                })
                .collect(Collectors.toList());
    }
    
    // Get active challenges for a community
    public List<CommunityChallengeDTO> getActiveChallenges(String communityId, String currentUserId) {
        List<CommunityChallenge> challenges = challengeRepository.findActiveChallenges(
                communityId, LocalDateTime.now());
        
        Optional<Community> communityOpt = communityRepository.findById(communityId);
        String communityName = communityOpt.map(Community::getName).orElse("");
        
        return challenges.stream()
                .map(challenge -> {
                    CommunityChallengeDTO dto = new CommunityChallengeDTO(challenge);
                    
                    // Set creator name
                    Optional<User> creator = userRepository.findById(challenge.getCreatorId());
                    creator.ifPresent(user -> dto.setCreatorName(user.getFullName()));
                    
                    dto.setCommunityName(communityName);
                    
                    // Set participation status for current user
                    if (currentUserId != null) {
                        dto.setParticipant(challenge.getParticipants().contains(currentUserId));
                    }
                    
                    return dto;
                })
                .collect(Collectors.toList());
    }
    
    // Get upcoming challenges for a community
    public List<CommunityChallengeDTO> getUpcomingChallenges(String communityId, String currentUserId) {
        List<CommunityChallenge> challenges = challengeRepository.findUpcomingChallenges(
                communityId, LocalDateTime.now());
        
        Optional<Community> communityOpt = communityRepository.findById(communityId);
        String communityName = communityOpt.map(Community::getName).orElse("");
        
        return challenges.stream()
                .map(challenge -> {
                    CommunityChallengeDTO dto = new CommunityChallengeDTO(challenge);
                    
                    // Set creator name
                    Optional<User> creator = userRepository.findById(challenge.getCreatorId());
                    creator.ifPresent(user -> dto.setCreatorName(user.getFullName()));
                    
                    dto.setCommunityName(communityName);
                    
                    // Set participation status for current user
                    if (currentUserId != null) {
                        dto.setParticipant(challenge.getParticipants().contains(currentUserId));
                    }
                    
                    return dto;
                })
                .collect(Collectors.toList());
    }
    
    // Get completed challenges for a community
    public List<CommunityChallengeDTO> getCompletedChallenges(String communityId, String currentUserId) {
        List<CommunityChallenge> challenges = challengeRepository.findCompletedChallenges(
                communityId, LocalDateTime.now());
        
        Optional<Community> communityOpt = communityRepository.findById(communityId);
        String communityName = communityOpt.map(Community::getName).orElse("");
        
        return challenges.stream()
                .map(challenge -> {
                    CommunityChallengeDTO dto = new CommunityChallengeDTO(challenge);
                    
                    // Set creator name
                    Optional<User> creator = userRepository.findById(challenge.getCreatorId());
                    creator.ifPresent(user -> dto.setCreatorName(user.getFullName()));
                    
                    dto.setCommunityName(communityName);
                    
                    // Set participation status for current user
                    if (currentUserId != null) {
                        dto.setParticipant(challenge.getParticipants().contains(currentUserId));
                    }
                    
                    return dto;
                })
                .collect(Collectors.toList());
    }
    
    // Join a challenge
    public CommunityChallengeDTO joinChallenge(String challengeId, String userId) {
        Optional<CommunityChallenge> challengeOpt = challengeRepository.findById(challengeId);
        
        if (challengeOpt.isPresent()) {
            CommunityChallenge challenge = challengeOpt.get();
            
            // Check if the user is a member of the community
            Optional<Community> communityOpt = communityRepository.findById(challenge.getCommunityId());
            
            if (communityOpt.isPresent() && communityOpt.get().isMember(userId)) {
                challenge.addParticipant(userId);
                CommunityChallenge savedChallenge = challengeRepository.save(challenge);
                
                CommunityChallengeDTO dto = new CommunityChallengeDTO(savedChallenge);
                
                // Set creator name
                Optional<User> creator = userRepository.findById(challenge.getCreatorId());
                creator.ifPresent(user -> dto.setCreatorName(user.getFullName()));
                
                // Set community name
                communityOpt.ifPresent(c -> dto.setCommunityName(c.getName()));
                
                // Set participation status
                dto.setParticipant(true);
                
                return dto;
            }
        }
        
        return null;
    }
    
    // Leave a challenge
    public boolean leaveChallenge(String challengeId, String userId) {
        Optional<CommunityChallenge> challengeOpt = challengeRepository.findById(challengeId);
        
        if (challengeOpt.isPresent()) {
            CommunityChallenge challenge = challengeOpt.get();
            
            // Cannot leave a challenge if you've already submitted
            if (challenge.getParticipants().contains(userId)) {
                challenge.removeParticipant(userId);
                challengeRepository.save(challenge);
                return true;
            }
        }
        
        return false;
    }
    
    // Add a submission to a challenge
    public boolean addSubmission(String challengeId, String postId) {
        Optional<CommunityChallenge> challengeOpt = challengeRepository.findById(challengeId);
        
        if (challengeOpt.isPresent()) {
            CommunityChallenge challenge = challengeOpt.get();
            
            // Can only add submissions to active challenges
            if (challenge.isActive()) {
                challenge.addSubmission(postId);
                challengeRepository.save(challenge);
                return true;
            }
        }
        
        return false;
    }
    
    // Update challenge details
    public CommunityChallengeDTO updateChallenge(String challengeId, CommunityChallenge updatedChallenge, String currentUserId) {
        Optional<CommunityChallenge> challengeOpt = challengeRepository.findById(challengeId);
        
        if (challengeOpt.isPresent()) {
            CommunityChallenge challenge = challengeOpt.get();
            
            // Check if the user is a moderator of the community
            Optional<Community> communityOpt = communityRepository.findById(challenge.getCommunityId());
            
            if (communityOpt.isPresent() && 
                (challenge.getCreatorId().equals(currentUserId) || communityOpt.get().isModerator(currentUserId))) {
                
                // Update fields
                challenge.setTitle(updatedChallenge.getTitle());
                challenge.setDescription(updatedChallenge.getDescription());
                challenge.setStartDate(updatedChallenge.getStartDate());
                challenge.setEndDate(updatedChallenge.getEndDate());
                
                CommunityChallenge savedChallenge = challengeRepository.save(challenge);
                CommunityChallengeDTO dto = new CommunityChallengeDTO(savedChallenge);
                
                // Set creator name
                Optional<User> creator = userRepository.findById(challenge.getCreatorId());
                creator.ifPresent(user -> dto.setCreatorName(user.getFullName()));
                
                // Set community name
                communityOpt.ifPresent(c -> dto.setCommunityName(c.getName()));
                
                // Set participation status
                if (currentUserId != null) {
                    dto.setParticipant(challenge.getParticipants().contains(currentUserId));
                }
                
                return dto;
            }
        }
        
        return null;
    }
    
    // Delete a challenge
    public boolean deleteChallenge(String challengeId, String currentUserId) {
        Optional<CommunityChallenge> challengeOpt = challengeRepository.findById(challengeId);
        
        if (challengeOpt.isPresent()) {
            CommunityChallenge challenge = challengeOpt.get();
            
            // Check if the user is a moderator of the community
            Optional<Community> communityOpt = communityRepository.findById(challenge.getCommunityId());
            
            if (communityOpt.isPresent() && 
                (challenge.getCreatorId().equals(currentUserId) || communityOpt.get().isModerator(currentUserId))) {
                
                challengeRepository.delete(challenge);
                return true;
            }
        }
        
        return false;
    }
    
    // Get challenges where user is participating
    public List<CommunityChallengeDTO> getUserChallenges(String userId) {
        List<CommunityChallenge> challenges = challengeRepository.findByParticipantId(userId);
        
        return challenges.stream()
                .map(challenge -> {
                    CommunityChallengeDTO dto = new CommunityChallengeDTO(challenge);
                    
                    // Set creator name
                    Optional<User> creator = userRepository.findById(challenge.getCreatorId());
                    creator.ifPresent(user -> dto.setCreatorName(user.getFullName()));
                    
                    // Set community name
                    Optional<Community> community = communityRepository.findById(challenge.getCommunityId());
                    community.ifPresent(c -> dto.setCommunityName(c.getName()));
                    
                    // Set participation status
                    dto.setParticipant(true);
                    
                    return dto;
                })
                .collect(Collectors.toList());
    }
}
