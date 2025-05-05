package com.example.backend.services;

import com.example.backend.models.Community;
import com.example.backend.models.CommunityPost;
import com.example.backend.models.User;
import com.example.backend.repositories.CommunityPostRepository;
import com.example.backend.repositories.CommunityRepository;
import com.example.backend.repositories.UserRepository;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CommunityPostService {

    private final CommunityPostRepository communityPostRepository;
    private final CommunityRepository communityRepository;
    private final UserRepository userRepository;

    public CommunityPostService(CommunityPostRepository communityPostRepository, 
                               CommunityRepository communityRepository,
                               UserRepository userRepository) {
        this.communityPostRepository = communityPostRepository;
        this.communityRepository = communityRepository;
        this.userRepository = userRepository;
    }

    public List<CommunityPost> getAllPosts() {
        return communityPostRepository.findAll();
    }

    public Optional<CommunityPost> getPostById(String id) {
        return communityPostRepository.findById(id);
    }

    public List<CommunityPost> getPostsByCommunity(String communityId) {
        return communityPostRepository.findByCommunityIdOrderByCreatedAtDesc(communityId);
    }

    public List<CommunityPost> getPostsByAuthor(String authorId) {
        return communityPostRepository.findByAuthorId(authorId);
    }

    public CommunityPost createPost(CommunityPost post, String communityId, String userId) {
        Optional<Community> communityOptional = communityRepository.findById(communityId);
        Optional<User> userOptional = userRepository.findById(userId);
        
        if (communityOptional.isPresent() && userOptional.isPresent()) {
            Community community = communityOptional.get();
            User user = userOptional.get();
            
            post.setCommunity(community);
            post.setAuthor(user);
            
            CommunityPost savedPost = communityPostRepository.save(post);
            
            community.addPost(savedPost);
            communityRepository.save(community);
            
            return savedPost;
        }
        throw new IllegalArgumentException("Community or User not found");
    }

    public CommunityPost updatePost(String id, CommunityPost postDetails) {
        Optional<CommunityPost> postOptional = communityPostRepository.findById(id);
        if (postOptional.isPresent()) {
            CommunityPost post = postOptional.get();
            
            post.setTitle(postDetails.getTitle());
            post.setContent(postDetails.getContent());
            post.setImages(postDetails.getImages());
            
            return communityPostRepository.save(post);
        }
        throw new IllegalArgumentException("Post not found");
    }

    public void deletePost(String id) {
        Optional<CommunityPost> postOptional = communityPostRepository.findById(id);
        if (postOptional.isPresent()) {
            CommunityPost post = postOptional.get();
            Community community = post.getCommunity();
            
            community.removePost(post);
            communityRepository.save(community);
            
            communityPostRepository.deleteById(id);
        } else {
            throw new IllegalArgumentException("Post not found");
        }
    }

    public CommunityPost likePost(String id) {
        Optional<CommunityPost> postOptional = communityPostRepository.findById(id);
        if (postOptional.isPresent()) {
            CommunityPost post = postOptional.get();
            post.incrementLikes();
            return communityPostRepository.save(post);
        }
        throw new IllegalArgumentException("Post not found");
    }

    public CommunityPost unlikePost(String id) {
        Optional<CommunityPost> postOptional = communityPostRepository.findById(id);
        if (postOptional.isPresent()) {
            CommunityPost post = postOptional.get();
            post.decrementLikes();
            return communityPostRepository.save(post);
        }
        throw new IllegalArgumentException("Post not found");
    }
}
