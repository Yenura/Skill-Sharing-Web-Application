package com.example.backend.controllers;

import com.example.backend.models.NotificationPreference;
import com.example.backend.services.NotificationPreferenceService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/notification-preferences")
@CrossOrigin(origins = "http://localhost:3000")
public class NotificationPreferenceController {

    private final NotificationPreferenceService preferenceService;

    public NotificationPreferenceController(NotificationPreferenceService preferenceService) {
        this.preferenceService = preferenceService;
    }

    /**
     * Get the current user's notification preferences
     */
    @GetMapping
    public ResponseEntity<NotificationPreference> getUserPreferences(Authentication authentication) {
        String userId = authentication.getName();
        return ResponseEntity.ok(preferenceService.getUserPreferences(userId));
    }

    /**
     * Update notification type preferences (enable/disable specific notification types)
     */
    @PutMapping("/types")
    public ResponseEntity<NotificationPreference> updateTypePreferences(
            Authentication authentication,
            @RequestBody Map<String, Boolean> preferences) {
        
        String userId = authentication.getName();
        NotificationPreference updatedPrefs = preferenceService.updateTypePreferences(userId, preferences);
        return ResponseEntity.ok(updatedPrefs);
    }

    /**
     * Update notification channel preferences (how notifications are delivered)
     */
    @PutMapping("/channels")
    public ResponseEntity<NotificationPreference> updateChannelPreferences(
            Authentication authentication,
            @RequestBody Map<String, String> channelPreferences) {
        
        String userId = authentication.getName();
        NotificationPreference updatedPrefs = preferenceService.updateChannelPreferences(userId, channelPreferences);
        return ResponseEntity.ok(updatedPrefs);
    }

    /**
     * Update global notification settings
     */
    @PutMapping("/settings")
    public ResponseEntity<NotificationPreference> updateGlobalSettings(
            Authentication authentication,
            @RequestParam(required = false) Boolean emailEnabled,
            @RequestParam(required = false) Boolean pushEnabled,
            @RequestParam(required = false) Boolean inAppEnabled,
            @RequestParam(required = false) String emailFrequency) {
        
        String userId = authentication.getName();
        NotificationPreference updatedPrefs = preferenceService.updateGlobalSettings(
                userId, emailEnabled, pushEnabled, inAppEnabled, emailFrequency);
        return ResponseEntity.ok(updatedPrefs);
    }

    /**
     * Reset notification preferences to defaults
     */
    @PostMapping("/reset")
    public ResponseEntity<NotificationPreference> resetPreferences(Authentication authentication) {
        String userId = authentication.getName();
        
        // Delete existing preferences
        preferenceService.deleteUserPreferences(userId);
        
        // Create new default preferences
        NotificationPreference defaultPrefs = preferenceService.getUserPreferences(userId);
        return ResponseEntity.ok(defaultPrefs);
    }
    
    /**
     * Get available notification types and their descriptions
     */
    @GetMapping("/types")
    public ResponseEntity<Map<String, String>> getNotificationTypes() {
        Map<String, String> types = new HashMap<>();
        types.put("RECIPE_LIKE", "When someone likes your recipe");
        types.put("RECIPE_COMMENT", "When someone comments on your recipe");
        types.put("USER_FOLLOW", "When someone follows you");
        types.put("COMMENT_REPLY", "When someone replies to your comment");
        types.put("LEARNING_MILESTONE", "When you reach a learning milestone");
        types.put("RECOMMENDATION", "Personalized content recommendations");
        types.put("ACHIEVEMENT", "When you earn an achievement");
        types.put("SYSTEM", "System announcements and updates");
        types.put("GROUP_INVITATION", "When you're invited to a group");
        types.put("GROUP_JOIN_REQUEST", "When someone requests to join your group");
        types.put("GROUP_POST", "New activity in your groups");
        types.put("CHALLENGE", "Updates about cooking challenges");
        return ResponseEntity.ok(types);
    }
    
    /**
     * Get available notification channels and their descriptions
     */
    @GetMapping("/channels")
    public ResponseEntity<Map<String, String>> getNotificationChannels() {
        return ResponseEntity.ok(Map.of(
            "in-app", "Notifications within the application",
            "email", "Email notifications",
            "push", "Push notifications on supported devices"
        ));
    }
    
    /**
     * Get available email frequency options
     */
    @GetMapping("/email-frequencies")
    public ResponseEntity<Map<String, String>> getEmailFrequencies() {
        return ResponseEntity.ok(Map.of(
            "IMMEDIATE", "Send emails immediately",
            "DAILY", "Send a daily digest of notifications",
            "WEEKLY", "Send a weekly digest of notifications"
        ));
    }
}
