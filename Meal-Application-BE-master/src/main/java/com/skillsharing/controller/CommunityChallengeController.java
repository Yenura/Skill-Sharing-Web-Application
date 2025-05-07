package com.skillsharing.controller;

import com.skillsharing.dto.CommunityChallengeDTO;
import com.skillsharing.model.CommunityChallenge;
import com.skillsharing.service.CommunityChallengeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/challenges")
@CrossOrigin(origins = "*", maxAge = 3600)
public class CommunityChallengeController {

    @Autowired
    private CommunityChallengeService challengeService;

    // Create a new challenge
    @PostMapping
    public ResponseEntity<?> createChallenge(@RequestBody CommunityChallenge challenge, Authentication authentication) {
        String userId = authentication.getName();
        CommunityChallengeDTO createdChallenge = challengeService.createChallenge(challenge, userId);
        
        if (createdChallenge != null) {
            return ResponseEntity.status(HttpStatus.CREATED).body(createdChallenge);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Cannot create challenge");
        }
    }

    // Get challenge by ID
    @GetMapping("/{challengeId}")
    public ResponseEntity<?> getChallengeById(@PathVariable String challengeId, Authentication authentication) {
        String userId = authentication != null ? authentication.getName() : null;
        CommunityChallengeDTO challenge = challengeService.getChallengeById(challengeId, userId);
        
        if (challenge != null) {
            return ResponseEntity.ok(challenge);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Challenge not found");
        }
    }

    // Get all challenges for a community
    @GetMapping("/community/{communityId}")
    public ResponseEntity<?> getChallengesByCommunity(@PathVariable String communityId, Authentication authentication) {
        String userId = authentication != null ? authentication.getName() : null;
        List<CommunityChallengeDTO> challenges = challengeService.getChallengesByCommunity(communityId, userId);
        return ResponseEntity.ok(challenges);
    }

    // Get active challenges for a community
    @GetMapping("/community/{communityId}/active")
    public ResponseEntity<?> getActiveChallenges(@PathVariable String communityId, Authentication authentication) {
        String userId = authentication != null ? authentication.getName() : null;
        List<CommunityChallengeDTO> challenges = challengeService.getActiveChallenges(communityId, userId);
        return ResponseEntity.ok(challenges);
    }

    // Get upcoming challenges for a community
    @GetMapping("/community/{communityId}/upcoming")
    public ResponseEntity<?> getUpcomingChallenges(@PathVariable String communityId, Authentication authentication) {
        String userId = authentication != null ? authentication.getName() : null;
        List<CommunityChallengeDTO> challenges = challengeService.getUpcomingChallenges(communityId, userId);
        return ResponseEntity.ok(challenges);
    }

    // Get completed challenges for a community
    @GetMapping("/community/{communityId}/completed")
    public ResponseEntity<?> getCompletedChallenges(@PathVariable String communityId, Authentication authentication) {
        String userId = authentication != null ? authentication.getName() : null;
        List<CommunityChallengeDTO> challenges = challengeService.getCompletedChallenges(communityId, userId);
        return ResponseEntity.ok(challenges);
    }

    // Join a challenge
    @PostMapping("/{challengeId}/join")
    public ResponseEntity<?> joinChallenge(@PathVariable String challengeId, Authentication authentication) {
        String userId = authentication.getName();
        CommunityChallengeDTO challenge = challengeService.joinChallenge(challengeId, userId);
        
        if (challenge != null) {
            return ResponseEntity.ok(challenge);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Cannot join challenge");
        }
    }

    // Leave a challenge
    @PostMapping("/{challengeId}/leave")
    public ResponseEntity<?> leaveChallenge(@PathVariable String challengeId, Authentication authentication) {
        String userId = authentication.getName();
        boolean success = challengeService.leaveChallenge(challengeId, userId);
        
        if (success) {
            return ResponseEntity.ok().body(Map.of("message", "Successfully left the challenge"));
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Cannot leave challenge");
        }
    }

    // Add a submission to a challenge
    @PostMapping("/{challengeId}/submissions/{postId}")
    public ResponseEntity<?> addSubmission(@PathVariable String challengeId, @PathVariable String postId) {
        boolean success = challengeService.addSubmission(challengeId, postId);
        
        if (success) {
            return ResponseEntity.ok().body(Map.of("message", "Successfully added submission"));
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Cannot add submission");
        }
    }

    // Update challenge details
    @PutMapping("/{challengeId}")
    public ResponseEntity<?> updateChallenge(@PathVariable String challengeId, 
                                           @RequestBody CommunityChallenge updatedChallenge, 
                                           Authentication authentication) {
        String userId = authentication.getName();
        CommunityChallengeDTO challenge = challengeService.updateChallenge(challengeId, updatedChallenge, userId);
        
        if (challenge != null) {
            return ResponseEntity.ok(challenge);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Cannot update challenge");
        }
    }

    // Delete a challenge
    @DeleteMapping("/{challengeId}")
    public ResponseEntity<?> deleteChallenge(@PathVariable String challengeId, Authentication authentication) {
        String userId = authentication.getName();
        boolean success = challengeService.deleteChallenge(challengeId, userId);
        
        if (success) {
            return ResponseEntity.ok().body(Map.of("message", "Successfully deleted challenge"));
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Cannot delete challenge");
        }
    }

    // Get challenges where user is participating
    @GetMapping("/user")
    public ResponseEntity<?> getUserChallenges(Authentication authentication) {
        String userId = authentication.getName();
        List<CommunityChallengeDTO> challenges = challengeService.getUserChallenges(userId);
        return ResponseEntity.ok(challenges);
    }
}
