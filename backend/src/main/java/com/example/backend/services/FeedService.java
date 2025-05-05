package com.example.backend.services;

import com.example.backend.models.GroupPost;
import com.example.backend.models.User;
import com.example.backend.repositories.GroupPostRepository;
import com.example.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FeedService {

    @Autowired
    private GroupPostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    public List<GroupPost> getPublicFeed() {
        return postRepository.findAll(
            PageRequest.of(0, 20, Sort.by(Sort.Direction.DESC, "createdAt"))
        ).getContent();
    }

    public List<GroupPost> getPersonalizedFeed(String userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        // Get posts from followed users and communities
        Page<GroupPost> page = postRepository.findByUserIdIn(
            new ArrayList<>(user.getFollowing().stream().map(User::getId).collect(Collectors.toList())),
            PageRequest.of(0, 20, Sort.by(Sort.Direction.DESC, "createdAt"))
        );
        List<GroupPost> followedPosts = new ArrayList<>(page.getContent());

        // If not enough posts, add some popular posts
        if (followedPosts.size() < 10) {
            Pageable pageable = PageRequest.of(0, 10, Sort.by(Sort.Direction.DESC, "likeCount"));
            List<GroupPost> popularPosts = new ArrayList<>(postRepository.findPopularPosts(pageable).getContent());
            followedPosts.addAll(popularPosts);
        }

        return followedPosts.stream()
            .distinct()
            .limit(20)
            .collect(Collectors.toList());
    }

    public List<GroupPost> getFollowingFeed(String userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        return new ArrayList<>(postRepository.findByUserIdIn(
            new ArrayList<>(user.getFollowing().stream().map(User::getId).collect(Collectors.toList())),
            PageRequest.of(0, 20, Sort.by(Sort.Direction.DESC, "createdAt"))
        ).getContent());
    }

    @Transactional
    public void likePost(String postId, String userId) {
        GroupPost post = postRepository.findById(postId)
            .orElseThrow(() -> new RuntimeException("Post not found"));
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        if (!post.getLikedBy().contains(user.getId())) {
            post.getLikedBy().add(user.getId());
            post.setLikeCount(post.getLikeCount() + 1);
            postRepository.save(post);
        }
    }

    @Transactional
    public void unlikePost(String postId, String userId) {
        GroupPost post = postRepository.findById(postId)
            .orElseThrow(() -> new RuntimeException("Post not found"));
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        if (post.getLikedBy().contains(user.getId())) {
            post.getLikedBy().remove(user.getId());
            post.setLikeCount(post.getLikeCount() - 1);
            postRepository.save(post);
        }
    }

    @Transactional
    public void savePost(String userId, GroupPost post) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        
        // Store the post ID instead of the entire post object
        user.getSavedPosts().add(post.getId());
        
        userRepository.save(user);
    }
    
    @Transactional
    public void unsavePost(String userId, GroupPost post) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        
        // Remove the post ID from saved posts
        user.getSavedPosts().remove(post.getId());
        
        userRepository.save(user);
    }
}
