package com.example.backend.api;

import com.example.backend.models.Community;
import com.example.backend.services.CommunityService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.backend.models.Comment;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/communities")
public class CommunityController {

    private final CommunityService communityService;

        public CommunityController(CommunityService communityService) {
        this.communityService = communityService;
    }

    @GetMapping
    public ResponseEntity<List<Community>> getAllCommunities() {
        List<Community> communities = communityService.getAllCommunities();
        return new ResponseEntity<>(communities, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Community> getCommunityById(@PathVariable String id) {
        Optional<Community> community = communityService.getCommunityById(id);
        return community.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<Community>> getCommunityByCategory(@PathVariable String category) {
        List<Community> communities = communityService.getCommunityByCategory(category);
        return new ResponseEntity<>(communities, HttpStatus.OK);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Community>> searchCommunities(@RequestParam String name) {
        List<Community> communities = communityService.searchCommunities(name);
        return new ResponseEntity<>(communities, HttpStatus.OK);
    }

    @GetMapping("/public")
    public ResponseEntity<List<Community>> getPublicCommunities() {
        List<Community> communities = communityService.getPublicCommunities();
        return new ResponseEntity<>(communities, HttpStatus.OK);
    }

    @GetMapping("/moderated/{userId}")
    public ResponseEntity<List<Community>> getUserModeratedCommunities(@PathVariable String userId) {
        List<Community> communities = communityService.getUserModeratedCommunities(userId);
        return new ResponseEntity<>(communities, HttpStatus.OK);
    }

    @GetMapping("/joined/{userId}")
    public ResponseEntity<List<Community>> getUserJoinedCommunities(@PathVariable String userId) {
        List<Community> communities = communityService.getUserJoinedCommunities(userId);
        return new ResponseEntity<>(communities, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Community> createCommunity(@RequestBody Community community, @RequestParam String userId) {
        try {
            Community newCommunity = communityService.createCommunity(community, userId);
            return new ResponseEntity<>(newCommunity, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Community> updateCommunity(@PathVariable String id, @RequestBody Community community) {
        try {
            Community updatedCommunity = communityService.updateCommunity(id, community);
            return new ResponseEntity<>(updatedCommunity, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCommunity(@PathVariable String id) {
        try {
            communityService.deleteCommunity(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/{communityId}/join")
    public ResponseEntity<Community> joinCommunity(@PathVariable String communityId, @RequestParam String userId) {
        try {
            Community community = communityService.joinCommunity(communityId, userId);
            return new ResponseEntity<>(community, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/{communityId}/leave")
    public ResponseEntity<Community> leaveCommunity(@PathVariable String communityId, @RequestParam String userId) {
        try {
            Community community = communityService.leaveCommunity(communityId, userId);
            return new ResponseEntity<>(community, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/{communityId}/moderators")
    public ResponseEntity<Community> addModerator(@PathVariable String communityId, @RequestParam String userId) {
        try {
            Community community = communityService.addModerator(communityId, userId);
            return new ResponseEntity<>(community, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/{communityId}/moderators/{userId}")
    public ResponseEntity<Community> removeModerator(@PathVariable String communityId, @PathVariable String userId) {
        try {
            Community community = communityService.removeModerator(communityId, userId);
            return new ResponseEntity<>(community, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
    
    @PostMapping("/{id}/report")
    public ResponseEntity<Void> reportCommunity(
            @PathVariable String id,
            @RequestBody Map<String, Object> reportData) {
        try {
            String userId = (String) reportData.get("userId");
            String reason = (String) reportData.get("reason");
            String description = (String) reportData.get("description");
            
            communityService.reportCommunity(id, userId, reason, description);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
    
    @PostMapping("/{id}/invite")
    public ResponseEntity<Void> inviteUserToCommunity(
            @PathVariable String id,
            @RequestBody Map<String, Object> inviteData) {
        try {
            String inviterId = (String) inviteData.get("inviterId");
            String email = (String) inviteData.get("email");
            String message = (String) inviteData.get("message");
            
            communityService.inviteUserToCommunity(id, inviterId, email, message);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
    
    @GetMapping("/{id}/comments")
    public ResponseEntity<List<Comment>> getCommunityComments(@PathVariable String id) {
        try {
            List<Comment> comments = communityService.getCommunityComments(id);
            return new ResponseEntity<>(comments, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
    
    @PostMapping("/{id}/comments")
    public ResponseEntity<Comment> createCommunityComment(
            @PathVariable String id,
            @RequestBody Map<String, Object> commentData) {
        try {
            String authorId = (String) commentData.get("authorId");
            String content = (String) commentData.get("content");
            Integer postId = (Integer) commentData.get("postId");
            
            Comment comment = communityService.createCommunityComment(id, authorId, content, postId);
            return new ResponseEntity<>(comment, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
}
