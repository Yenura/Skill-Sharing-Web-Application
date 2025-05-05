package com.example.backend.controllers;

import com.example.backend.models.*;
import com.example.backend.repositories.*;
import com.example.backend.services.NotificationService;
import com.example.backend.services.SearchTrendService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserRepository userRepository;
    private final RecipeRepository recipeRepository;
    private final CommentRepository commentRepository;
    private final GroupRepository groupRepository;
    private final NotificationRepository notificationRepository;
    private final SearchTrendService searchTrendService;
    private final NotificationService notificationService;
    private final CookingChallengeRepository challengeRepository;
    private final LearningMilestoneRepository milestoneRepository;
    private final ReportRepository reportRepository;

    public AdminController(
            UserRepository userRepository,
            RecipeRepository recipeRepository,
            CommentRepository commentRepository,
            GroupRepository groupRepository,
            NotificationRepository notificationRepository,
            SearchTrendService searchTrendService,
            NotificationService notificationService,
            CookingChallengeRepository challengeRepository,
            LearningMilestoneRepository milestoneRepository,
            ReportRepository reportRepository) {
        this.userRepository = userRepository;
        this.recipeRepository = recipeRepository;
        this.commentRepository = commentRepository;
        this.groupRepository = groupRepository;
        this.notificationRepository = notificationRepository;
        this.searchTrendService = searchTrendService;
        this.notificationService = notificationService;
        this.challengeRepository = challengeRepository;
        this.milestoneRepository = milestoneRepository;
        this.reportRepository = reportRepository;
    }

    // User Management
    @GetMapping("/users")
    public ResponseEntity<Page<User>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "username") String sortBy,
            @RequestParam(required = false) String filter) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        Page<User> users;
        
        if (filter != null && !filter.isEmpty()) {
            users = userRepository.findByUsernameContainingIgnoreCase(filter, pageable);
        } else {
            users = userRepository.findAll(pageable);
        }
        
        return ResponseEntity.ok(users);
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<User> getUserById(@PathVariable String id) {
        return userRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/users/{id}/status")
    public ResponseEntity<User> updateUserStatus(
            @PathVariable String id,
            @RequestParam boolean enabled) {
        
        return userRepository.findById(id)
                .map(user -> {
                    user.setEnabled(enabled);
                    return ResponseEntity.ok(userRepository.save(user));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<User> updateUserRole(
            @PathVariable String id,
            @RequestBody List<String> roles) {
        
        return userRepository.findById(id)
                .map(user -> {
                    Set<String> rolesSet = new HashSet<>(roles);
                    user.setRoles(rolesSet);
                    return ResponseEntity.ok(userRepository.save(user));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Content Moderation
    @GetMapping("/reports")
    public ResponseEntity<Page<Report>> getReports(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(required = false) String status) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, sortBy));
        Page<Report> reports;
        
        if (status != null && !status.isEmpty()) {
            reports = reportRepository.findByStatus(status, pageable);
        } else {
            reports = reportRepository.findAll(pageable);
        }
        
        return ResponseEntity.ok(reports);
    }

    @PutMapping("/reports/{id}")
    public ResponseEntity<Report> updateReportStatus(
            @PathVariable String id,
            @RequestParam String status,
            @RequestParam(required = false) String moderatorNote) {
        
        return reportRepository.findById(id)
                .map(report -> {
                    report.setStatus(status);
                    if (moderatorNote != null && !moderatorNote.isEmpty()) {
                        report.setModeratorNote(moderatorNote);
                    }
                    report.setResolvedAt(LocalDateTime.now());
                    return ResponseEntity.ok(reportRepository.save(report));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/recipes/{id}")
    public ResponseEntity<Void> deleteRecipe(@PathVariable String id) {
        if (recipeRepository.existsById(id)) {
            recipeRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/comments/{id}")
    public ResponseEntity<Void> deleteComment(@PathVariable String id) {
        if (commentRepository.existsById(id)) {
            commentRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    // Featured Content
    @PostMapping("/featured/recipes")
    public ResponseEntity<Recipe> featureRecipe(
            @RequestParam String recipeId,
            @RequestParam(required = false) String featuredReason) {
        
        return recipeRepository.findById(recipeId)
                .map(recipe -> {
                    recipe.setFeatured(true);
                    recipe.setFeaturedReason(featuredReason);
                    recipe.setFeaturedAt(LocalDateTime.now());
                    Recipe savedRecipe = recipeRepository.save(recipe);
                    
                    // Notify the recipe author
                    notificationService.notifyRecipeFeatured(savedRecipe);
                    
                    return ResponseEntity.ok(savedRecipe);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/featured/recipes/{id}")
    public ResponseEntity<Recipe> unfeatureRecipe(@PathVariable String id) {
        return recipeRepository.findById(id)
                .map(recipe -> {
                    recipe.setFeatured(false);
                    recipe.setFeaturedReason(null);
                    return ResponseEntity.ok(recipeRepository.save(recipe));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // System Announcements
    @PostMapping("/announcements")
    public ResponseEntity<Map<String, Object>> createAnnouncement(
            @RequestBody Map<String, Object> announcementData) {
        
        String title = (String) announcementData.get("title");
        String message = (String) announcementData.get("message");
        List<String> targetUserIds = (List<String>) announcementData.get("targetUserIds");
        
        if (title == null || message == null) {
            return ResponseEntity.badRequest().build();
        }
        
        // If no specific users are targeted, send to all users
        if (targetUserIds == null || targetUserIds.isEmpty()) {
            List<String> allUserIds = userRepository.findAll().stream()
                    .map(User::getId)
                    .collect(Collectors.toList());
            
            notificationService.notifySystemAnnouncement(title, message, allUserIds);
        } else {
            notificationService.notifySystemAnnouncement(title, message, targetUserIds);
        }
        
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "success", true,
                "message", "Announcement sent successfully"
        ));
    }

    // Analytics & Metrics
    @GetMapping("/metrics/overview")
    public ResponseEntity<Map<String, Object>> getOverviewMetrics() {
        long userCount = userRepository.count();
        long recipeCount = recipeRepository.count();
        long commentCount = commentRepository.count();
        long groupCount = groupRepository.count();
        
        Map<String, Object> metrics = new HashMap<>();
        metrics.put("userCount", userCount);
        metrics.put("recipeCount", recipeCount);
        metrics.put("commentCount", commentCount);
        metrics.put("groupCount", groupCount);
        
        // Add growth metrics (new users/recipes in last 30 days)
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        long newUsers = userRepository.countByCreatedAtAfter(thirtyDaysAgo);
        long newRecipes = recipeRepository.countByCreatedAtAfter(thirtyDaysAgo);
        
        metrics.put("newUsers30Days", newUsers);
        metrics.put("newRecipes30Days", newRecipes);
        
        return ResponseEntity.ok(metrics);
    }

    @GetMapping("/metrics/engagement")
    public ResponseEntity<Map<String, Object>> getEngagementMetrics() {
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        
        long totalLikes = recipeRepository.sumLikesCount();
        long totalViews = recipeRepository.sumViewsCount();
        long recentComments = commentRepository.countByCreatedAtAfter(thirtyDaysAgo);
        
        // Get top search trends
        List<SearchTrend> topSearches = searchTrendService.getTopSearchTrends(10);
        
        Map<String, Object> metrics = new HashMap<>();
        metrics.put("totalLikes", totalLikes);
        metrics.put("totalViews", totalViews);
        metrics.put("recentComments", recentComments);
        metrics.put("topSearches", topSearches);
        
        return ResponseEntity.ok(metrics);
    }

    @GetMapping("/metrics/content")
    public ResponseEntity<Map<String, Object>> getContentMetrics() {
        // Get top recipes by likes
        List<Recipe> topRecipes = recipeRepository.findTop10ByOrderByLikesCountDesc();
        
        // Get most active users (by recipe count)
        List<Object[]> mostActiveUsers = recipeRepository.findMostActiveUsers(10);
        
        // Get most popular cuisine types
        List<Object[]> popularCuisines = recipeRepository.findPopularCuisineTypes();
        
        Map<String, Object> metrics = new HashMap<>();
        metrics.put("topRecipes", topRecipes);
        metrics.put("mostActiveUsers", mostActiveUsers);
        metrics.put("popularCuisines", popularCuisines);
        
        return ResponseEntity.ok(metrics);
    }

    @GetMapping("/analytics/users/interests")
    public ResponseEntity<Map<String, Object>> getUserInterestsAnalytics() {
        Map<String, Object> analytics = new HashMap<>();
        
        try {
            List<User> users = userRepository.findAll();
            Map<String, Integer> interestCounts = new HashMap<>();
            
            for (User user : users) {
                if (user.getInterests() != null) {
                    for (String interest : user.getInterests()) {
                        interestCounts.put(interest, interestCounts.getOrDefault(interest, 0) + 1);
                    }
                }
            }
            
            // Sort interests by popularity
            List<Map.Entry<String, Integer>> sortedInterests = new ArrayList<>(interestCounts.entrySet());
            sortedInterests.sort(Map.Entry.<String, Integer>comparingByValue().reversed());
            
            // Get top 10 interests
            List<Map<String, Object>> topInterests = new ArrayList<>();
            int count = 0;
            for (Map.Entry<String, Integer> entry : sortedInterests) {
                if (count >= 10) break;
                
                Map<String, Object> interestData = new HashMap<>();
                interestData.put("interest", entry.getKey());
                interestData.put("count", entry.getValue());
                topInterests.add(interestData);
                count++;
            }
            
            analytics.put("topInterests", topInterests);
            analytics.put("totalInterests", interestCounts.size());
            
            return ResponseEntity.ok(analytics);
        } catch (Exception e) {
            analytics.put("error", "Failed to fetch user interests analytics: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(analytics);
        }
    }

    // Admin dashboard data
    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardData() {
        Map<String, Object> dashboardData = new HashMap<>();
        
        // Recent user registrations (last 7 days)
        LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);
        List<User> recentUsers = userRepository.findTop10ByCreatedAtAfterOrderByCreatedAtDesc(sevenDaysAgo);
        dashboardData.put("recentUsers", recentUsers);
        
        // Recent reports
        List<Report> recentReports = reportRepository.findTop10ByStatusOrderByCreatedAtDesc("PENDING");
        dashboardData.put("pendingReports", recentReports);
        
        // Featured recipes
        List<Recipe> featuredRecipes = recipeRepository.findByFeaturedTrue();
        dashboardData.put("featuredRecipes", featuredRecipes);
        
        // Active challenges
        List<CookingChallenge> activeChallenge = challengeRepository.findActiveChallenges(LocalDateTime.now());
        dashboardData.put("activeChallenges", activeChallenge);
        
        return ResponseEntity.ok(dashboardData);
    }
}
