package com.example.backend.config;

import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.concurrent.ConcurrentMapCache;
import org.springframework.cache.support.SimpleCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

import java.util.Arrays;
import java.util.concurrent.TimeUnit;

@Configuration
@EnableCaching
@EnableScheduling
public class CacheConfig {

    @Bean
    public CacheManager cacheManager() {
        SimpleCacheManager cacheManager = new SimpleCacheManager();
        cacheManager.setCaches(Arrays.asList(
            new ConcurrentMapCache("searchResults"),
            new ConcurrentMapCache("suggestions")
        ));
        return cacheManager;
    }

    // Clear search results cache every hour
    @Scheduled(fixedRate = 3600000) // 1 hour in milliseconds
    public void clearSearchResultsCache() {
        cacheManager().getCache("searchResults").clear();
    }

    // Clear suggestions cache every 6 hours
    @Scheduled(fixedRate = 21600000) // 6 hours in milliseconds
    public void clearSuggestionsCache() {
        cacheManager().getCache("suggestions").clear();
    }
} 
