package com.skillsharing.controller;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
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

import com.skillsharing.dto.PostRequestDTO;
import com.skillsharing.dto.SharePostDTO;
import com.skillsharing.model.Notification;
import com.skillsharing.model.Post;
import com.skillsharing.model.User;
import com.skillsharing.repository.NotificationRepository;
import com.skillsharing.repository.PostRepository;
import com.skillsharing.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/posts")
@RequiredArgsConstructor
public class PostController {
    private static final Logger logger = LoggerFactory.getLogger(PostController.class);
    
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;
    
    @PostMapping
    public ResponseEntity<Post> createPost(@RequestBody PostRequestDTO request) {
        logger.info("Creating post with content: {}", request.getContent());
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        
        User currentUser = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        Post post = Post.builder()
            .authorId(currentUser.getId())
            .authorUsername(currentUser.getUsername())
            .authorFirstName(currentUser.getFirstName())
            .authorLastName(currentUser.getLastName())
            .authorProfilePicture(currentUser.getProfilePicture())
            .content(request.getContent())
            .mediaUrl(request.getMediaUrl())
            .mediaType(request.getMediaType())
            .createdAt(LocalDateTime.now())
            .updatedAt(LocalDateTime.now())
            .build();
        
        Post savedPost = postRepository.save(post);
        logger.info("Post created: {}", savedPost.getId());
        
        return ResponseEntity.ok(savedPost);
    }
    
    @GetMapping
    public ResponseEntity<List<Post>> getFeedPosts() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        
        User currentUser = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Get posts from users that current user follows, plus their own posts
        Set<String> followingIds = new HashSet<>(currentUser.getFollowing());
        followingIds.add(currentUser.getId()); // Include own posts
        
        List<Post> posts = postRepository.findByAuthorIdIn(
            new ArrayList<>(followingIds),
            Sort.by(Sort.Direction.DESC, "createdAt")
        );
        
        return ResponseEntity.ok(posts);
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Post>> getUserPosts(@PathVariable String userId) {
        logger.info("Fetching posts for user: {}", userId);
        List<Post> posts = postRepository.findByAuthorId(
            userId,
            Sort.by(Sort.Direction.DESC, "createdAt")
        );
        
        return ResponseEntity.ok(posts);
    }
    
    @GetMapping("/{postId}")
    public ResponseEntity<Post> getPostById(@PathVariable String postId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        try {
            Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
            
            return ResponseEntity.ok(post);
        } catch (Exception e) {
            logger.error("Error fetching post by ID: {}", postId, e);
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/detail/{postId}")
    public ResponseEntity<Post> getPost(@PathVariable String postId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        try {
            Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
            
            return ResponseEntity.ok(post);
        } catch (Exception e) {
            logger.error("Error fetching post by ID: {}", postId, e);
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{postId}")
    public ResponseEntity<?> deletePost(@PathVariable String postId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        
        User currentUser = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        Post post = postRepository.findById(postId)
            .orElseThrow(() -> new RuntimeException("Post not found"));
        
        // Check if current user is the author of the post
        if (!post.getAuthorId().equals(currentUser.getId())) {
            return ResponseEntity.status(403).body("You are not authorized to delete this post");
        }
        
        // Delete any share posts if this is an original post
        if (post.getOriginalPostId() == null) {
            // This is an original post - find and delete all shares of this post
            List<Post> sharedPosts = postRepository.findByOriginalPostId(postId);
            if (!sharedPosts.isEmpty()) {
                postRepository.deleteAll(sharedPosts);
                logger.info("Deleted {} shared posts for original post: {}", sharedPosts.size(), postId);
            }
        }
        
        // Delete the post itself
        postRepository.delete(post);
        logger.info("Post deleted: {}", postId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Post deleted successfully");
        return ResponseEntity.ok(response);
    }
    
    /**
     * Delete a comment from a post
     * Authorization: Only the comment author or post author can delete a comment
     */
    @DeleteMapping("/{postId}/comments/{commentId}")
    public ResponseEntity<?> deleteComment(@PathVariable String postId, @PathVariable String commentId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        
        User currentUser = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        Post post = postRepository.findById(postId)
            .orElseThrow(() -> new RuntimeException("Post not found"));
        
        // Find the comment to delete
        Optional<Post.Comment> commentOpt = post.getComments().stream()
            .filter(c -> c.getId().equals(commentId))
            .findFirst();
        
        if (commentOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Post.Comment comment = commentOpt.get();
        
        // Check if current user is authorized to delete this comment
        // (either they are the comment author or the post author)
        if (!comment.getUserId().equals(currentUser.getId()) && !post.getAuthorId().equals(currentUser.getId())) {
            return ResponseEntity.status(403).body("You are not authorized to delete this comment");
        }
        
        // Remove the comment
        List<Post.Comment> comments = new ArrayList<>(post.getComments());
        comments.removeIf(c -> c.getId().equals(commentId));
        post.setComments(comments);
        
        // Save the updated post
        Post updatedPost = postRepository.save(post);
        logger.info("Comment {} deleted from post: {}", commentId, postId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Comment deleted successfully");
        response.put("post", updatedPost);
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Edit a comment on a post
     */
    @PutMapping("/{postId}/comments/{commentId}")
    public ResponseEntity<?> editComment(
            @PathVariable String postId,
            @PathVariable String commentId,
            @RequestBody Map<String, String> commentData) {
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Optional<Post> postOpt = postRepository.findById(postId);
        
        if (postOpt.isEmpty()) {
            logger.warn("Attempt to edit comment on non-existent post: {}", postId);
            return ResponseEntity.notFound().build();
        }
        
        Post post = postOpt.get();
        
        // Find the comment to edit
        Optional<Post.Comment> commentOpt = post.getComments().stream()
                .filter(c -> c.getId().equals(commentId))
                .findFirst();
                
        if (commentOpt.isEmpty()) {
            logger.warn("Attempt to edit non-existent comment: {}", commentId);
            return ResponseEntity.notFound().build();
        }
        
        Post.Comment comment = commentOpt.get();
        
        // Verify that the current user is the author of the comment
        if (!comment.getUserId().equals(currentUser.getId())) {
            logger.warn("User {} attempted to edit comment {} created by {}", 
                    currentUser.getId(), commentId, comment.getUserId());
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "You are not authorized to edit this comment");
            return ResponseEntity.status(403).body(errorResponse);
        }
        
        // Update the comment content
        String newContent = commentData.get("content");
        if (newContent == null || newContent.trim().isEmpty()) {
            logger.warn("Attempt to update comment with empty content");
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Comment content cannot be empty");
            return ResponseEntity.badRequest().body(errorResponse);
        }
        
        // Create a new list of comments to avoid modification issues
        List<Post.Comment> updatedComments = new ArrayList<>();
        
        for (Post.Comment c : post.getComments()) {
            if (c.getId().equals(commentId)) {
                // Create a new comment with updated values to ensure proper modification
                Post.Comment updatedComment = Post.Comment.builder()
                    .id(c.getId())
                    .userId(c.getUserId())
                    .username(c.getUsername())
                    .userProfilePicture(c.getUserProfilePicture())
                    .content(newContent)
                    .createdAt(c.getCreatedAt())
                    .updatedAt(LocalDateTime.now())
                    .edited(true)
                    .build();
                updatedComments.add(updatedComment);
            } else {
                updatedComments.add(c);
            }
        }
        
        post.setComments(updatedComments);
        
        Post updatedPost = postRepository.save(post);
        logger.info("Comment {} updated successfully for post {}", commentId, postId);
        
        // Create response with updated post
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Comment updated successfully");
        response.put("post", updatedPost);
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Add a comment to a post
     */
    @PostMapping("/{postId}/comments")
    public ResponseEntity<?> addComment(
            @PathVariable String postId,
            @RequestBody Map<String, String> commentData) {
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Optional<Post> postOpt = postRepository.findById(postId);
        
        if (postOpt.isEmpty()) {
            logger.warn("Attempt to comment on non-existent post: {}", postId);
            return ResponseEntity.notFound().build();
        }
        
        Post post = postOpt.get();
        
        String content = commentData.get("content");
        if (content == null || content.trim().isEmpty()) {
            logger.warn("Attempt to add empty comment");
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Comment content cannot be empty");
            return ResponseEntity.badRequest().body(errorResponse);
        }
        
        Post.Comment comment = Post.Comment.builder()
            .id(UUID.randomUUID().toString())
            .userId(currentUser.getId())
            .username(currentUser.getUsername())
            .userProfilePicture(currentUser.getProfilePicture())
            .content(content)
            .createdAt(LocalDateTime.now())
            .updatedAt(LocalDateTime.now()) // Initialize updatedAt when creating
            .edited(false)  // Initialize edited flag as false
            .build();
        
        if (post.getComments() == null) {
            post.setComments(new ArrayList<>());
        }
        
        post.getComments().add(comment);
        Post updatedPost = postRepository.save(post);
        
        // Create notification if this isn't the user's own post
        if (!post.getAuthorId().equals(currentUser.getId())) {
            try {
                Notification notification = new Notification();
                notification.setUserId(post.getAuthorId());
                notification.setSenderId(currentUser.getId());
                notification.setSenderUsername(currentUser.getUsername());
                notification.setSenderProfilePicture(currentUser.getProfilePicture());
                notification.setType("COMMENT");
                notification.setResourceId(post.getId());
                
                // Use full name in notification message
                String commenterName = currentUser.getFirstName() != null && currentUser.getLastName() != null
                    ? currentUser.getFirstName() + " " + currentUser.getLastName()
                    : currentUser.getUsername();
                
                notification.setMessage(commenterName + " commented on your post");
                notification.setRead(false);
                notification.setCreatedAt(LocalDateTime.now());
                
                notificationRepository.save(notification);
            } catch (Exception e) {
                // Log but don't fail the comment if notification fails
                logger.error("Failed to create notification for comment", e);
            }
        }
        
        // Create response with updated post
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Comment added successfully");
        response.put("post", updatedPost);
        
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/{postId}/like")
    public ResponseEntity<?> likePost(@PathVariable String postId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        
        User currentUser = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        Post post = postRepository.findById(postId)
            .orElseThrow(() -> new RuntimeException("Post not found"));
        
        Set<String> likes = post.getLikes();
        String userId = currentUser.getId();
        
        boolean liked = false;
        
        // Toggle like status
        if (likes.contains(userId)) {
            likes.remove(userId);
        } else {
            likes.add(userId);
            liked = true;
            
            // Only create notification if the user is liking the post (not unliking)
            // and if they're not liking their own post
            if (liked && !post.getAuthorId().equals(currentUser.getId())) {
                try {
                    Notification notification = new Notification();
                    notification.setUserId(post.getAuthorId());
                    notification.setSenderId(currentUser.getId());
                    notification.setSenderUsername(currentUser.getUsername());
                    notification.setSenderProfilePicture(currentUser.getProfilePicture());
                    notification.setType("LIKE");
                    notification.setResourceId(postId);
                    
                    // Use full name in the notification message
                    String fullName = currentUser.getFirstName() != null && currentUser.getLastName() != null
                        ? currentUser.getFirstName() + " " + currentUser.getLastName()
                        : currentUser.getFirstName() != null
                            ? currentUser.getFirstName() 
                            : currentUser.getLastName() != null 
                                ? currentUser.getLastName() 
                                : currentUser.getUsername();
                    
                    notification.setMessage(fullName + " liked your post");
                    notification.setRead(false);
                    notification.setCreatedAt(LocalDateTime.now());
                    
                    notificationRepository.save(notification);
                    logger.info("Created like notification for user: {}", post.getAuthorId());
                } catch (Exception e) {
                    logger.error("Failed to create notification", e);
                    // Continue with the like operation even if notification creation fails
                }
            }
        }
        
        post.setLikes(likes);
        Post updatedPost = postRepository.save(post);
        
        Map<String, Object> response = new HashMap<>();
        response.put("liked", liked);
        response.put("likeCount", likes.size());
        
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/{postId}/comment")
    public ResponseEntity<Post> addCommentToPost(@PathVariable String postId, @RequestBody Map<String, String> request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        
        User currentUser = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        Post post = postRepository.findById(postId)
            .orElseThrow(() -> new RuntimeException("Post not found"));
        
        String content = request.get("content");
        if (content == null || content.trim().isEmpty()) {
            throw new RuntimeException("Comment content cannot be empty");
        }
        
        Post.Comment comment = Post.Comment.builder()
            .id(UUID.randomUUID().toString())
            .userId(currentUser.getId())
            .username(currentUser.getUsername())
            .userProfilePicture(currentUser.getProfilePicture())
            .content(content)
            .createdAt(LocalDateTime.now())
            .build();
        
        List<Post.Comment> comments = post.getComments();
        comments.add(comment);
        post.setComments(comments);
        
        Post updatedPost = postRepository.save(post);
        logger.info("Comment added to post: {}", postId);
        
        // Create a notification for the post author (if the commenter is not the author)
        if (!post.getAuthorId().equals(currentUser.getId())) {
            try {
                Notification notification = new Notification();
                notification.setUserId(post.getAuthorId());
                notification.setSenderId(currentUser.getId());
                notification.setSenderUsername(currentUser.getUsername());
                notification.setSenderProfilePicture(currentUser.getProfilePicture());
                notification.setType("COMMENT");
                notification.setResourceId(postId);
                
                String fullName = currentUser.getFirstName() != null && currentUser.getLastName() != null
                    ? currentUser.getFirstName() + " " + currentUser.getLastName()
                    : currentUser.getFirstName() != null
                        ? currentUser.getFirstName() 
                        : currentUser.getLastName() != null 
                            ? currentUser.getLastName() 
                            : currentUser.getUsername();
                
                notification.setMessage(fullName + " commented on your post");
                notification.setRead(false);
                notification.setCreatedAt(LocalDateTime.now());
                
                notificationRepository.save(notification);
                logger.info("Created comment notification for user: {}", post.getAuthorId());
            } catch (Exception e) {
                logger.error("Failed to create notification", e);
                // Continue with the comment operation even if notification creation fails
            }
        }
        
        return ResponseEntity.ok(updatedPost);
    }
    
    @PostMapping("/{postId}/share")
    public ResponseEntity<?> sharePost(@PathVariable String postId, @RequestBody(required = false) SharePostDTO sharePostDTO) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();
            
            User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
            
            Post originalPost = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
            
            // If no DTO provided, create an empty one
            if (sharePostDTO == null) {
                sharePostDTO = new SharePostDTO();
            }
            
            // Create a new post as a share
            Post sharedPost = new Post();
            sharedPost.setAuthorId(currentUser.getId());
            sharedPost.setAuthorUsername(currentUser.getUsername());
            sharedPost.setAuthorFirstName(currentUser.getFirstName());
            sharedPost.setAuthorLastName(currentUser.getLastName());
            sharedPost.setAuthorProfilePicture(currentUser.getProfilePicture());
            sharedPost.setContent(originalPost.getContent());
            sharedPost.setMediaUrl(originalPost.getMediaUrl());
            sharedPost.setMediaType(originalPost.getMediaType());
            sharedPost.setOriginalPostId(originalPost.getId());
            sharedPost.setShareMessage(sharePostDTO.getShareMessage());
            sharedPost.setCreatedAt(LocalDateTime.now());
            sharedPost.setUpdatedAt(LocalDateTime.now());
            sharedPost.setLikes(new HashSet<>());
            
            Post savedPost = postRepository.save(sharedPost);
            
            // Update share count on the original post
            if (originalPost.getShares() == null) {
                originalPost.setShares(new HashSet<>());
            }
            originalPost.getShares().add(currentUser.getId());
            postRepository.save(originalPost);
            
            // Send notification
            if (!originalPost.getAuthorId().equals(currentUser.getId())) {
                try {
                    Notification notification = new Notification();
                    notification.setUserId(originalPost.getAuthorId());
                    notification.setSenderId(currentUser.getId());
                    notification.setSenderUsername(currentUser.getUsername());
                    notification.setSenderProfilePicture(currentUser.getProfilePicture());
                    notification.setType("SHARE");
                    notification.setResourceId(originalPost.getId());
                    
                    String fullName = currentUser.getFirstName() != null && currentUser.getLastName() != null
                        ? currentUser.getFirstName() + " " + currentUser.getLastName()
                        : currentUser.getFirstName() != null
                            ? currentUser.getFirstName() 
                            : currentUser.getLastName() != null 
                                ? currentUser.getLastName() 
                                : currentUser.getUsername();
                    
                    notification.setMessage(fullName + " shared your post");
                    notification.setRead(false);
                    notification.setCreatedAt(LocalDateTime.now());
                    
                    notificationRepository.save(notification);
                    logger.info("Created share notification for user: {}", originalPost.getAuthorId());
                } catch (Exception e) {
                    logger.error("Failed to create notification", e);
                    // Continue with the share operation even if notification creation fails
                }
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("post", savedPost);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error sharing post: ", e);
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    /**
     * Edit a post
     */
    @PutMapping("/{postId}")
    public ResponseEntity<?> editPost(
            @PathVariable String postId,
            @RequestBody Map<String, Object> postData) {
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Optional<Post> postOptional = postRepository.findById(postId);
        
        if (postOptional.isEmpty()) {
            logger.warn("Attempt to edit non-existent post: {}", postId);
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Post not found");
            return ResponseEntity.status(404).body(errorResponse);
        }
        
        Post post = postOptional.get();
        
        // Verify that the current user is the author of the post
        if (!post.getAuthorId().equals(currentUser.getId())) {
            logger.warn("User {} attempted to edit post {} created by {}", 
                    currentUser.getId(), postId, post.getAuthorId());
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "You are not authorized to edit this post");
            return ResponseEntity.status(403).body(errorResponse);
        }
        
        // Update the post content
        String newContent = (String) postData.get("content");
        if (newContent == null || newContent.trim().isEmpty()) {
            logger.warn("Attempt to update post with empty content");
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Post content cannot be empty");
            return ResponseEntity.badRequest().body(errorResponse);
        }
        
        post.setContent(newContent);
        
        // Update media if provided
        if (postData.containsKey("mediaUrl")) {
            post.setMediaUrl((String) postData.get("mediaUrl"));
            post.setMediaType((String) postData.get("mediaType"));
        }
        
        // Mark as edited and update timestamp
        post.setEdited(true);
        post.setUpdatedAt(LocalDateTime.now());
        
        Post updatedPost = postRepository.save(post);
        logger.info("Post {} updated by user {}", postId, currentUser.getId());
        
        return ResponseEntity.ok(updatedPost);
    }
}
