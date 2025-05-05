package com.example.backend.repositories;

import com.example.backend.models.MediaAsset;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MediaAssetRepository extends MongoRepository<MediaAsset, String> {
    List<MediaAsset> findByOwnerId(String ownerId);
    List<MediaAsset> findByOwnerIdAndType(String ownerId, String type);
    void deleteByOwnerIdAndId(String ownerId, String id);
}