package com.example.backend.controllers;

import com.example.backend.models.Group;
import com.example.backend.repositories.GroupRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/groups")
public class GroupController {

    @Autowired
    private GroupRepository groupRepository;

    @GetMapping
    public ResponseEntity<List<Group>> getAllGroups() {
        List<Group> groups = groupRepository.findAll();
        return ResponseEntity.ok(groups);
    }
    
    @GetMapping("/public")
    public ResponseEntity<List<Group>> getPublicGroups() {
        List<Group> groups = groupRepository.findByPrivateFalse();
        return ResponseEntity.ok(groups);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Group> getGroupById(@PathVariable String id) {
        Optional<Group> group = groupRepository.findById(id);
        return group.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
    
    @GetMapping("/creator/{userId}")
    public ResponseEntity<List<Group>> getGroupsByCreator(@PathVariable String userId) {
        List<Group> groups = groupRepository.findByCreatedBy_Id(userId);
        return ResponseEntity.ok(groups);
    }
    
    @GetMapping("/member/{userId}")
    public ResponseEntity<List<Group>> getGroupsByMember(@PathVariable String userId) {
        List<Group> groups = groupRepository.findByMemberIdsContaining(userId);
        return ResponseEntity.ok(groups);
    }
    
    @PostMapping
    public ResponseEntity<Group> createGroup(@RequestBody Group group) {
        group.setCreatedAt(LocalDateTime.now());
        group.setUpdatedAt(LocalDateTime.now());
        group.setMemberCount(1); // Creator is the first member
        group.setRecipeCount(0);
        
        // Add creator to moderators
        if (group.getModerators() != null) {
            group.getModerators().add(group.getCreatedBy().getId());
        }
        
        Group savedGroup = groupRepository.save(group);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedGroup);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Group> updateGroup(@PathVariable String id, @RequestBody Group groupDetails) {
        return groupRepository.findById(id)
                .map(group -> {
                    group.setName(groupDetails.getName());
                    group.setDescription(groupDetails.getDescription());
                    group.setCoverImage(groupDetails.getCoverImage());
                    group.setTags(groupDetails.getTags());
                    group.setRules(groupDetails.getRules());
                    group.setPrivate(groupDetails.isPrivate());
                    group.setUpdatedAt(LocalDateTime.now());
                    
                    Group updatedGroup = groupRepository.save(group);
                    return ResponseEntity.ok(updatedGroup);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
    
    @PutMapping("/{id}/moderators")
    public ResponseEntity<Group> updateGroupModerators(@PathVariable String id, @RequestBody List<String> moderatorIds) {
        return groupRepository.findById(id)
                .map(group -> {
                    group.setModerators(moderatorIds);
                    group.setUpdatedAt(LocalDateTime.now());
                    
                    // Ensure creator stays in moderators
                    if (!group.getModerators().contains(group.getCreatedBy().getId())) {
                        group.getModerators().add(group.getCreatedBy().getId());
                    }
                    
                    Group updatedGroup = groupRepository.save(group);
                    return ResponseEntity.ok(updatedGroup);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGroup(@PathVariable String id) {
        return groupRepository.findById(id)
                .map(group -> {
                    groupRepository.delete(group);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
