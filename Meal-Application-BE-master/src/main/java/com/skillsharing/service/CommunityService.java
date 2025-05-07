package com.skillsharing.service;

import com.skillsharing.dto.CommunityDTO;
import com.skillsharing.model.Community;
import com.skillsharing.model.User;
import com.skillsharing.repository.CommunityRepository;
import com.skillsharing.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CommunityService {

    @Autowired
    private CommunityRepository communityRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    // Create a new community
    public CommunityDTO createCommunity(Community community, String userId) {
        // Set creator and initial member/moderator
        community.setCreatorId(userId);
        community.setCreatedAt(LocalDateTime.now());
        community.addMember(userId);
        community.addModerator(userId);
        
        Community savedCommunity = communityRepository.save(community);
        CommunityDTO dto = new CommunityDTO(savedCommunity);
        
        // Set additional fields
        Optional<User> creator = userRepository.findById(userId);
        creator.ifPresent(user -> dto.setCreatorName(user.getFullName()));
        
        dto.setMember(true);
        dto.setModerator(true);
        
        return dto;
    }
    
    // Get community by ID
    public CommunityDTO getCommunityById(String communityId, String currentUserId) {
        Optional<Community> communityOpt = communityRepository.findById(communityId);
        
        if (communityOpt.isPresent()) {
            Community community = communityOpt.get();
            CommunityDTO dto = new CommunityDTO(community);
            
            // Set creator name
            Optional<User> creator = userRepository.findById(community.getCreatorId());
            creator.ifPresent(user -> dto.setCreatorName(user.getFullName()));
            
            // Set membership status for current user
            if (currentUserId != null) {
                dto.setMember(community.isMember(currentUserId));
                dto.setModerator(community.isModerator(currentUserId));
            }
            
            return dto;
        }
        
        return null;
    }
    
    // Get all communities
    public List<CommunityDTO> getAllCommunities(String currentUserId) {
        List<Community> communities = communityRepository.findAll();
        return communities.stream()
                .map(community -> {
                    CommunityDTO dto = new CommunityDTO(community);
                    
                    // Set creator name
                    Optional<User> creator = userRepository.findById(community.getCreatorId());
                    creator.ifPresent(user -> dto.setCreatorName(user.getFullName()));
                    
                    // Set membership status for current user
                    if (currentUserId != null) {
                        dto.setMember(community.isMember(currentUserId));
                        dto.setModerator(community.isModerator(currentUserId));
                    }
                    
                    return dto;
                })
                .collect(Collectors.toList());
    }
    
    // Get communities by category
    public List<CommunityDTO> getCommunitiesByCategory(String category, String currentUserId) {
        List<Community> communities = communityRepository.findByCategory(category);
        return communities.stream()
                .map(community -> {
                    CommunityDTO dto = new CommunityDTO(community);
                    
                    // Set creator name
                    Optional<User> creator = userRepository.findById(community.getCreatorId());
                    creator.ifPresent(user -> dto.setCreatorName(user.getFullName()));
                    
                    // Set membership status for current user
                    if (currentUserId != null) {
                        dto.setMember(community.isMember(currentUserId));
                        dto.setModerator(community.isModerator(currentUserId));
                    }
                    
                    return dto;
                })
                .collect(Collectors.toList());
    }
    
    // Get communities where user is a member
    public List<CommunityDTO> getUserCommunities(String userId) {
        List<Community> communities = communityRepository.findByMemberId(userId);
        return communities.stream()
                .map(community -> {
                    CommunityDTO dto = new CommunityDTO(community);
                    
                    // Set creator name
                    Optional<User> creator = userRepository.findById(community.getCreatorId());
                    creator.ifPresent(user -> dto.setCreatorName(user.getFullName()));
                    
                    // Set membership status
                    dto.setMember(true);
                    dto.setModerator(community.isModerator(userId));
                    
                    return dto;
                })
                .collect(Collectors.toList());
    }
    
    // Join a community
    public CommunityDTO joinCommunity(String communityId, String userId) {
        Optional<Community> communityOpt = communityRepository.findById(communityId);
        
        if (communityOpt.isPresent()) {
            Community community = communityOpt.get();
            community.addMember(userId);
            Community savedCommunity = communityRepository.save(community);
            
            CommunityDTO dto = new CommunityDTO(savedCommunity);
            
            // Set creator name
            Optional<User> creator = userRepository.findById(community.getCreatorId());
            creator.ifPresent(user -> dto.setCreatorName(user.getFullName()));
            
            // Set membership status
            dto.setMember(true);
            dto.setModerator(community.isModerator(userId));
            
            return dto;
        }
        
        return null;
    }
    
    // Leave a community
    public boolean leaveCommunity(String communityId, String userId) {
        Optional<Community> communityOpt = communityRepository.findById(communityId);
        
        if (communityOpt.isPresent()) {
            Community community = communityOpt.get();
            
            // Creator cannot leave their own community
            if (community.getCreatorId().equals(userId)) {
                return false;
            }
            
            community.removeMember(userId);
            communityRepository.save(community);
            return true;
        }
        
        return false;
    }
    
    // Add a moderator to a community
    public boolean addModerator(String communityId, String userId, String currentUserId) {
        Optional<Community> communityOpt = communityRepository.findById(communityId);
        
        if (communityOpt.isPresent()) {
            Community community = communityOpt.get();
            
            // Only creator or existing moderators can add new moderators
            if (community.getCreatorId().equals(currentUserId) || community.isModerator(currentUserId)) {
                // User must be a member before becoming a moderator
                if (community.isMember(userId)) {
                    community.addModerator(userId);
                    communityRepository.save(community);
                    return true;
                }
            }
        }
        
        return false;
    }
    
    // Remove a moderator from a community
    public boolean removeModerator(String communityId, String userId, String currentUserId) {
        Optional<Community> communityOpt = communityRepository.findById(communityId);
        
        if (communityOpt.isPresent()) {
            Community community = communityOpt.get();
            
            // Only creator can remove moderators
            if (community.getCreatorId().equals(currentUserId)) {
                // Creator cannot remove themselves as moderator
                if (!userId.equals(community.getCreatorId())) {
                    community.removeModerator(userId);
                    communityRepository.save(community);
                    return true;
                }
            }
        }
        
        return false;
    }
    
    // Update community details
    public CommunityDTO updateCommunity(String communityId, Community updatedCommunity, String currentUserId) {
        Optional<Community> communityOpt = communityRepository.findById(communityId);
        
        if (communityOpt.isPresent()) {
            Community community = communityOpt.get();
            
            // Only creator or moderators can update community details
            if (community.getCreatorId().equals(currentUserId) || community.isModerator(currentUserId)) {
                // Update fields
                community.setName(updatedCommunity.getName());
                community.setDescription(updatedCommunity.getDescription());
                community.setCategory(updatedCommunity.getCategory());
                community.setCoverImage(updatedCommunity.getCoverImage());
                community.setPrivate(updatedCommunity.isPrivate());
                
                Community savedCommunity = communityRepository.save(community);
                CommunityDTO dto = new CommunityDTO(savedCommunity);
                
                // Set creator name
                Optional<User> creator = userRepository.findById(community.getCreatorId());
                creator.ifPresent(user -> dto.setCreatorName(user.getFullName()));
                
                // Set membership status
                dto.setMember(community.isMember(currentUserId));
                dto.setModerator(community.isModerator(currentUserId));
                
                return dto;
            }
        }
        
        return null;
    }
    
    // Delete a community
    public boolean deleteCommunity(String communityId, String currentUserId) {
        Optional<Community> communityOpt = communityRepository.findById(communityId);
        
        if (communityOpt.isPresent()) {
            Community community = communityOpt.get();
            
            // Only creator can delete a community
            if (community.getCreatorId().equals(currentUserId)) {
                communityRepository.delete(community);
                return true;
            }
        }
        
        return false;
    }
    
    // Search communities
    public List<CommunityDTO> searchCommunities(String searchTerm, String currentUserId) {
        List<Community> nameResults = communityRepository.findByNameContainingIgnoreCase(searchTerm);
        List<Community> descriptionResults = communityRepository.findByDescriptionContainingIgnoreCase(searchTerm);
        List<Community> categoryResults = communityRepository.findByCategoryContainingIgnoreCase(searchTerm);
        
        // Combine results and remove duplicates
        List<Community> combinedResults = nameResults.stream()
                .distinct()
                .filter(community -> !descriptionResults.contains(community) && !categoryResults.contains(community))
                .collect(Collectors.toList());
        
        combinedResults.addAll(descriptionResults.stream()
                .distinct()
                .filter(community -> !categoryResults.contains(community))
                .collect(Collectors.toList()));
        
        combinedResults.addAll(categoryResults.stream()
                .distinct()
                .collect(Collectors.toList()));
        
        return combinedResults.stream()
                .map(community -> {
                    CommunityDTO dto = new CommunityDTO(community);
                    
                    // Set creator name
                    Optional<User> creator = userRepository.findById(community.getCreatorId());
                    creator.ifPresent(user -> dto.setCreatorName(user.getFullName()));
                    
                    // Set membership status for current user
                    if (currentUserId != null) {
                        dto.setMember(community.isMember(currentUserId));
                        dto.setModerator(community.isModerator(currentUserId));
                    }
                    
                    return dto;
                })
                .collect(Collectors.toList());
    }
}
