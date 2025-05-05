package com.example.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Bucket4j;
import io.github.bucket4j.Refill;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Configuration
public class RateLimitingConfig {

    private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();

    @Bean
    public Map<String, Bucket> buckets() {
        return buckets;
    }

    public Bucket resolveBucket(String key) {
        return buckets.computeIfAbsent(key, this::newBucket);
    }

    private Bucket newBucket(String key) {
        return Bucket4j.builder()
            .addLimit(getLimit(key))
            .build();
    }

    private Bandwidth getLimit(String key) {
        if (key.contains("search")) {
            // 30 searches per minute
            return Bandwidth.classic(30, Refill.intervally(30, Duration.ofMinutes(1)));
        } else if (key.contains("learning")) {
            // 60 learning operations per minute
            return Bandwidth.classic(60, Refill.intervally(60, Duration.ofMinutes(1)));
        } else {
            // Default: 100 operations per minute
            return Bandwidth.classic(100, Refill.intervally(100, Duration.ofMinutes(1)));
        }
    }

    public void clearBucket(String key) {
        buckets.remove(key);
    }

    public void clearAllBuckets() {
        buckets.clear();
    }
}