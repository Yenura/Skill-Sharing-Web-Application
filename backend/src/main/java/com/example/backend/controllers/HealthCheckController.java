package com.example.backend.controllers;

import com.example.backend.services.WebSocketService;
import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.CacheManager;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
public class HealthCheckController {

    @Autowired
    private MongoTemplate mongoTemplate;

    @Autowired
    private CacheManager cacheManager;

    @Autowired
    private WebSocketService webSocketService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> checkHealth() {
        Map<String, Object> health = new HashMap<>();
        Map<String, String> services = new HashMap<>();

        // Check MongoDB
        try {
            mongoTemplate.getDb().runCommand(Document.parse("{ ping: 1 }"));
            services.put("mongodb", "UP");
        } catch (Exception e) {
            services.put("mongodb", "DOWN");
        }

        // Check Cache
        try {
            cacheManager.getCacheNames();
            services.put("cache", "UP");
        } catch (Exception e) {
            services.put("cache", "DOWN");
        }

        // Check WebSocket
        try {
            services.put("websocket", "UP");
        } catch (Exception e) {
            services.put("websocket", "DOWN");
        }

        health.put("status", services.containsValue("DOWN") ? "degraded" : "healthy");
        health.put("services", services);
        health.put("timestamp", System.currentTimeMillis());

        return ResponseEntity.ok(health);
    }

    @GetMapping("/metrics")
    public ResponseEntity<Map<String, Object>> getMetrics() {
        Map<String, Object> metrics = new HashMap<>();
        
        // Cache metrics
        Map<String, Integer> cacheMetrics = new HashMap<>();
        cacheManager.getCacheNames().forEach(cacheName -> 
            cacheMetrics.put(cacheName, cacheManager.getCache(cacheName).toString().length())
        );
        metrics.put("cache", cacheMetrics);

        // Memory metrics
        Runtime runtime = Runtime.getRuntime();
        Map<String, Long> memoryMetrics = new HashMap<>();
        memoryMetrics.put("total", runtime.totalMemory());
        memoryMetrics.put("free", runtime.freeMemory());
        memoryMetrics.put("used", runtime.totalMemory() - runtime.freeMemory());
        metrics.put("memory", memoryMetrics);

        // Add timestamp
        metrics.put("timestamp", System.currentTimeMillis());

        return ResponseEntity.ok(metrics);
    }

    @GetMapping("/readiness")
    public ResponseEntity<Map<String, String>> checkReadiness() {
        Map<String, String> status = new HashMap<>();
        
        // Check if all required services are ready
        boolean isReady = true;
        try {
            mongoTemplate.getDb().runCommand(Document.parse("{ ping: 1 }"));
            cacheManager.getCacheNames();
        } catch (Exception e) {
            isReady = false;
        }

        status.put("status", isReady ? "ready" : "not_ready");
        return ResponseEntity.ok(status);
    }

    @GetMapping("/liveness")
    public ResponseEntity<Map<String, String>> checkLiveness() {
        Map<String, String> status = new HashMap<>();
        status.put("status", "alive");
        return ResponseEntity.ok(status);
    }
}