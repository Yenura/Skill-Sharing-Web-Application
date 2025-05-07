package com.skillsharing.controller;

import com.skillsharing.dto.CommunityDTO;
import com.skillsharing.model.Community;
import com.skillsharing.service.CommunityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/communities")
@CrossOrigin(origins = "*", maxAge = 3600)
public class CommunityController {

    @Autowired
    private CommunityService communityService;

    // Create a new community
    @PostMapping
    public ResponseEntity<?> createCommunity(@RequestBody Community community, Authentication authentication) {
        String userId = authentication.getName();
        CommunityDTO createdCommunity = communityService.createCommunity(community, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdCommunity);
    }

    // Get community by ID
    @GetMapping("/{communityId}")
    public ResponseEntity<?> getCommunityById(@PathVariable String communityId, Authentication authentication) {
        String userId = authentication != null ? authentication.getName() : null;
        CommunityDTO community = communityService.getCommunityById(communityId, userId);
        
        if (community != null) {
            return ResponseEntity.ok(community);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Community not found");
        }
    }

    // Get all communities
    @GetMapping
    public ResponseEntity<?> getAllCommunities(Authentication authentication) {
        String userId = authentication != null ? authentication.getName() : null;
        List<CommunityDTO> communities = communityService.getAllCommunities(userId);
        return ResponseEntity.ok(communities);
    }

    // Get communities by category
    @GetMapping("/category/{category}")
    public ResponseEntity<?> getCommunitiesByCategory(@PathVariable String category, Authentication authentication) {
        String userId = authentication != null ? authentication.getName() : null;
        List<CommunityDTO> communities = communityService.getCommunitiesByCategory(category, userId);
        return ResponseEntity.ok(communities);
    }

    // Get communities where user is a member
    @GetMapping("/user")
    public ResponseEntity<?> getUserCommunities(Authentication authentication) {
        String userId = authentication.getName();
        List<CommunityDTO> communities = communityService.getUserCommunities(userId);
        return ResponseEntity.ok(communities);
    }

    // Join a community
    @PostMapping("/{communityId}/join")
    public ResponseEntity<?> joinCommunity(@PathVariable String communityId, Authentication authentication) {
        String userId = authentication.getName();
        CommunityDTO community = communityService.joinCommunity(communityId, userId);
        
        if (community != null) {
            return ResponseEntity.ok(community);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Community not found");
        }
    }

    // Leave a community
    @PostMapping("/{communityId}/leave")
    public ResponseEntity<?> leaveCommunity(@PathVariable String communityId, Authentication authentication) {
        String userId = authentication.getName();
        boolean success = communityService.leaveCommunity(communityId, userId);
        
        if (success) {
            return ResponseEntity.ok().body(Map.of("message", "Successfully left the community"));
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Cannot leave community");
        }
    }

    // Add a moderator to a community
    @PostMapping("/{communityId}/moderators/{userId}")
    public ResponseEntity<?> addModerator(@PathVariable String communityId, @PathVariable String userId, 
                                         Authentication authentication) {
        String currentUserId = authentication.getName();
        boolean success = communityService.addModerator(communityId, userId, currentUserId);
        
        if (success) {
            return ResponseEntity.ok().body(Map.of("message", "Successfully added moderator"));
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Cannot add moderator");
        }
    }

    // Remove a moderator from a community
    @DeleteMapping("/{communityId}/moderators/{userId}")
    public ResponseEntity<?> removeModerator(@PathVariable String communityId, @PathVariable String userId, 
                                            Authentication authentication) {
        String currentUserId = authentication.getName();
        boolean success = communityService.removeModerator(communityId, userId, currentUserId);
        
        if (success) {
            return ResponseEntity.ok().body(Map.of("message", "Successfully removed moderator"));
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Cannot remove moderator");
        }
    }

    // Update community details
    @PutMapping("/{communityId}")
    public ResponseEntity<?> updateCommunity(@PathVariable String communityId, @RequestBody Community updatedCommunity, 
                                            Authentication authentication) {
        String currentUserId = authentication.getName();
        CommunityDTO community = communityService.updateCommunity(communityId, updatedCommunity, currentUserId);
        
        if (community != null) {
            return ResponseEntity.ok(community);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Cannot update community");
        }
    }

    // Delete a community
    @DeleteMapping("/{communityId}")
    public ResponseEntity<?> deleteCommunity(@PathVariable String communityId, Authentication authentication) {
        String currentUserId = authentication.getName();
        boolean success = communityService.deleteCommunity(communityId, currentUserId);
        
        if (success) {
            return ResponseEntity.ok().body(Map.of("message", "Successfully deleted community"));
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Cannot delete community");
        }
    }

    // Search communities
    @GetMapping("/search")
    public ResponseEntity<?> searchCommunities(@RequestParam String query, Authentication authentication) {
        String userId = authentication != null ? authentication.getName() : null;
        List<CommunityDTO> communities = communityService.searchCommunities(query, userId);
        return ResponseEntity.ok(communities);
    }
}
