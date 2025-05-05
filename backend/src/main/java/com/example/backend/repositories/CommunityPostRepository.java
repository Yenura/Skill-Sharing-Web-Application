package com.example.backend.repositories;

import com.example.backend.models.CommunityPost;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommunityPostRepository extends MongoRepository<CommunityPost, String> {
    List<CommunityPost> findByCommunityId(String communityId);
    List<CommunityPost> findByAuthorId(String authorId);
    List<CommunityPost> findByCommunityIdOrderByCreatedAtDesc(String communityId);
    List<CommunityPost> findByTitleContainingIgnoreCase(String title);
}
