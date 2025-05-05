package com.example.backend.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Document(collection = "notification_preferences")
public class NotificationPreference {
    @Id
    private String id;
    
    private String userId;
    private Map<String, Boolean> preferences;
    private boolean emailEnabled;
    private boolean pushEnabled;
    private boolean inAppEnabled;
    private String emailFrequency; // IMMEDIATE, DAILY, WEEKLY
    private LocalDateTime updatedAt;
    private Map<String, String> channelPreferences; // Map notification types to channels (email, push, in-app)
    
    public NotificationPreference() {
        this.preferences = new HashMap<>();
        this.channelPreferences = new HashMap<>();
        this.emailEnabled = true;
        this.pushEnabled = true;
        this.inAppEnabled = true;
        this.emailFrequency = "DAILY";
        this.updatedAt = LocalDateTime.now();
        
        // Default preferences
        this.preferences.put("RECIPE_LIKE", true);
        this.preferences.put("RECIPE_COMMENT", true);
        this.preferences.put("USER_FOLLOW", true);
        this.preferences.put("COMMENT_REPLY", true);
        this.preferences.put("LEARNING_MILESTONE", true);
        this.preferences.put("RECOMMENDATION", true);
        this.preferences.put("ACHIEVEMENT", true);
        this.preferences.put("SYSTEM", true);
        this.preferences.put("GROUP_INVITATION", true);
        this.preferences.put("GROUP_JOIN_REQUEST", true);
        this.preferences.put("GROUP_POST", true);
        this.preferences.put("CHALLENGE", true);
        
        // Default channel preferences
        this.channelPreferences.put("RECIPE_LIKE", "in-app");
        this.channelPreferences.put("RECIPE_COMMENT", "in-app,email");
        this.channelPreferences.put("USER_FOLLOW", "in-app");
        this.channelPreferences.put("COMMENT_REPLY", "in-app,email");
        this.channelPreferences.put("LEARNING_MILESTONE", "in-app,email");
        this.channelPreferences.put("RECOMMENDATION", "in-app");
        this.channelPreferences.put("ACHIEVEMENT", "in-app,email");
        this.channelPreferences.put("SYSTEM", "in-app,email");
        this.channelPreferences.put("GROUP_INVITATION", "in-app,email");
        this.channelPreferences.put("GROUP_JOIN_REQUEST", "in-app,email");
        this.channelPreferences.put("GROUP_POST", "in-app");
        this.channelPreferences.put("CHALLENGE", "in-app,email");
    }
    
    // Getters and setters
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    
    public String getUserId() {
        return userId;
    }
    
    public void setUserId(String userId) {
        this.userId = userId;
    }
    
    public Map<String, Boolean> getPreferences() {
        return preferences;
    }
    
    public void setPreferences(Map<String, Boolean> preferences) {
        this.preferences = preferences;
        this.updatedAt = LocalDateTime.now();
    }
    
    public boolean isEmailEnabled() {
        return emailEnabled;
    }
    
    public void setEmailEnabled(boolean emailEnabled) {
        this.emailEnabled = emailEnabled;
        this.updatedAt = LocalDateTime.now();
    }
    
    public boolean isPushEnabled() {
        return pushEnabled;
    }
    
    public void setPushEnabled(boolean pushEnabled) {
        this.pushEnabled = pushEnabled;
        this.updatedAt = LocalDateTime.now();
    }
    
    public boolean isInAppEnabled() {
        return inAppEnabled;
    }
    
    public void setInAppEnabled(boolean inAppEnabled) {
        this.inAppEnabled = inAppEnabled;
        this.updatedAt = LocalDateTime.now();
    }
    
    public String getEmailFrequency() {
        return emailFrequency;
    }
    
    public void setEmailFrequency(String emailFrequency) {
        this.emailFrequency = emailFrequency;
        this.updatedAt = LocalDateTime.now();
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    public Map<String, String> getChannelPreferences() {
        return channelPreferences;
    }
    
    public void setChannelPreferences(Map<String, String> channelPreferences) {
        this.channelPreferences = channelPreferences;
        this.updatedAt = LocalDateTime.now();
    }
    
    // Helper methods
    public boolean isTypeEnabled(String notificationType) {
        return preferences.getOrDefault(notificationType, true);
    }
    
    public void setTypeEnabled(String notificationType, boolean enabled) {
        preferences.put(notificationType, enabled);
        this.updatedAt = LocalDateTime.now();
    }
    
    public boolean isChannelEnabledForType(String notificationType, String channel) {
        String channels = channelPreferences.getOrDefault(notificationType, "in-app");
        return channels.contains(channel);
    }
    
    public void setChannelForType(String notificationType, String channels) {
        channelPreferences.put(notificationType, channels);
        this.updatedAt = LocalDateTime.now();
    }
}
