package com.example.backend.api;

import com.example.backend.models.Comment;
import com.example.backend.models.Recipe;
import com.example.backend.models.User;
import com.example.backend.repositories.CommentRepository;
import com.example.backend.repositories.RecipeRepository;
import com.example.backend.repositories.UserRepository;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/legacy/comments")
public class LegacyCommentController {

    private final CommentRepository commentRepository;
    private final RecipeRepository recipeRepository;
    private final UserRepository userRepository;

    public LegacyCommentController(CommentRepository commentRepository, 
                           RecipeRepository recipeRepository,
                           UserRepository userRepository) {
        this.commentRepository = commentRepository;
        this.recipeRepository = recipeRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<Comment>> getAllComments() {
        List<Comment> comments = commentRepository.findAll();
        return new ResponseEntity<>(comments, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Comment> getCommentById(@PathVariable String id) {
        Optional<Comment> comment = commentRepository.findById(id);
        return comment.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/recipe/{recipeId}")
    public ResponseEntity<List<Comment>> getCommentsByRecipe(@PathVariable String recipeId) {
        try {
            // Fetch comments for the recipe
            List<Comment> comments = commentRepository.findByPostId(recipeId);
            
            // Sort comments by creation date (newest first)
            comments.sort((c1, c2) -> c2.getCreatedAt().compareTo(c1.getCreatedAt()));
            
            return new ResponseEntity<>(comments, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Comment>> getCommentsByUser(@PathVariable String userId) {
        List<Comment> comments = commentRepository.findByAuthorId(userId);
        return new ResponseEntity<>(comments, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Comment> createComment(@RequestBody Map<String, Object> commentData) {
        try {
            String content = (String) commentData.get("content");
            String recipeId = (String) commentData.get("recipeId");
            String userId = (String) commentData.get("userId");
            String parentId = (String) commentData.get("parentId");
            
            // Validate required fields
            if (content == null || content.trim().isEmpty()) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
            
            if (recipeId == null || userId == null) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
            
            Optional<Recipe> recipeOptional = recipeRepository.findById(recipeId);
            Optional<User> userOptional = userRepository.findById(userId);
            
            if (recipeOptional.isPresent() && userOptional.isPresent()) {
                Recipe recipe = recipeOptional.get();
                User user = userOptional.get();
                
                Comment comment = new Comment();
                comment.setContent(content);
                comment.setPost(recipe);
                comment.setAuthor(user);
                comment.setCreatedAt(LocalDateTime.now());
                
                // Handle parent comment for replies
                if (parentId != null && !parentId.isEmpty()) {
                    Optional<Comment> parentComment = commentRepository.findById(parentId);
                    if (parentComment.isPresent()) {
                        comment.setParent(parentComment.get());
                        
                        // Add this comment to parent's replies list
                        Comment parent = parentComment.get();
                        if (parent.getReplies() == null) {
                            parent.setReplies(new ArrayList<>());
                        }
                        parent.getReplies().add(comment);
                        commentRepository.save(parent);
                    }
                }
                
                Comment savedComment = commentRepository.save(comment);
                return new ResponseEntity<>(savedComment, HttpStatus.CREATED);
            } else {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Comment> updateComment(@PathVariable String id, @RequestBody Map<String, String> updates) {
        Optional<Comment> commentOptional = commentRepository.findById(id);
        
        if (commentOptional.isPresent()) {
            Comment comment = commentOptional.get();
            
            if (updates.containsKey("content")) {
                comment.setContent(updates.get("content"));
            }
            
            Comment updatedComment = commentRepository.save(comment);
            return new ResponseEntity<>(updatedComment, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComment(@PathVariable String id) {
        if (commentRepository.existsById(id)) {
            commentRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    
    // Endpoint for posting a reply to a comment
    @PostMapping("/{commentId}/replies")
    public ResponseEntity<Comment> addReply(
            @PathVariable String commentId,
            @RequestBody Map<String, Object> replyData) {
        try {
            String content = (String) replyData.get("content");
            String userId = (String) replyData.get("userId");
            
            if (content == null || content.trim().isEmpty() || userId == null) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
            
            Optional<Comment> parentCommentOpt = commentRepository.findById(commentId);
            Optional<User> userOpt = userRepository.findById(userId);
            
            if (parentCommentOpt.isPresent() && userOpt.isPresent()) {
                Comment parentComment = parentCommentOpt.get();
                User user = userOpt.get();
                
                Comment reply = new Comment();
                reply.setContent(content);
                reply.setAuthor(user);
                reply.setCreatedAt(LocalDateTime.now());
                reply.setParent(parentComment);
                reply.setPost(parentComment.getPost()); // Set the same post as parent
                
                Comment savedReply = commentRepository.save(reply);
                
                // Add reply to parent's replies list
                if (parentComment.getReplies() == null) {
                    parentComment.setReplies(new ArrayList<>());
                }
                parentComment.getReplies().add(savedReply);
                commentRepository.save(parentComment);
                
                return new ResponseEntity<>(savedReply, HttpStatus.CREATED);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // Endpoint for getting replies to a comment
    @GetMapping("/{commentId}/replies")
    public ResponseEntity<List<Comment>> getReplies(@PathVariable String commentId) {
        try {
            List<Comment> replies = commentRepository.findByParentId(commentId);
            return new ResponseEntity<>(replies, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // Specialized endpoint for recipe comments in the format expected by RecipeComments.tsx
    @GetMapping("/recipes/{recipeId}/comments")
    public ResponseEntity<List<Map<String, Object>>> getFormattedRecipeComments(@PathVariable String recipeId) {
        try {
            // Get top-level comments (no parent)
            List<Comment> topLevelComments = commentRepository.findTopLevelCommentsByPostId(recipeId);
            
            // Sort by creation date (newest first)
            topLevelComments.sort((c1, c2) -> c2.getCreatedAt().compareTo(c1.getCreatedAt()));
            
            // Format comments as expected by the frontend
            List<Map<String, Object>> formattedComments = new ArrayList<>();
            
            for (Comment comment : topLevelComments) {
                Map<String, Object> formattedComment = formatCommentForFrontend(comment);
                formattedComments.add(formattedComment);
            }
            
            return new ResponseEntity<>(formattedComments, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // Helper method to format a comment for the frontend
    private Map<String, Object> formatCommentForFrontend(Comment comment) {
        Map<String, Object> formatted = new HashMap<>();
        formatted.put("id", comment.getId());
        formatted.put("content", comment.getContent());
        formatted.put("date", comment.getCreatedAt().toString());
        formatted.put("likes", 0); // In a real implementation, you would count likes
        formatted.put("isLiked", false); // In a real implementation, this would be determined by the user
        
        // Format author
        Map<String, Object> author = new HashMap<>();
        if (comment.getAuthor() != null) {
            author.put("id", comment.getAuthor().getId());
            author.put("name", comment.getAuthor().getUsername() != null ? 
                    comment.getAuthor().getUsername() : "Anonymous");
            author.put("avatar", comment.getAuthor().getProfileImage() != null ? 
                    comment.getAuthor().getProfileImage() : "https://ui-avatars.com/api/?name=User&background=random");
        } else {
            author.put("id", "unknown");
            author.put("name", "Anonymous");
            author.put("avatar", "https://ui-avatars.com/api/?name=Anonymous&background=random");
        }
        formatted.put("author", author);
        
        // Format replies
        List<Map<String, Object>> formattedReplies = new ArrayList<>();
        if (comment.getReplies() != null) {
            for (Comment reply : comment.getReplies()) {
                formattedReplies.add(formatCommentForFrontend(reply));
            }
        }
        formatted.put("replies", formattedReplies);
        
        return formatted;
    }
    
    // Endpoint for liking a comment
    @PostMapping("/{commentId}/like")
    public ResponseEntity<Map<String, Object>> likeComment(
            @PathVariable String commentId,
            @RequestBody Map<String, String> likeData) {
        try {
            String userId = likeData.get("userId");
            
            if (userId == null) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
            
            Optional<Comment> commentOpt = commentRepository.findById(commentId);
            Optional<User> userOpt = userRepository.findById(userId);
            
            if (commentOpt.isPresent() && userOpt.isPresent()) {
                // In a real implementation, you would have a CommentLike entity and repository
                // For simplicity, we'll just return a success response
                Map<String, Object> response = Map.of(
                    "success", true,
                    "commentId", commentId,
                    "userId", userId
                );
                
                return new ResponseEntity<>(response, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // Endpoint for unliking a comment
    @DeleteMapping("/{commentId}/like")
    public ResponseEntity<Map<String, Object>> unlikeComment(
            @PathVariable String commentId,
            @RequestBody Map<String, String> unlikeData) {
        try {
            String userId = unlikeData.get("userId");
            
            if (userId == null) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
            
            Optional<Comment> commentOpt = commentRepository.findById(commentId);
            Optional<User> userOpt = userRepository.findById(userId);
            
            if (commentOpt.isPresent() && userOpt.isPresent()) {
                // In a real implementation, you would delete the CommentLike entity
                // For simplicity, we'll just return a success response
                Map<String, Object> response = Map.of(
                    "success", true,
                    "commentId", commentId,
                    "userId", userId
                );
                
                return new ResponseEntity<>(response, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
