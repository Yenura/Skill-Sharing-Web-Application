package com.example.backend.repositories;

import com.example.backend.models.Media;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MediaRepository extends MongoRepository<Media, String> {
    List<Media> findByPostId(String postId);
}
