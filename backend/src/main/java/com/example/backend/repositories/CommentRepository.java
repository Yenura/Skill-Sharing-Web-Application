package com.example.backend.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import com.example.backend.models.Comment;
import java.time.LocalDateTime;
import java.util.List;

@Repository
// Removed custom query method as DBRef querying is better handled with MongoTemplate
public interface CommentRepository extends MongoRepository<Comment, String> {
    List<Comment> findByPostId(String postId);
    List<Comment> findByAuthorId(String authorId);
    List<Comment> findByParentId(String parentId);
    
    // Admin analytics methods
    long countByCreatedAtAfter(LocalDateTime date);
}
