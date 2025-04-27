package com.example.backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.backend.models.Comment;
import com.example.backend.models.Recipe;
import com.example.backend.models.User;
import com.example.backend.repositories.CommentRepository;
import com.example.backend.repositories.UserRepository;
import com.example.backend.repositories.RecipeRepository;
import java.util.List;
import java.util.Optional;


@RestController
@RequestMapping("/api/comments")
public class CommentController {
    @Autowired
    private CommentRepository commentRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private RecipeRepository recipeRepository;

    // POST: Create a new Comment
    @PostMapping
    public ResponseEntity<Comment> createComment(@RequestBody Comment comment, @RequestParam String userId) {
        // Validate user
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Validate recipe
        Recipe recipe = recipeRepository.findById(comment.getPostId())
            .orElseThrow(() -> new RuntimeException("Recipe not found"));
        
        // Set user and save comment
        comment.setUserId(userId);
        Comment savedComment = commentRepository.save(comment);
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
                      .orElseGet(() -> ResponseEntity.<Comment>notFound().build());
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
                if (!comment.getUserId().equals(userId)) {
                    return new ResponseEntity<Comment>(HttpStatus.FORBIDDEN);
                }
                
                // Update comment text
                comment.setCommentText(commentDetails.getCommentText());
                
                // Save and return updated comment
                Comment updatedComment = commentRepository.save(comment);
                return ResponseEntity.ok(updatedComment);
            })
            .orElseGet(() -> new ResponseEntity<Comment>(HttpStatus.NOT_FOUND));
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
                Recipe recipe = recipeRepository.findById(comment.getPostId())
                    .orElse(null);
                
                if (comment.getUserId().equals(userId) || 
                    (recipe != null && recipe.getAuthor().getId().equals(userId))) {
                    
                    commentRepository.delete(comment);
                    return ResponseEntity.ok().build();
                } else {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("You don't have permission to delete this comment");
                }
            })
            .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // GET: Retrieve Comments by Recipe ID
    @GetMapping("/recipe/{recipeId}")
    public List<Comment> getCommentsByRecipeId(@PathVariable String recipeId) {
        return commentRepository.findByPostId(recipeId);
    }
}
