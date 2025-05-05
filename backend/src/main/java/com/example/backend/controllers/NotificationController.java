package com.example.backend.controllers;

import com.example.backend.models.Notification;
import com.example.backend.services.NotificationService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "http://localhost:3000")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping
    public ResponseEntity<Page<Notification>> getUserNotifications(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        String userId = authentication.getName();
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ResponseEntity.ok(notificationService.getUserNotifications(userId, pageable));
    }

    @GetMapping("/unread")
    public ResponseEntity<List<Notification>> getUnreadNotifications(Authentication authentication) {
        String userId = authentication.getName();
        return ResponseEntity.ok(notificationService.getUnreadNotifications(userId));
    }

    @PostMapping("/{notificationId}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable String notificationId) {
        notificationService.markAsRead(notificationId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/read-all")
    public ResponseEntity<Void> markAllAsRead(Authentication authentication) {
        String userId = authentication.getName();
        notificationService.markAllAsRead(userId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/preferences")
    public ResponseEntity<Map<String, Boolean>> getNotificationPreferences(Authentication authentication) {
        // In a real implementation, this would fetch user-specific preferences
        return ResponseEntity.ok(Map.of(
            "recipe_likes", true,
            "recipe_comments", true,
            "follower_updates", true,
            "learning_milestones", true,
            "recommendations", true,
            "skill_updates", true,
            "trending_content", true,
            "comment_replies", true
        ));
    }

    @PutMapping("/preferences")
    public ResponseEntity<Void> updateNotificationPreferences(
            Authentication authentication,
            @RequestBody Map<String, Boolean> preferences) {
        // In a real implementation, this would update user-specific preferences
        // notificationService.updateUserPreferences(userId, preferences);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(Authentication authentication) {
        String userId = authentication.getName();
        long count = notificationService.getUnreadNotifications(userId).size();
        return ResponseEntity.ok(Map.of("count", count));
    }
    
    @GetMapping("/types")
    public ResponseEntity<List<String>> getNotificationTypes() {
        return ResponseEntity.ok(List.of(
            "RECIPE_LIKE", 
            "RECIPE_COMMENT", 
            "USER_FOLLOW", 
            "COMMENT_REPLY", 
            "LEARNING_MILESTONE", 
            "RECOMMENDATION", 
            "ACHIEVEMENT", 
            "SYSTEM"
        ));
    }
}
