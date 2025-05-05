package com.example.backend.api;

import com.example.backend.models.GroupPost;
import com.example.backend.repositories.GroupPostRepository;
import com.example.backend.services.FeedService;
import com.example.backend.services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/feed")
public class FeedController {

    private final FeedService feedService;
    private final UserService userService;
    private final GroupPostRepository postRepository;

    public FeedController(FeedService feedService, UserService userService, GroupPostRepository postRepository) {
        this.feedService = feedService;
        this.userService = userService;
        this.postRepository = postRepository;
    }

    @GetMapping
    public ResponseEntity<List<GroupPost>> getFeed(
            @RequestParam(defaultValue = "all") String type,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        if (userDetails == null) {
            return ResponseEntity.ok(feedService.getPublicFeed());
        }

        String userId = userService.getUserIdByUsername(userDetails.getUsername());
        
        if ("following".equals(type)) {
            return ResponseEntity.ok(feedService.getFollowingFeed(userId));
        } else {
            return ResponseEntity.ok(feedService.getPersonalizedFeed(userId));
        }
    }

    @PostMapping("/posts/{postId}/like")
    public ResponseEntity<Void> likePost(
            @PathVariable String postId,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        String userId = userService.getUserIdByUsername(userDetails.getUsername());
        feedService.likePost(postId, userId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/posts/{postId}/like")
    public ResponseEntity<Void> unlikePost(
            @PathVariable String postId,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        String userId = userService.getUserIdByUsername(userDetails.getUsername());
        feedService.unlikePost(postId, userId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/save")
    public ResponseEntity<String> savePost(@RequestParam String postId, @RequestParam String userId) {
        try {
            GroupPost post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
            feedService.savePost(userId, post);
            return ResponseEntity.ok("Post saved successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error saving post: " + e.getMessage());
        }
    }

    @PostMapping("/unsave")
    public ResponseEntity<String> unsavePost(@RequestParam String postId, @RequestParam String userId) {
        try {
            GroupPost post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
            feedService.unsavePost(userId, post);
            return ResponseEntity.ok("Post unsaved successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error unsaving post: " + e.getMessage());
        }
    }
} 