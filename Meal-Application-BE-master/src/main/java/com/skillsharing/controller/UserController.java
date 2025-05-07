package com.skillsharing.controller;

import com.skillsharing.dto.UserProfileUpdateDTO;
import com.skillsharing.dto.UserSearchResultDTO;
import com.skillsharing.model.User;
import com.skillsharing.repository.UserRepository;
import com.skillsharing.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.ArrayList;

// Add these imports
import com.skillsharing.model.Notification;
import com.skillsharing.repository.NotificationRepository;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {
    
    private static final Logger logger = LoggerFactory.getLogger(UserController.class);
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final NotificationRepository notificationRepository;  // Add this field

    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        
        logger.debug("Fetching profile for user: {}", email);
        
        return userRepository.findByEmail(email)
            .map(ResponseEntity::ok)
            .orElseGet(() -> {
                logger.error("User not found for email: {}", email);
                return ResponseEntity.notFound().build();
            });
    }
    
    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody UserProfileUpdateDTO updateDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentEmail = authentication.getName();
        
        logger.info("Processing profile update for user: {}", currentEmail);
        logger.info("Update data received: {}", updateDTO);
        
        return userRepository.findByEmail(currentEmail)
            .map(user -> {
                // Store original values for logging
                String originalEmail = user.getEmail();
                String originalBio = user.getBio();
                
                // Create response map
                Map<String, Object> response = new HashMap<>();
                boolean hasChanges = false;
                
                // Update bio and skills
                if (updateDTO.getBio() != null) {
                    user.setBio(updateDTO.getBio());
                    hasChanges = true;
                    logger.info("Bio updated from '{}' to '{}'", originalBio, updateDTO.getBio());
                }
                
                if (updateDTO.getSkills() != null) {
                    user.setSkills(updateDTO.getSkills());
                    hasChanges = true;
                    logger.info("Skills updated for user: {}", currentEmail);
                }
                
                // Update profile picture
                if (updateDTO.getProfilePicture() != null) {
                    user.setProfilePicture(updateDTO.getProfilePicture());
                    hasChanges = true;
                    logger.info("Profile picture updated for user: {}", currentEmail);
                }
                
                // Email update
                if (updateDTO.getEmail() != null && !updateDTO.getEmail().isEmpty() && !updateDTO.getEmail().equals(originalEmail)) {
                    logger.info("Attempting to update email from '{}' to '{}'", originalEmail, updateDTO.getEmail());
                    
                    // Check if email is already in use
                    if (userRepository.existsByEmail(updateDTO.getEmail())) {
                        logger.warn("Email already in use: {}", updateDTO.getEmail());
                        response.put("error", "Email already in use");
                        return ResponseEntity.badRequest().body(response);
                    }
                    
                    // Update email
                    user.setEmail(updateDTO.getEmail());
                    hasChanges = true;
                    logger.info("Email updated from '{}' to '{}'", originalEmail, updateDTO.getEmail());
                }
                
                // Password update
                if (updateDTO.getNewPassword() != null && !updateDTO.getNewPassword().isEmpty()) {
                    if (updateDTO.getCurrentPassword() == null || updateDTO.getCurrentPassword().isEmpty()) {
                        logger.warn("Current password required but not provided");
                        response.put("error", "Current password is required to update password");
                        return ResponseEntity.badRequest().body(response);
                    }
                    
                    // Verify current password
                    if (!passwordEncoder.matches(updateDTO.getCurrentPassword(), user.getPassword())) {
                        logger.warn("Incorrect current password provided");
                        response.put("error", "Current password is incorrect");
                        return ResponseEntity.badRequest().body(response);
                    }
                    
                    // Update password
                    user.setPassword(passwordEncoder.encode(updateDTO.getNewPassword()));
                    hasChanges = true;
                    logger.info("Password updated for user: {}", currentEmail);
                }
                
                // Update firstName if provided
                if (updateDTO.getFirstName() != null) {
                    user.setFirstName(updateDTO.getFirstName());
                    hasChanges = true;
                    logger.info("First name updated to '{}'", updateDTO.getFirstName());
                }
                
                // Update lastName if provided
                if (updateDTO.getLastName() != null) {
                    user.setLastName(updateDTO.getLastName());
                    hasChanges = true;
                    logger.info("Last name updated to '{}'", updateDTO.getLastName());
                }
                
                if (hasChanges) {
                    logger.info("Saving changes to database for user: {}", user.getEmail());
                    User savedUser = userRepository.save(user);
                    logger.info("User profile successfully updated in database");
                    
                    // Generate new token if email changed (since JWT contains the email)
                    if (!originalEmail.equals(savedUser.getEmail())) {
                        String newToken = jwtService.generateToken(
                            new org.springframework.security.core.userdetails.User(
                                savedUser.getEmail(),
                                savedUser.getPassword(),
                                java.util.Collections.emptyList()
                            )
                        );
                        response.put("user", savedUser);
                        response.put("token", newToken);
                        response.put("emailChanged", true);
                        return ResponseEntity.ok(response);
                    }
                    
                    return ResponseEntity.ok(savedUser);
                } else {
                    logger.info("No changes to save for user: {}", currentEmail);
                    return ResponseEntity.ok(user);
                }
            })
            .orElseGet(() -> {
                logger.error("User not found for email: {}", currentEmail);
                return ResponseEntity.notFound().build();
            });
    }
    
    // New endpoint for searching users
    @GetMapping("/search")
    public ResponseEntity<List<UserSearchResultDTO>> searchUsers(@RequestParam String query) {
        logger.info("Searching users with query: {}", query);
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUserEmail = authentication.getName();
        Optional<User> currentUserOpt = userRepository.findByEmail(currentUserEmail);
        
        if (currentUserOpt.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        User currentUser = currentUserOpt.get();
        
        // Search using MongoDB regex for better partial matching
        List<User> searchResults = userRepository.findByNameOrSkillsRegex(query);
        
        logger.info("Search returned {} results", searchResults.size());
        
        List<UserSearchResultDTO> dtos = searchResults.stream()
            .filter(user -> !user.getId().equals(currentUser.getId())) // Exclude the current user
            .map(user -> {
                boolean isFollowing = currentUser.getFollowing().contains(user.getId());
                return UserSearchResultDTO.builder()
                    .id(user.getId())
                    .username(user.getUsername())
                    .firstName(user.getFirstName())
                    .lastName(user.getLastName())
                    .fullName(user.getFullName())
                    .profilePicture(user.getProfilePicture())
                    .bio(user.getBio())
                    .isFollowing(isFollowing)
                    .build();
            })
            .collect(Collectors.toList());
            
        return ResponseEntity.ok(dtos);
    }
    
    // Follow a user - Modify to add notification and proper validation
    @PostMapping("/follow/{userId}")
    public ResponseEntity<?> followUser(@PathVariable String userId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUserEmail = authentication.getName();
        
        Optional<User> currentUserOpt = userRepository.findByEmail(currentUserEmail);
        Optional<User> targetUserOpt = userRepository.findById(userId);
        
        if (currentUserOpt.isEmpty() || targetUserOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }
        
        User currentUser = currentUserOpt.get();
        User targetUser = targetUserOpt.get();
        
        // Cannot follow yourself
        if (currentUser.getId().equals(targetUser.getId())) {
            return ResponseEntity.badRequest().body("Cannot follow yourself");
        }
        
        // Check if already following - don't allow duplicate follows
        if (currentUser.getFollowing().contains(targetUser.getId())) {
            return ResponseEntity.badRequest().body("Already following this user");
        }
        
        // Add to following set of current user
        currentUser.getFollowing().add(targetUser.getId());
        userRepository.save(currentUser);
        
        // Add to followers set of target user
        targetUser.getFollowers().add(currentUser.getId());
        userRepository.save(targetUser);
        
        // Create the notification with full name
        try {
            Notification notification = new Notification();
            notification.setUserId(targetUser.getId());
            notification.setSenderId(currentUser.getId());
            notification.setSenderUsername(currentUser.getUsername());
            notification.setSenderProfilePicture(currentUser.getProfilePicture());
            notification.setType("FOLLOW");
            
            // Use full name in the notification message
            String fullName = currentUser.getFirstName() != null && currentUser.getLastName() != null
                ? currentUser.getFirstName() + " " + currentUser.getLastName()
                : currentUser.getFirstName() != null
                    ? currentUser.getFirstName() 
                    : currentUser.getLastName() != null 
                        ? currentUser.getLastName() 
                        : currentUser.getUsername();
            
            notification.setMessage(fullName + " started following you");
            notification.setRead(false);
            notification.setCreatedAt(LocalDateTime.now());
            
            notificationRepository.save(notification);
            logger.info("Created follow notification for user: {}", targetUser.getId());
        } catch (Exception e) {
            logger.error("Failed to create notification", e);
            // Continue with the follow operation even if notification creation fails
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Now following " + targetUser.getUsername());
        
        return ResponseEntity.ok(response);
    }
    
    // Unfollow a user - Add proper validation
    @PostMapping("/unfollow/{userId}")
    public ResponseEntity<?> unfollowUser(@PathVariable String userId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUserEmail = authentication.getName();
        
        Optional<User> currentUserOpt = userRepository.findByEmail(currentUserEmail);
        Optional<User> targetUserOpt = userRepository.findById(userId);
        
        if (currentUserOpt.isEmpty() || targetUserOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }
        
        User currentUser = currentUserOpt.get();
        User targetUser = targetUserOpt.get();
        
        // Check if actually following before removing
        if (!currentUser.getFollowing().contains(targetUser.getId())) {
            return ResponseEntity.badRequest().body("You are not following this user");
        }
        
        // Remove from following set of current user
        currentUser.getFollowing().remove(targetUser.getId());
        userRepository.save(currentUser);
        
        // Remove from followers set of target user
        targetUser.getFollowers().remove(currentUser.getId());
        userRepository.save(targetUser);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "No longer following " + targetUser.getUsername());
        
        return ResponseEntity.ok(response);
    }
    
    // Get followers list with details
    @GetMapping("/followers/{userId}")
    public ResponseEntity<List<UserSearchResultDTO>> getFollowers(@PathVariable String userId) {
        logger.debug("Fetching followers for user ID: {}", userId);
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUserEmail = authentication.getName();
        Optional<User> currentUserOpt = userRepository.findByEmail(currentUserEmail);
        
        if (currentUserOpt.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        User currentUser = currentUserOpt.get();
        Optional<User> targetUserOpt = userRepository.findById(userId);
        
        if (targetUserOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        User targetUser = targetUserOpt.get();
        List<User> followers = new ArrayList<>();
        
        // Fetch all follower details
        for (String followerId : targetUser.getFollowers()) {
            userRepository.findById(followerId).ifPresent(followers::add);
        }
        
        List<UserSearchResultDTO> dtos = followers.stream()
            .map(user -> {
                boolean isFollowing = currentUser.getFollowing().contains(user.getId());
                return UserSearchResultDTO.builder()
                    .id(user.getId())
                    .username(user.getUsername())
                    .firstName(user.getFirstName())
                    .lastName(user.getLastName())
                    .fullName(user.getFullName())
                    .profilePicture(user.getProfilePicture())
                    .bio(user.getBio())
                    .isFollowing(isFollowing)
                    .build();
            })
            .collect(Collectors.toList());
            
        return ResponseEntity.ok(dtos);
    }

    // Get following list with details
    @GetMapping("/following/{userId}")
    public ResponseEntity<List<UserSearchResultDTO>> getFollowing(@PathVariable String userId) {
        logger.debug("Fetching following for user ID: {}", userId);
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUserEmail = authentication.getName();
        Optional<User> currentUserOpt = userRepository.findByEmail(currentUserEmail);
        
        if (currentUserOpt.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        User currentUser = currentUserOpt.get();
        Optional<User> targetUserOpt = userRepository.findById(userId);
        
        if (targetUserOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        User targetUser = targetUserOpt.get();
        List<User> following = new ArrayList<>();
        
        // Fetch all following details
        for (String followingId : targetUser.getFollowing()) {
            userRepository.findById(followingId).ifPresent(following::add);
        }
        
        List<UserSearchResultDTO> dtos = following.stream()
            .map(user -> {
                boolean isFollowing = currentUser.getFollowing().contains(user.getId());
                return UserSearchResultDTO.builder()
                    .id(user.getId())
                    .username(user.getUsername())
                    .firstName(user.getFirstName())
                    .lastName(user.getLastName())
                    .fullName(user.getFullName())
                    .profilePicture(user.getProfilePicture())
                    .bio(user.getBio())
                    .isFollowing(true) // They are all following since this is the following list
                    .build();
            })
            .collect(Collectors.toList());
            
        return ResponseEntity.ok(dtos);
    }
    
    // Get user's notifications
    @GetMapping("/notifications")
    public ResponseEntity<List<Notification>> getNotifications() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUserEmail = authentication.getName();
        
        Optional<User> currentUserOpt = userRepository.findByEmail(currentUserEmail);
        if (currentUserOpt.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        User currentUser = currentUserOpt.get();
        List<Notification> notifications = notificationRepository.findByUserIdOrderByCreatedAtDesc(currentUser.getId());
        
        return ResponseEntity.ok(notifications);
    }
    
    // Get unread notification count
    @GetMapping("/notifications/count")
    public ResponseEntity<Map<String, Long>> getUnreadNotificationCount() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUserEmail = authentication.getName();
        
        Optional<User> currentUserOpt = userRepository.findByEmail(currentUserEmail);
        if (currentUserOpt.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        User currentUser = currentUserOpt.get();
        long count = notificationRepository.countByUserIdAndRead(currentUser.getId(), false);
        
        Map<String, Long> response = new HashMap<>();
        response.put("count", count);
        
        return ResponseEntity.ok(response);
    }
    
    // Mark notifications as read
    @PostMapping("/notifications/mark-read")
    public ResponseEntity<?> markNotificationsAsRead(@RequestBody List<String> notificationIds) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUserEmail = authentication.getName();
        
        Optional<User> currentUserOpt = userRepository.findByEmail(currentUserEmail);
        if (currentUserOpt.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        User currentUser = currentUserOpt.get();
        
        List<Notification> notifications = notificationRepository.findAllById(notificationIds);
        for (Notification notification : notifications) {
            // Only allow marking notifications as read if they belong to the current user
            if (notification.getUserId().equals(currentUser.getId())) {
                notification.setRead(true);
                notificationRepository.save(notification);
            }
        }
        
        return ResponseEntity.ok().build();
    }
    
    // Mark all notifications as read
    @PostMapping("/notifications/mark-all-read")
    public ResponseEntity<?> markAllNotificationsAsRead() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUserEmail = authentication.getName();
        
        Optional<User> currentUserOpt = userRepository.findByEmail(currentUserEmail);
        if (currentUserOpt.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        User currentUser = currentUserOpt.get();
        
        List<Notification> notifications = notificationRepository.findByUserIdAndReadOrderByCreatedAtDesc(currentUser.getId(), false);
        for (Notification notification : notifications) {
            notification.setRead(true);
            notificationRepository.save(notification);
        }
        
        return ResponseEntity.ok().build();
    }
    
    // Clear all notifications
    @DeleteMapping("/notifications/clear-all")
    public ResponseEntity<?> clearAllNotifications() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUserEmail = authentication.getName();
        
        Optional<User> currentUserOpt = userRepository.findByEmail(currentUserEmail);
        if (currentUserOpt.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        User currentUser = currentUserOpt.get();
        
        List<Notification> notifications = notificationRepository.findByUserIdOrderByCreatedAtDesc(currentUser.getId());
        notificationRepository.deleteAll(notifications);
        
        return ResponseEntity.ok().build();
    }
    
    // Add this new endpoint to get a user by ID
    @GetMapping("/{userId}")
    public ResponseEntity<UserSearchResultDTO> getUserById(@PathVariable String userId) {
        logger.debug("Fetching user by ID: {}", userId);
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUserEmail = authentication.getName();
        Optional<User> currentUserOpt = userRepository.findByEmail(currentUserEmail);
        
        if (currentUserOpt.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        User currentUser = currentUserOpt.get();
        Optional<User> targetUserOpt = userRepository.findById(userId);
        
        if (targetUserOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        User targetUser = targetUserOpt.get();
        boolean isFollowing = currentUser.getFollowing().contains(targetUser.getId());
        
        UserSearchResultDTO dto = UserSearchResultDTO.builder()
            .id(targetUser.getId())
            .username(targetUser.getUsername())
            .firstName(targetUser.getFirstName())
            .lastName(targetUser.getLastName())
            .fullName(targetUser.getFullName())
            .profilePicture(targetUser.getProfilePicture())
            .bio(targetUser.getBio())
            .isFollowing(isFollowing)
            .build();
            
        return ResponseEntity.ok(dto);
    }
}
