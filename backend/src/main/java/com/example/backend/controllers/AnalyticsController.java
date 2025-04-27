package com.example.backend.controllers;

import com.example.backend.models.Analytics;
import com.example.backend.models.AnalyticsEvent;
import com.example.backend.repositories.AnalyticsRepository;
import com.example.backend.repositories.AnalyticsEventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    @Autowired
    private AnalyticsRepository analyticsRepository;

    @Autowired
    private AnalyticsEventRepository analyticsEventRepository;

    @GetMapping("/{type}")
    public ResponseEntity<?> getAnalytics(
            @PathVariable String type,
            @RequestParam(required = false) String period,
            @RequestParam(required = false) String userId,
            @RequestParam(required = false) String contentId) {
        try {
            LocalDateTime startDate = getStartDate(period);
            
            switch (type) {
                case "progress":
                    return getProgressAnalytics(userId, startDate);
                case "engagement":
                    return getEngagementAnalytics(userId, startDate);
                case "achievements":
                    return getAchievementsAnalytics(userId);
                default:
                    return ResponseEntity.badRequest().body("Invalid analytics type");
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error fetching analytics");
        }
    }

    @PostMapping("/track")
    public ResponseEntity<?> trackEvent(@RequestBody AnalyticsEvent event) {
        try {
            event.setTimestamp(LocalDateTime.now());
            AnalyticsEvent savedEvent = analyticsEventRepository.save(event);
            return ResponseEntity.ok(savedEvent);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error tracking event");
        }
    }

    private ResponseEntity<?> getProgressAnalytics(String userId, LocalDateTime startDate) {
        List<Analytics> analytics = analyticsRepository.findByUserIdAndTimestampAfter(userId, startDate);
        
        Map<String, Double> progress = analytics.stream()
            .collect(Collectors.groupingBy(
                Analytics::getSkillType,
                Collectors.averagingDouble(Analytics::getProgressPercentage)
            ));
        
        Map<String, Object> response = new HashMap<>();
        response.put("progress", progress);
        response.put("totalSkills", progress.size());
        response.put("averageProgress", progress.values().stream()
            .mapToDouble(val -> val)
            .average()
            .orElse(0.0));
        
        return ResponseEntity.ok(response);
    }

    private ResponseEntity<?> getEngagementAnalytics(String userId, LocalDateTime startDate) {
        List<AnalyticsEvent> events = analyticsEventRepository.findByUserIdAndTimestampAfter(userId, startDate);
        
        Map<String, Long> eventCounts = events.stream()
            .collect(Collectors.groupingBy(
                AnalyticsEvent::getEventType,
                Collectors.counting()
            ));
        
        Map<String, Object> response = new HashMap<>();
        response.put("events", eventCounts);
        response.put("totalEvents", events.size());
        response.put("activeHours", events.stream()
            .map(event -> event.getTimestamp().getHour())
            .distinct()
            .count());
        
        return ResponseEntity.ok(response);
    }

    private ResponseEntity<?> getAchievementsAnalytics(String userId) {
        List<Analytics> analytics = analyticsRepository.findByUserIdAndType(userId, "achievement");
        
        Map<String, Object> response = new HashMap<>();
        response.put("achievements", analytics);
        response.put("totalAchievements", analytics.size());
        response.put("recentAchievements", analytics.stream()
            .filter(a -> a.getTimestamp().isAfter(LocalDateTime.now().minusDays(30)))
            .count());
        
        return ResponseEntity.ok(response);
    }

    private LocalDateTime getStartDate(String period) {
        LocalDateTime now = LocalDateTime.now();
        
        switch (period != null ? period.toLowerCase() : "week") {
            case "day":
                return now.minus(1, ChronoUnit.DAYS);
            case "month":
                return now.minus(1, ChronoUnit.MONTHS);
            case "year":
                return now.minus(1, ChronoUnit.YEARS);
            case "week":
            default:
                return now.minus(1, ChronoUnit.WEEKS);
        }
    }
} 
