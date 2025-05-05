package com.example.backend.services;

import com.example.backend.dto.LearningProgressDTO;
import com.example.backend.models.Notification;
import com.example.backend.models.SearchTrend;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class WebSocketService {

    private static final Logger logger = LoggerFactory.getLogger(WebSocketService.class);

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public void sendNotification(String userId, Notification notification) {
        try {
            messagingTemplate.convertAndSendToUser(
                userId,
                "/queue/notifications",
                notification
            );
            logger.debug("Sent notification to user {}: {}", userId, notification.getMessage());
        } catch (Exception e) {
            logger.error("Error sending notification to user {}: {}", userId, e.getMessage());
        }
    }

    public void notifyRecommendations(String userId, List<String> recommendations) {
        try {
            messagingTemplate.convertAndSendToUser(
                userId,
                "/queue/recommendations",
                Map.of("recommendations", recommendations)
            );
            logger.debug("Sent {} recommendations to user {}", recommendations.size(), userId);
        } catch (Exception e) {
            logger.error("Error sending recommendations to user {}: {}", userId, e.getMessage());
        }
    }

    public void broadcastTrendingContent(Map<String, Object> trendingContent) {
        try {
            messagingTemplate.convertAndSend(
                "/topic/trending",
                trendingContent
            );
            logger.debug("Broadcast trending content update");
        } catch (Exception e) {
            logger.error("Error broadcasting trending content: {}", e.getMessage());
        }
    }

    public void notifyLearningProgress(String userId, Map<String, Object> progress) {
        try {
            messagingTemplate.convertAndSendToUser(
                userId,
                "/queue/learning-progress",
                progress
            );
            logger.debug("Sent learning progress update to user {}", userId);
        } catch (Exception e) {
            logger.error("Error sending learning progress to user {}: {}", userId, e.getMessage());
        }
    }

    public void notifySkillUpdate(String userId, Map<String, Object> skillUpdate) {
        try {
            messagingTemplate.convertAndSendToUser(
                userId,
                "/queue/skill-updates",
                skillUpdate
            );
            logger.debug("Sent skill update to user {}: {}", userId, skillUpdate);
        } catch (Exception e) {
            logger.error("Error sending skill update to user {}: {}", userId, e.getMessage());
        }
    }

    public void notifySystemAlert(String message, String severity) {
        try {
            messagingTemplate.convertAndSend(
                "/topic/system-alerts",
                Map.of(
                    "message", message,
                    "severity", severity,
                    "timestamp", System.currentTimeMillis()
                )
            );
            logger.info("Broadcast system alert: {} ({})", message, severity);
        } catch (Exception e) {
            logger.error("Error broadcasting system alert: {}", e.getMessage());
        }
    }

    public void notifySearchTrends(List<SearchTrend> trends) {
        messagingTemplate.convertAndSend(
            "/topic/search-trends",
            trends
        );
    }

    public void notifyMilestoneAchieved(String userId, String milestone) {
        messagingTemplate.convertAndSendToUser(
            userId,
            "/topic/milestone-achieved",
            milestone
        );
    }

    public void notifySkillLevelUp(String userId, String skill, int newLevel) {
        messagingTemplate.convertAndSendToUser(
            userId,
            "/topic/skill-levelup",
            Map.of(
                "skill", skill,
                "level", newLevel
            )
        );
    }

    public void broadcastTrendingSearches(List<String> trendingSearches) {
        messagingTemplate.convertAndSend(
            "/topic/trending-searches",
            trendingSearches
        );
    }

    public void notifySearchSuggestions(String userId, List<String> suggestions) {
        messagingTemplate.convertAndSendToUser(
            userId,
            "/topic/search-suggestions",
            suggestions
        );
    }
}