package com.example.backend.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import com.example.backend.models.Content;
import java.util.List;

@Repository
public interface ContentRepository extends MongoRepository<Content, String> {
    List<Content> findBySectionId(String sectionId);
    List<Content> findByAuthorId(String authorId);
    long countBySectionId(String sectionId);
} 
