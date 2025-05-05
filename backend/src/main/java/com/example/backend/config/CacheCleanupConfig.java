package com.example.backend.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.CacheManager;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

@Configuration
@EnableScheduling
public class CacheCleanupConfig {

    @Autowired
    private CacheManager cacheManager;

    // Clean up search results cache every 5 minutes
    @Scheduled(fixedRate = 300000)
    public void cleanupSearchResultsCache() {
        cacheManager.getCache("searchResults").clear();
    }

    // Clean up autocomplete cache every 15 minutes
    @Scheduled(fixedRate = 900000)
    public void cleanupAutoCompleteCache() {
        cacheManager.getCache("autoComplete").clear();
    }

    // Clean up trending searches cache every hour
    @Scheduled(fixedRate = 3600000)
    public void cleanupTrendingSearchesCache() {
        cacheManager.getCache("trendingSearches").clear();
    }

    // Clean up learning progress cache every 30 minutes
    @Scheduled(fixedRate = 1800000)
    public void cleanupLearningProgressCache() {
        cacheManager.getCache("learningProgress").clear();
    }

    // Clean up all caches at midnight every day
    @Scheduled(cron = "0 0 0 * * ?")
    public void cleanupAllCaches() {
        cacheManager.getCacheNames()
            .forEach(cacheName -> cacheManager.getCache(cacheName).clear());
    }
}