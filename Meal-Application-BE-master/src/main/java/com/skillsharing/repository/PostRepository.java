package com.skillsharing.repository;

import com.skillsharing.model.Post;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface PostRepository extends MongoRepository<Post, String> {
    // Find posts by author ID
    List<Post> findByAuthorId(String authorId, Sort sort);
    
    // Find posts by author ID with pagination
    List<Post> findByAuthorId(String authorId, org.springframework.data.domain.Pageable pageable);
    
    // Find posts from users that the current user follows
    @Query("{ 'authorId': { $in: ?0 } }")
    List<Post> findByAuthorIdIn(List<String> authorIds, Sort sort);
    
    // Find posts from users that the current user follows with pagination
    @Query("{ 'authorId': { $in: ?0 } }")
    List<Post> findByAuthorIdIn(List<String> authorIds, org.springframework.data.domain.Pageable pageable);
    
    // Count posts by author ID
    long countByAuthorId(String authorId);
    
    // Add this method to find shared posts by originalPostId
    List<Post> findByOriginalPostId(String originalPostId);
}
