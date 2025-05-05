package com.example.backend.services;

import com.example.backend.models.Comment;
import com.example.backend.models.Community;
import com.example.backend.models.Report;
import com.example.backend.models.User;
import com.example.backend.repositories.CommentRepository;
import com.example.backend.repositories.CommunityRepository;
import com.example.backend.repositories.ReportRepository;
import com.example.backend.repositories.UserRepository;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CommunityService {

    private final CommunityRepository communityRepository;
    private final UserRepository userRepository;
    private final ReportRepository reportRepository;
    private final CommentRepository commentRepository;

    public CommunityService(CommunityRepository communityRepository, 
                           UserRepository userRepository,
                           ReportRepository reportRepository,
                           CommentRepository commentRepository) {
        this.communityRepository = communityRepository;
        this.userRepository = userRepository;
        this.reportRepository = reportRepository;
        this.commentRepository = commentRepository;
    }

    public List<Community> getAllCommunities() {
        return communityRepository.findAll();
    }

    public Optional<Community> getCommunityById(String id) {
        return communityRepository.findById(id);
    }

    public List<Community> getCommunityByCategory(String category) {
        return communityRepository.findByCategory(category);
    }

    public List<Community> searchCommunities(String name) {
        return communityRepository.findByNameContainingIgnoreCase(name);
    }

    public List<Community> getPublicCommunities() {
        return communityRepository.findByIsPrivate(false);
    }

    public List<Community> getUserModeratedCommunities(String userId) {
        return communityRepository.findByModeratorsId(userId);
    }

    public List<Community> getUserJoinedCommunities(String userId) {
        return communityRepository.findByMembersId(userId);
    }

    public Community createCommunity(Community community, String userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            community.addModerator(user);
            community.addMember(user);
            return communityRepository.save(community);
        }
        throw new IllegalArgumentException("User not found");
    }

    public Community updateCommunity(String id, Community communityDetails) {
        Optional<Community> communityOptional = communityRepository.findById(id);
        if (communityOptional.isPresent()) {
            Community community = communityOptional.get();
            
            community.setName(communityDetails.getName());
            community.setDescription(communityDetails.getDescription());
            community.setCategory(communityDetails.getCategory());
            community.setCoverImage(communityDetails.getCoverImage());
            community.setPrivate(communityDetails.isPrivate());
            community.setRules(communityDetails.getRules());
            
            return communityRepository.save(community);
        }
        throw new IllegalArgumentException("Community not found");
    }

    public void deleteCommunity(String id) {
        communityRepository.deleteById(id);
    }

    public Community joinCommunity(String communityId, String userId) {
        Optional<Community> communityOptional = communityRepository.findById(communityId);
        Optional<User> userOptional = userRepository.findById(userId);
        
        if (communityOptional.isPresent() && userOptional.isPresent()) {
            Community community = communityOptional.get();
            User user = userOptional.get();
            
            community.addMember(user);
            return communityRepository.save(community);
        }
        throw new IllegalArgumentException("Community or User not found");
    }

    public Community leaveCommunity(String communityId, String userId) {
        Optional<Community> communityOptional = communityRepository.findById(communityId);
        Optional<User> userOptional = userRepository.findById(userId);
        
        if (communityOptional.isPresent() && userOptional.isPresent()) {
            Community community = communityOptional.get();
            User user = userOptional.get();
            
            community.removeMember(user);
            return communityRepository.save(community);
        }
        throw new IllegalArgumentException("Community or User not found");
    }

    public Community addModerator(String communityId, String userId) {
        Optional<Community> communityOptional = communityRepository.findById(communityId);
        Optional<User> userOptional = userRepository.findById(userId);
        
        if (communityOptional.isPresent() && userOptional.isPresent()) {
            Community community = communityOptional.get();
            User user = userOptional.get();
            
            community.addModerator(user);
            return communityRepository.save(community);
        }
        throw new IllegalArgumentException("Community or User not found");
    }

    public Community removeModerator(String communityId, String userId) {
        Optional<Community> communityOptional = communityRepository.findById(communityId);
        Optional<User> userOptional = userRepository.findById(userId);
        
        if (communityOptional.isPresent() && userOptional.isPresent()) {
            Community community = communityOptional.get();
            User user = userOptional.get();
            
            community.removeModerator(user);
            return communityRepository.save(community);
        }
        throw new IllegalArgumentException("Community or User not found");
    }
    

    
    public void reportCommunity(String communityId, String userId, String reason, String description) {
        Optional<Community> communityOptional = communityRepository.findById(communityId);
        Optional<User> userOptional = userRepository.findById(userId);
        
        if (communityOptional.isPresent() && userOptional.isPresent()) {
            Community community = communityOptional.get();
            User user = userOptional.get();
            
            Report report = new Report();
            report.setReportedCommunity(community);
            report.setReporter(user);
            report.setReason(reason);
            report.setDetails(description);
            
            reportRepository.save(report);
        } else {
            throw new IllegalArgumentException("Community or User not found");
        }
    }
    
    public void inviteUserToCommunity(String communityId, String inviterId, String email, String message) {
        // In a real application, this would send an email invitation
        // For now, we'll just log the invitation
        System.out.println("Invitation sent to " + email + " for community " + communityId);
        System.out.println("Message: " + message);
        System.out.println("Invited by: " + inviterId);
    }
    
    public List<Comment> getCommunityComments(String communityId) {
        Optional<Community> communityOptional = communityRepository.findById(communityId);
        
        if (communityOptional.isPresent()) {
            // In a real application, you would fetch comments related to the community
            // For now, we'll return an empty list
            return new ArrayList<>();
        } else {
            throw new IllegalArgumentException("Community not found");
        }
    }
    
    public Comment createCommunityComment(String communityId, String authorId, String content, Integer postId) {
        Optional<Community> communityOptional = communityRepository.findById(communityId);
        Optional<User> userOptional = userRepository.findById(authorId);
        
        if (communityOptional.isPresent() && userOptional.isPresent()) {
            User author = userOptional.get();
            
            Comment comment = new Comment();
            comment.setContent(content);
            comment.setAuthor(author);
            // In a real application, you would associate the comment with a post
            // For now, we'll just create a basic comment
            
            return commentRepository.save(comment);
        } else {
            throw new IllegalArgumentException("Community or User not found");
        }
    }
}
