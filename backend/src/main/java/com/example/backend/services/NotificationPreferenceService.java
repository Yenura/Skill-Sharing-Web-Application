package com.example.backend.services;

import com.example.backend.models.NotificationPreference;
import com.example.backend.repositories.NotificationPreferenceRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

@Service
public class NotificationPreferenceService {
    
    private final NotificationPreferenceRepository preferenceRepository;
    private static final Logger logger = LoggerFactory.getLogger(NotificationPreferenceService.class);
    
    public NotificationPreferenceService(NotificationPreferenceRepository preferenceRepository) {
        this.preferenceRepository = preferenceRepository;
    }
    
    /**
     * Get a user's notification preferences, creating default preferences if none exist
     * @param userId The user ID
     * @return The user's notification preferences
     */
    public NotificationPreference getUserPreferences(String userId) {
        Optional<NotificationPreference> existingPrefs = preferenceRepository.findByUserId(userId);
        
        if (existingPrefs.isPresent()) {
            return existingPrefs.get();
        } else {
            // Create default preferences
            NotificationPreference newPrefs = new NotificationPreference();
            newPrefs.setUserId(userId);
            return preferenceRepository.save(newPrefs);
        }
    }
    
    /**
     * Update a user's notification type preferences (enable/disable specific notification types)
     * @param userId The user ID
     * @param preferences Map of notification types to boolean enabled status
     * @return The updated notification preferences
     */
    public NotificationPreference updateTypePreferences(String userId, Map<String, Boolean> preferences) {
        NotificationPreference prefs = getUserPreferences(userId);
        
        // Update only the specified preferences
        preferences.forEach(prefs::setTypeEnabled);
        
        return preferenceRepository.save(prefs);
    }
    
    /**
     * Update a user's notification channel preferences (how they receive each notification type)
     * @param userId The user ID
     * @param channelPreferences Map of notification types to channel strings (comma-separated: "in-app,email,push")
     * @return The updated notification preferences
     */
    public NotificationPreference updateChannelPreferences(String userId, Map<String, String> channelPreferences) {
        NotificationPreference prefs = getUserPreferences(userId);
        
        // Update only the specified channel preferences
        channelPreferences.forEach(prefs::setChannelForType);
        
        return preferenceRepository.save(prefs);
    }
    
    /**
     * Update a user's global notification settings (email, push, in-app enabled status)
     * @param userId The user ID
     * @param emailEnabled Whether email notifications are enabled
     * @param pushEnabled Whether push notifications are enabled
     * @param inAppEnabled Whether in-app notifications are enabled
     * @param emailFrequency How often to send email digests (IMMEDIATE, DAILY, WEEKLY)
     * @return The updated notification preferences
     */
    public NotificationPreference updateGlobalSettings(
            String userId, 
            Boolean emailEnabled, 
            Boolean pushEnabled, 
            Boolean inAppEnabled, 
            String emailFrequency) {
        
        NotificationPreference prefs = getUserPreferences(userId);
        
        if (emailEnabled != null) {
            prefs.setEmailEnabled(emailEnabled);
        }
        
        if (pushEnabled != null) {
            prefs.setPushEnabled(pushEnabled);
        }
        
        if (inAppEnabled != null) {
            prefs.setInAppEnabled(inAppEnabled);
        }
        
        if (emailFrequency != null) {
            prefs.setEmailFrequency(emailFrequency);
        }
        
        return preferenceRepository.save(prefs);
    }
    
    /**
     * Check if a notification should be sent based on user preferences
     * @param userId The user ID
     * @param notificationType The type of notification
     * @param channel The notification channel (email, push, in-app)
     * @return True if the notification should be sent, false otherwise
     */
    public boolean shouldSendNotification(String userId, String notificationType, String channel) {
        NotificationPreference prefs = getUserPreferences(userId);
        
        // First check if the notification type is enabled
        if (!prefs.isTypeEnabled(notificationType)) {
            return false;
        }
        
        // Then check if the channel is enabled for this type
        if (!prefs.isChannelEnabledForType(notificationType, channel)) {
            return false;
        }
        
        // Finally check if the channel is globally enabled
        switch (channel) {
            case "email":
                return prefs.isEmailEnabled();
            case "push":
                return prefs.isPushEnabled();
            case "in-app":
                return prefs.isInAppEnabled();
            default:
                return false;
        }
    }
    
    /**
     * Delete a user's notification preferences
     * @param userId The user ID
     */
    public void deleteUserPreferences(String userId) {
        preferenceRepository.deleteByUserId(userId);
    }
}
