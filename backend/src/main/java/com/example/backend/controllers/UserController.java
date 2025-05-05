package com.example.backend.controllers;

import com.example.backend.models.UserProfile;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;
import com.example.backend.models.User;
import com.example.backend.repositories.UserRepository;
import org.springframework.http.ResponseEntity;
import com.example.backend.services.NotificationService;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private NotificationService notificationService;

    // Create a new user
    @PostMapping("/create")
    public User createUser(@RequestBody User user) {
        return userRepository.save(user);
    }

    // Retrieve all users
    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Retrieve a user by ID
    @GetMapping("/{id}")
    public Optional<User> getUserById(@PathVariable String id) {
        return userRepository.findById(id);
    }

    // Follow a user
    @PostMapping("/{id}/follow")
    public ResponseEntity<?> followUser(@PathVariable String id, @RequestParam String followerId) {
        try {
            Optional<User> userToFollowOpt = userRepository.findById(id);
            Optional<User> followerOpt = userRepository.findById(followerId);
            
            if (userToFollowOpt.isEmpty() || followerOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            User userToFollow = userToFollowOpt.get();
            User follower = followerOpt.get();
            
            // Check if already following
            if (userToFollow.getFollowers().contains(follower)) {
                return ResponseEntity.badRequest().body("Already following this user");
            }
            
            // Add to followers/following
            userToFollow.getFollowers().add(follower);
            follower.getFollowing().add(userToFollow);
            
            // Save both users
            userRepository.save(userToFollow);
            userRepository.save(follower);
            
            // Send notification
            notificationService.notifyUserFollowed(userToFollow, follower);
            
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error following user: " + e.getMessage());
        }
    }
    
    // Unfollow a user
    @PostMapping("/{id}/unfollow")
    public ResponseEntity<?> unfollowUser(@PathVariable String id, @RequestParam String followerId) {
        try {
            Optional<User> userToUnfollowOpt = userRepository.findById(id);
            Optional<User> followerOpt = userRepository.findById(followerId);
            
            if (userToUnfollowOpt.isEmpty() || followerOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            User userToUnfollow = userToUnfollowOpt.get();
            User follower = followerOpt.get();
            
            // Check if not following
            if (!userToUnfollow.getFollowers().contains(follower)) {
                return ResponseEntity.badRequest().body("Not following this user");
            }
            
            // Remove from followers/following
            userToUnfollow.getFollowers().remove(follower);
            follower.getFollowing().remove(userToUnfollow);
            
            // Save both users
            userRepository.save(userToUnfollow);
            userRepository.save(follower);
            
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error unfollowing user: " + e.getMessage());
        }
    }

    // Delete a user by ID
    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable String id) {
        userRepository.deleteById(id);
    }

    @GetMapping("/exists/{username}")
    public ResponseEntity<Boolean> checkIfUserExists(@PathVariable String username) {
        boolean userExists = userRepository.existsByUsername(username);
        return ResponseEntity.ok(userExists);
    }
}
