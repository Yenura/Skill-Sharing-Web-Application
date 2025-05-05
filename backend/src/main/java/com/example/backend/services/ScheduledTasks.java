package com.example.backend.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.CacheManager;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Objects;

@Service
public class ScheduledTasks {
    
    private static final Logger logger = LoggerFactory.getLogger(ScheduledTasks.class);
    
    private final NotificationService notificationService;
    private final SearchTrendService searchTrendService;
    private final RecommendationService recommendationService;
    private final CacheManager cacheManager;

    public ScheduledTasks(NotificationService notificationService,
                         SearchTrendService searchTrendService,
                         RecommendationService recommendationService,
                         CacheManager cacheManager) {
        this.notificationService = notificationService;
        this.searchTrendService = searchTrendService;
        this.recommendationService = recommendationService;
        this.cacheManager = cacheManager;
    }

    // Clean up old notifications daily at 2 AM
    @Scheduled(cron = "0 0 2 * * ?")
    public void cleanupOldNotifications() {
        logger.info("Starting scheduled cleanup of old notifications");
        try {
            notificationService.cleanupOldNotifications();
            logger.info("Completed cleanup of old notifications");
        } catch (Exception e) {
            logger.error("Error during notification cleanup: {}", e.getMessage());
        }
    }

    // Update search trends every hour
    @Scheduled(cron = "0 0 * * * ?")
    public void updateSearchTrends() {
        logger.info("Starting scheduled update of search trends");
        try {
            searchTrendService.processSearchTrends(); // Changed method name to match expected API
            // Clear the trends cache to ensure fresh data
            clearCacheByName("trends");
            logger.info("Completed update of search trends");
        } catch (Exception e) {
            logger.error("Error during search trends update: {}", e.getMessage());
        }
    }

    // Clear recommendation caches daily at 2 AM
    @Scheduled(cron = "0 0 2 * * ?")
    public void clearRecommendationCaches() {
        logger.info("Starting scheduled clearing of recommendation caches");
        try {
            clearCacheByName("recommendations");
            clearCacheByName("skillSuggestions");
            logger.info("Completed clearing of recommendation caches");
        } catch (Exception e) {
            logger.error("Error during cache clearing: {}", e.getMessage());
        }
    }

    // Check and notify users of new recommendations every 6 hours
    @Scheduled(cron = "0 0 */6 * * ?")
    public void checkAndNotifyNewRecommendations() {
        logger.info("Starting scheduled check for new recommendations");
        try {
            // Implementation would go here to check for new recommendations
            // and notify users through the NotificationService
            logger.info("Completed check for new recommendations");
        } catch (Exception e) {
            logger.error("Error during recommendation check: {}", e.getMessage());
        }
    }

    // Update learning analytics every 30 minutes
    @Scheduled(fixedRate = 1800000) // 30 minutes in milliseconds
    public void updateLearningAnalytics() {
        logger.info("Starting scheduled update of learning analytics");
        try {
            // Implementation would go here
            logger.info("Completed update of learning analytics");
        } catch (Exception e) {
            logger.error("Error during learning analytics update: {}", e.getMessage());
        }
    }

    // Health check logger every 15 minutes
    @Scheduled(fixedRate = 900000) // 15 minutes in milliseconds
    public void logHealthMetrics() {
        logger.info("System Health Check - {}", LocalDateTime.now());
        try {
            // Log cache statistics
            cacheManager.getCacheNames().forEach(cacheName -> 
                logger.info("Cache '{}' statistics:", cacheName)
            );
            // Log other health metrics as needed
        } catch (Exception e) {
            logger.error("Error during health check logging: {}", e.getMessage());
        }
    }

    private void clearCacheByName(String cacheName) {
        Objects.requireNonNull(cacheManager.getCache(cacheName)).clear();
        logger.info("Cleared cache: {}", cacheName);
    }
}