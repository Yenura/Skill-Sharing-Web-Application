package com.example.backend.repositories;

import com.example.backend.models.GroupPost;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GroupPostRepository extends MongoRepository<GroupPost, String> {
    List<GroupPost> findByGroupId(String groupId);
    List<GroupPost> findByGroupIdOrderByTimestampDesc(String groupId);
    Page<GroupPost> findByUserIdIn(List<String> userIds, Pageable pageable);
    // Removed findAllByOrderByLikeCountDesc to avoid conflict with custom @Query method
    @Query(value = "{ }", sort = "{\"likeCount\": -1}")
    Page<GroupPost> findPopularPosts(Pageable pageable);
}
