package com.example.backend.api;

import com.example.backend.models.CommunityPost;
import com.example.backend.services.CommunityPostService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/community-posts")
public class CommunityPostController {

    private final CommunityPostService communityPostService;

    public CommunityPostController(CommunityPostService communityPostService) {
        this.communityPostService = communityPostService;
    }

    @GetMapping
    public ResponseEntity<List<CommunityPost>> getAllPosts() {
        List<CommunityPost> posts = communityPostService.getAllPosts();
        return new ResponseEntity<>(posts, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CommunityPost> getPostById(@PathVariable String id) {
        Optional<CommunityPost> post = communityPostService.getPostById(id);
        return post.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/community/{communityId}")
    public ResponseEntity<List<CommunityPost>> getPostsByCommunity(@PathVariable String communityId) {
        List<CommunityPost> posts = communityPostService.getPostsByCommunity(communityId);
        return new ResponseEntity<>(posts, HttpStatus.OK);
    }

    @GetMapping("/author/{authorId}")
    public ResponseEntity<List<CommunityPost>> getPostsByAuthor(@PathVariable String authorId) {
        List<CommunityPost> posts = communityPostService.getPostsByAuthor(authorId);
        return new ResponseEntity<>(posts, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<CommunityPost> createPost(
            @RequestBody CommunityPost post,
            @RequestParam String communityId,
            @RequestParam String userId) {
        try {
            CommunityPost newPost = communityPostService.createPost(post, communityId, userId);
            return new ResponseEntity<>(newPost, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<CommunityPost> updatePost(@PathVariable String id, @RequestBody CommunityPost post) {
        try {
            CommunityPost updatedPost = communityPostService.updatePost(id, post);
            return new ResponseEntity<>(updatedPost, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable String id) {
        try {
            communityPostService.deletePost(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<CommunityPost> likePost(@PathVariable String id) {
        try {
            CommunityPost post = communityPostService.likePost(id);
            return new ResponseEntity<>(post, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/{id}/unlike")
    public ResponseEntity<CommunityPost> unlikePost(@PathVariable String id) {
        try {
            CommunityPost post = communityPostService.unlikePost(id);
            return new ResponseEntity<>(post, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
