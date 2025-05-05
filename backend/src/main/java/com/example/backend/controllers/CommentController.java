package com.example.backend.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.backend.models.Comment;
import com.example.backend.models.Recipe;
import com.example.backend.models.User;
import com.example.backend.repositories.CommentRepository;
import com.example.backend.repositories.UserRepository;
import com.example.backend.repositories.RecipeRepository;
import com.example.backend.services.NotificationService;
import java.util.List;
import java.util.Optional;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import java.time.LocalDateTime;
import java.util.ArrayList;

/**
 * CommentController handles HTTP requests related to comments.
 */
@RestController
@RequestMapping("/api/comments")
public class CommentController {
    private final CommentRepository commentRepository;
    private final UserRepository userRepository;
    private final RecipeRepository recipeRepository;
    private final NotificationService notificationService;
    
    @Autowired
    private MongoTemplate mongoTemplate;

    public CommentController(CommentRepository commentRepository, UserRepository userRepository, 
                            RecipeRepository recipeRepository, NotificationService notificationService) {
        this.commentRepository = commentRepository;
        this.userRepository = userRepository;
        this.recipeRepository = recipeRepository;
        this.notificationService = notificationService;
    }

    // POST: Create a new Comment
    @PostMapping
    public ResponseEntity<Comment> createComment(@RequestBody Comment comment, @RequestParam String userId) {
        // Validate user
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Set user and save comment
        comment.setAuthor(user);
        Comment savedComment = commentRepository.save(comment);
        
        // Send notification to recipe author if this is a comment on a recipe
        if (comment.getPost() != null) {
            Recipe recipe = recipeRepository.findById(comment.getPost().getId())
                .orElse(null);
            
            if (recipe != null) {
                notificationService.notifyRecipeCommented(recipe, user, comment.getContent());
            }
        }
        
        return ResponseEntity.status(HttpStatus.CREATED).body(savedComment);
    }

    // GET: Retrieve all Comments with User details populated
    @GetMapping
    public List<Comment> getAllComments() {
        return commentRepository.findAll();
    }

    // GET: Retrieve a Comment by ID
    @GetMapping("/{id}")
    public ResponseEntity<Comment> getCommentById(@PathVariable String id) {
        Optional<Comment> comment = commentRepository.findById(id);
        return comment.map(ResponseEntity::ok)
                      .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // PUT: Update a Comment by ID
    @PutMapping("/{id}")
    public ResponseEntity<Comment> updateComment(
        @PathVariable String id,
        @RequestBody Comment commentDetails,
        @RequestParam String userId
    ) {
        return commentRepository.findById(id)
            .map(comment -> {
                // Only allow the comment author to edit
                if (!comment.getAuthor().getId().equals(userId)) {
                    return new ResponseEntity<Comment>(HttpStatus.FORBIDDEN);
                }
                
                // Update comment text
                comment.setContent(commentDetails.getContent());
                
                // Save and return updated comment
                Comment updatedComment = commentRepository.save(comment);
                return ResponseEntity.ok(updatedComment);
            })
            .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // DELETE: Delete a Comment by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteComment(
        @PathVariable String id, 
        @RequestParam String userId
    ) {
        return commentRepository.findById(id)
            .map(comment -> {
                // Check if the user is the comment author or the recipe owner
                Recipe recipe = recipeRepository.findById(comment.getPost().getId())
                    .orElse(null);
                
                if (comment.getAuthor() != null && comment.getAuthor().getId().equals(userId) || 
                    (recipe != null && recipe.getAuthor() != null && recipe.getAuthor().getId().equals(userId))) {
                    
                    commentRepository.delete(comment);
                    return ResponseEntity.ok().build();
                } else {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("You don't have permission to delete this comment");
                }
            })
            .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // GET: Retrieve Comments by Recipe ID
    @GetMapping("/recipe/{recipeId}")
    public List<Comment> getCommentsByRecipeId(@PathVariable String recipeId) {
        Query query = new Query(Criteria.where("post.$id").is(recipeId));
        return mongoTemplate.find(query, Comment.class);
    }

    // POST: Create a new Comment reply
    @PostMapping("/reply")
    public ResponseEntity<Comment> createReply(@RequestBody Comment reply, @RequestParam String userId, @RequestParam String parentId) {
        try {
            Optional<Comment> parentComment = commentRepository.findById(parentId);
            if (parentComment.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Optional<User> userOpt = userRepository.findById(userId);
            if (userOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            User user = userOpt.get();

            // Set parent comment
            reply.setParent(parentComment.get());
            
            // Set author
            reply.setAuthor(user);
            
            // Set post (same as parent)
            reply.setPost(parentComment.get().getPost());
            
            // Set timestamps
            LocalDateTime now = LocalDateTime.now();
            reply.setCreatedAt(now);
            reply.setUpdatedAt(now);
            
            // Save the reply
            Comment savedReply = commentRepository.save(reply);
            
            // Add reply to parent's replies list
            Comment parent = parentComment.get();
            if (parent.getReplies() == null) {
                parent.setReplies(new ArrayList<>());
            }
            parent.getReplies().add(savedReply);
            commentRepository.save(parent);
            
            // Send notification to parent comment author
            User parentAuthor = parent.getAuthor();
            if (parentAuthor != null && !parentAuthor.getId().equals(userId)) {
                notificationService.notifyCommentReplied(parent, savedReply, user);
            }
            
            return ResponseEntity.ok(savedReply);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
