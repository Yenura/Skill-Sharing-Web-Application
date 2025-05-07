package com.skillsharing.controller;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.skillsharing.model.LearningUpdate;
import com.skillsharing.model.User;
import com.skillsharing.repository.LearningUpdateRepository;
import com.skillsharing.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/learning")
@RequiredArgsConstructor
public class LearningController {
    
    private static final Logger logger = LoggerFactory.getLogger(LearningController.class);
    private final LearningUpdateRepository learningUpdateRepository;
    private final UserRepository userRepository;
    
    // Get learning update templates
    @GetMapping("/templates")
    public ResponseEntity<?> getLearningTemplates() {
        Map<String, Object> response = new HashMap<>();
        
        // Tutorial completion template
        Map<String, Object> tutorialTemplate = new HashMap<>();
        tutorialTemplate.put("title", "Ate Balanced Meals");
        tutorialTemplate.put("category", "TUTORIAL");
        tutorialTemplate.put("fields", List.of(
            Map.of("name", "resourceName", "label", "Meal Name", "type", "text", "required", true),
            Map.of("name", "description", "label", "What did you eat?", "type", "textarea", "required", false),
            Map.of("name", "skillsLearned", "label", "What do you focus on?", "type", "tags", "required", true),
            Map.of("name", "hoursSpent", "label", "Time Taken to Prepare (hour)", "type", "number", "required", true),
            Map.of("name", "difficulty", "label", "Meal Preparation Level", "type", "select", "options", 
                  List.of("BEGINNER", "INTERMEDIATE", "ADVANCED"), "required", true)
        ));
        
        // Course completion template
        Map<String, Object> courseTemplate = new HashMap<>();
        courseTemplate.put("title", "Tried a New Recipe");
        courseTemplate.put("category", "COURSE");
        courseTemplate.put("fields", List.of(
            Map.of("name", "resourceName", "label", "Recipe Name ", "type", "text", "required", true),
            Map.of("name", "description", "label", "How did you make it?", "type", "textarea", "required", false),
            Map.of("name", "skillsLearned", "label", "What do you focus on?", "type", "tags", "required", true),
            Map.of("name", "hoursSpent", "label", "Time Spent Cooking (hour)", "type", "number", "required", true),
            Map.of("name", "difficulty", "label", "Recipe Difficulty Level", "type", "select", "options", 
                  List.of("BEGINNER", "INTERMEDIATE", "ADVANCED"), "required", true)
        ));
        
        // Project completion template
        Map<String, Object> projectTemplate = new HashMap<>();
        projectTemplate.put("title", "Meal Prepped");
        projectTemplate.put("category", "PROJECT");
        projectTemplate.put("fields", List.of(
            Map.of("name", "resourceName", "label", "Meal Prep Title", "type", "text", "required", true),
            Map.of("name", "description", "label", "What meals did you prep?", "type", "textarea", "required", true),
            Map.of("name", "skillsLearned", "label", "What do you focus on?", "type", "tags", "required", true),
            Map.of("name", "hoursSpent", "label", "Total Prep Time (hour)", "type", "number", "required", true),
            Map.of("name", "difficulty", "label", "Meal Prep Skill Level", "type", "select", "options", 
                  List.of("BEGINNER", "INTERMEDIATE", "ADVANCED"), "required", true)
        ));
        
        response.put("templates", List.of(tutorialTemplate, courseTemplate, projectTemplate));
        
        return ResponseEntity.ok(response);
    }
    
    // Add a learning update
    @PostMapping("/updates")
    public ResponseEntity<?> addLearningUpdate(@RequestBody LearningUpdate learningUpdate) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        learningUpdate.setUserId(currentUser.getId());
        learningUpdate.setCreatedAt(LocalDateTime.now());
        
        if (learningUpdate.getCompletedAt() == null) {
            learningUpdate.setCompletedAt(LocalDateTime.now());
        }
        
        // Initialize skills if null
        if (currentUser.getSkills() == null) {
            currentUser.setSkills(new HashSet<>());
        }
        
        // Update user's skills with newly learned skills
        if (learningUpdate.getSkillsLearned() != null && !learningUpdate.getSkillsLearned().isEmpty()) {
            for (String skill : learningUpdate.getSkillsLearned()) {
                if (!currentUser.getSkills().contains(skill)) {
                    currentUser.getSkills().add(skill);
                }
            }
        }
        
        // Update streak information
        updateLearningStreak(currentUser, learningUpdate.getCompletedAt().toLocalDate());
        userRepository.save(currentUser);
        
        LearningUpdate savedUpdate = learningUpdateRepository.save(learningUpdate);
        
        Map<String, Object> response = new HashMap<>();
        response.put("learningUpdate", savedUpdate);
        response.put("user", currentUser); // Return updated user with new skills and streak
        
        return ResponseEntity.ok(response);
    }
    
    // Helper method to update learning streak
    private void updateLearningStreak(User user, LocalDate learningDate) {
        // Initialize learning dates set if null
        if (user.getLearningDates() == null) {
            user.setLearningDates(new HashSet<>());
        }
        
        // If this date was already recorded, no need to update streak
        if (user.getLearningDates().contains(learningDate)) {
            return;
        }
        
        // Add this date to learning dates
        user.getLearningDates().add(learningDate);
        
        LocalDate today = LocalDate.now();
        LocalDate yesterday = today.minusDays(1);
        
        // If this is the first learning activity or if the last learning was more than a day ago
        if (user.getLastLearningDate() == null) {
            user.setCurrentStreak(1);
            user.setLastLearningDate(learningDate);
        } else if (user.getLastLearningDate().equals(yesterday) || 
                   user.getLastLearningDate().equals(today)) {
            // Increment streak if last activity was yesterday or today
            user.setCurrentStreak(user.getCurrentStreak() + 1);
            user.setLastLearningDate(learningDate);
        } else if (learningDate.isAfter(user.getLastLearningDate())) {
            // Reset streak if there's a gap
            user.setCurrentStreak(1);
            user.setLastLearningDate(learningDate);
        }
        
        // Update longest streak if current streak is longer
        if (user.getCurrentStreak() > user.getLongestStreak()) {
            user.setLongestStreak(user.getCurrentStreak());
        }
    }
    
    // Get learning updates for a user
    @GetMapping("/updates/user/{userId}")
    public ResponseEntity<List<LearningUpdate>> getUserLearningUpdates(@PathVariable String userId) {
        List<LearningUpdate> updates = learningUpdateRepository.findByUserIdOrderByCompletedAtDesc(userId);
        return ResponseEntity.ok(updates);
    }
    
    // Delete a learning update
    @DeleteMapping("/updates/{updateId}")
    public ResponseEntity<?> deleteLearningUpdate(@PathVariable String updateId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Optional<LearningUpdate> updateOpt = learningUpdateRepository.findById(updateId);
        
        if (updateOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        LearningUpdate update = updateOpt.get();
        
        // Only allow the owner to delete their updates
        if (!update.getUserId().equals(currentUser.getId())) {
            return ResponseEntity.status(403).body("You are not authorized to delete this learning update");
        }
        
        learningUpdateRepository.delete(update);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Learning update deleted successfully");
        
        return ResponseEntity.ok(response);
    }
    
    // Update a learning update
    @PutMapping("/updates/{updateId}")
    public ResponseEntity<?> updateLearningUpdate(
            @PathVariable String updateId,
            @RequestBody LearningUpdate updatedData) {
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Optional<LearningUpdate> updateOpt = learningUpdateRepository.findById(updateId);
        
        if (updateOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        LearningUpdate existingUpdate = updateOpt.get();
        
        // Verify ownership
        if (!existingUpdate.getUserId().equals(currentUser.getId())) {
            return ResponseEntity.status(403).body("You are not authorized to update this learning update");
        }
        
        // Initialize skills if null
        if (currentUser.getSkills() == null) {
            currentUser.setSkills(new HashSet<>());
        }
        
        // Update fields while preserving the original user ID and creation date
        existingUpdate.setTitle(updatedData.getTitle());
        existingUpdate.setDescription(updatedData.getDescription());
        existingUpdate.setCategory(updatedData.getCategory());
        existingUpdate.setResourceName(updatedData.getResourceName());
        existingUpdate.setDifficulty(updatedData.getDifficulty());
        existingUpdate.setHoursSpent(updatedData.getHoursSpent());
        existingUpdate.setCompletedAt(updatedData.getCompletedAt() != null ? 
                                     updatedData.getCompletedAt() : existingUpdate.getCompletedAt());
        
        // Handle skill updates
        if (updatedData.getSkillsLearned() != null) {
            // Look for new skills added
            List<String> newSkills = new ArrayList<>();
            for (String skill : updatedData.getSkillsLearned()) {
                if (!existingUpdate.getSkillsLearned().contains(skill) && 
                    !currentUser.getSkills().contains(skill)) {
                    newSkills.add(skill);
                }
            }
            
            // Add any new skills to the user
            if (!newSkills.isEmpty()) {
                for (String skill : newSkills) {
                    currentUser.getSkills().add(skill);
                }
                userRepository.save(currentUser);
            }
            
            // Update the learning update skills
            existingUpdate.setSkillsLearned(updatedData.getSkillsLearned());
        }
        
        LearningUpdate savedUpdate = learningUpdateRepository.save(existingUpdate);
        
        Map<String, Object> response = new HashMap<>();
        response.put("learningUpdate", savedUpdate);
        response.put("user", currentUser); // Return updated user with any new skills
        
        return ResponseEntity.ok(response);
    }
    
    // Add new endpoint to get streak information
    @GetMapping("/streak/{userId}")
    public ResponseEntity<?> getUserStreak(@PathVariable String userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        
        if (userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        User user = userOpt.get();
        
        Map<String, Object> response = new HashMap<>();
        response.put("currentStreak", user.getCurrentStreak());
        response.put("longestStreak", user.getLongestStreak());
        response.put("lastLearningDate", user.getLastLearningDate());
        
        // Calculate calendar heatmap data
        Map<String, Integer> learningHeatmap = new HashMap<>();
        if (user.getLearningDates() != null) {
            // Get dates from the last 6 months
            LocalDate sixMonthsAgo = LocalDate.now().minusMonths(6);
            
            user.getLearningDates().stream()
                .filter(date -> !date.isBefore(sixMonthsAgo))
                .forEach(date -> {
                    String dateString = date.toString();
                    learningHeatmap.put(dateString, learningHeatmap.getOrDefault(dateString, 0) + 1);
                });
        }
        
        response.put("heatmapData", learningHeatmap);
        
        return ResponseEntity.ok(response);
    }
}
