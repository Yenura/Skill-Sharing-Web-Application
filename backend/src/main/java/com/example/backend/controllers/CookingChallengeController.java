package com.example.backend.controllers;

import com.example.backend.models.CookingChallenge;
import com.example.backend.models.CookingChallenge.ChallengeSubmission;
import com.example.backend.models.CookingChallenge.ChallengeSubmission.Rating;
import com.example.backend.services.CookingChallengeService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/challenges")
@CrossOrigin(origins = "http://localhost:3000")
public class CookingChallengeController {

    private final CookingChallengeService challengeService;

    public CookingChallengeController(CookingChallengeService challengeService) {
        this.challengeService = challengeService;
    }

    // Create a new challenge
    @PostMapping
    public ResponseEntity<CookingChallenge> createChallenge(
            @RequestBody CookingChallenge challenge,
            Authentication authentication) {
        challenge.setCreatedBy(authentication.getName());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(challengeService.createChallenge(challenge));
    }

    // Get all challenges with pagination
    @GetMapping
    public ResponseEntity<Page<CookingChallenge>> getAllChallenges(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "startDate") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {
        
        Sort.Direction sortDirection = direction.equalsIgnoreCase("asc") ? 
                Sort.Direction.ASC : Sort.Direction.DESC;
        
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));
        return ResponseEntity.ok(challengeService.getAllChallenges(pageable));
    }

    // Get a challenge by ID
    @GetMapping("/{id}")
    public ResponseEntity<CookingChallenge> getChallengeById(@PathVariable String id) {
        Optional<CookingChallenge> challenge = challengeService.getChallengeById(id);
        return challenge.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Update a challenge
    @PutMapping("/{id}")
    public ResponseEntity<CookingChallenge> updateChallenge(
            @PathVariable String id,
            @RequestBody CookingChallenge challenge,
            Authentication authentication) {
        
        Optional<CookingChallenge> existingChallenge = challengeService.getChallengeById(id);
        
        if (existingChallenge.isPresent()) {
            // Check if user is the creator
            if (!existingChallenge.get().getCreatedBy().equals(authentication.getName())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            
            return ResponseEntity.ok(challengeService.updateChallenge(id, challenge));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete a challenge
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteChallenge(
            @PathVariable String id,
            Authentication authentication) {
        
        Optional<CookingChallenge> challenge = challengeService.getChallengeById(id);
        
        if (challenge.isPresent()) {
            // Check if user is the creator
            if (!challenge.get().getCreatedBy().equals(authentication.getName())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            
            challengeService.deleteChallenge(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Get challenges by status
    @GetMapping("/status/{status}")
    public ResponseEntity<Page<CookingChallenge>> getChallengesByStatus(
            @PathVariable String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("startDate").descending());
        return ResponseEntity.ok(challengeService.getChallengesByStatus(status, pageable));
    }

    // Get active challenges
    @GetMapping("/active")
    public ResponseEntity<List<CookingChallenge>> getActiveChallenges() {
        return ResponseEntity.ok(challengeService.getActiveChallenges());
    }

    // Get upcoming challenges
    @GetMapping("/upcoming")
    public ResponseEntity<List<CookingChallenge>> getUpcomingChallenges() {
        return ResponseEntity.ok(challengeService.getUpcomingChallenges());
    }

    // Get completed challenges
    @GetMapping("/completed")
    public ResponseEntity<List<CookingChallenge>> getCompletedChallenges() {
        return ResponseEntity.ok(challengeService.getCompletedChallenges());
    }

    // Get challenges by group
    @GetMapping("/group/{groupId}")
    public ResponseEntity<List<CookingChallenge>> getChallengesByGroup(@PathVariable String groupId) {
        return ResponseEntity.ok(challengeService.getChallengesByGroup(groupId));
    }

    // Get challenges created by user
    @GetMapping("/created")
    public ResponseEntity<List<CookingChallenge>> getChallengesCreatedByUser(Authentication authentication) {
        return ResponseEntity.ok(challengeService.getChallengesByCreator(authentication.getName()));
    }

    // Get challenges participated in by user
    @GetMapping("/participated")
    public ResponseEntity<List<CookingChallenge>> getChallengesParticipatedIn(Authentication authentication) {
        return ResponseEntity.ok(challengeService.getChallengesByParticipant(authentication.getName()));
    }

    // Submit an entry to a challenge
    @PostMapping("/{challengeId}/submit")
    public ResponseEntity<CookingChallenge> submitChallengeEntry(
            @PathVariable String challengeId,
            @RequestBody ChallengeSubmission submission,
            Authentication authentication) {
        
        submission.setUserId(authentication.getName());
        
        try {
            return ResponseEntity.ok(challengeService.submitChallengeEntry(challengeId, submission));
        } catch (IllegalStateException | IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Vote for a submission
    @PostMapping("/{challengeId}/submissions/{submissionId}/vote")
    public ResponseEntity<CookingChallenge> voteForSubmission(
            @PathVariable String challengeId,
            @PathVariable String submissionId,
            Authentication authentication) {
        
        try {
            return ResponseEntity.ok(challengeService.voteForSubmission(
                    challengeId, submissionId, authentication.getName()));
        } catch (IllegalStateException | IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Rate a submission
    @PostMapping("/{challengeId}/submissions/{submissionId}/rate")
    public ResponseEntity<CookingChallenge> rateSubmission(
            @PathVariable String challengeId,
            @PathVariable String submissionId,
            @RequestBody Rating rating,
            Authentication authentication) {
        
        try {
            return ResponseEntity.ok(challengeService.rateSubmission(
                    challengeId, submissionId, authentication.getName(), rating));
        } catch (IllegalStateException | IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Get challenge winners
    @GetMapping("/{challengeId}/winners")
    public ResponseEntity<List<ChallengeSubmission>> getChallengeWinners(@PathVariable String challengeId) {
        try {
            return ResponseEntity.ok(challengeService.getChallengeWinners(challengeId));
        } catch (IllegalStateException | IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // Get challenge statistics
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getChallengeStats() {
        long activeCount = challengeService.getChallengesByStatus("ACTIVE", PageRequest.of(0, 1)).getTotalElements();
        long upcomingCount = challengeService.getChallengesByStatus("UPCOMING", PageRequest.of(0, 1)).getTotalElements();
        long completedCount = challengeService.getChallengesByStatus("COMPLETED", PageRequest.of(0, 1)).getTotalElements();
        
        return ResponseEntity.ok(Map.of(
            "active", activeCount,
            "upcoming", upcomingCount,
            "completed", completedCount,
            "total", activeCount + upcomingCount + completedCount
        ));
    }
}
