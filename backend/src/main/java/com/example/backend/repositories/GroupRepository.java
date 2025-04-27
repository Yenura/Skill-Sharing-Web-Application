package com.example.backend.repositories;

import com.example.backend.models.Group;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface GroupRepository extends MongoRepository<Group, String> {
    // Basic queries
    List<Group> findByCreatedBy_Id(String creatorId);
    List<Group> findByMemberIdsContaining(String userId);
    List<Group> findByPrivateFalse();
    List<Group> findByTagsContaining(String tag);
    
    // Advanced queries
    @Query("{ 'private': false, 'tags': { $in: ?0 } }")
    List<Group> findPublicGroupsByTags(List<String> tags);
    
    @Query("{ 'memberIds': ?0, 'status': 'active' }")
    List<Group> findActiveGroupsByMember(String userId);
    
    @Query("{ 'createdBy._id': ?0, 'status': { $in: ?1 } }")
    List<Group> findByCreatorAndStatus(String creatorId, List<String> status);
    
    // Search queries
    List<Group> findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String name, String description);
    List<Group> findByNameContainingIgnoreCase(String name);
    List<Group> findTop10ByNameContainingIgnoreCase(String name);
    
    // Combined filters
    List<Group> findByPrivateFalseAndTagsInAndMemberCountGreaterThan(List<String> tags, int minMembers);
}
