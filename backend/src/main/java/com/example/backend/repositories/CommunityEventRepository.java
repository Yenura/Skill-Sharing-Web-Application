package com.example.backend.repositories;

import com.example.backend.models.CommunityEvent;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CommunityEventRepository extends MongoRepository<CommunityEvent, String> {
    List<CommunityEvent> findByCommunityId(String communityId);
    List<CommunityEvent> findByOrganizerId(String organizerId);
    List<CommunityEvent> findByStartTimeAfter(LocalDateTime dateTime);
    List<CommunityEvent> findByCommunityIdAndStartTimeAfter(String communityId, LocalDateTime dateTime);
    List<CommunityEvent> findByTitleContainingIgnoreCase(String title);
}
