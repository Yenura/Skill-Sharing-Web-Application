package com.example.backend.repositories;

import com.example.backend.models.Bookmark;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookmarkRepository extends MongoRepository<Bookmark, String> {
    List<Bookmark> findByUserId(String userId);
    List<Bookmark> findByUserIdAndResourceId(String userId, String resourceId);
    boolean existsByUserIdAndResourceId(String userId, String resourceId);
}
