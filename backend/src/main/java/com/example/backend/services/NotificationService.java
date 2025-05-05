package com.example.backend.services;

import com.example.backend.models.Comment;
import com.example.backend.models.Notification;
import com.example.backend.models.Recipe;
import com.example.backend.models.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface NotificationService {

    // Basic notification operations
    Notification createNotification(Notification notification);
    Page<Notification> getUserNotifications(String userId, Pageable pageable);
    List<Notification> getUnreadNotifications(String userId);
    void markAsRead(String notificationId);
    void markAllAsRead(String userId);
    void deleteNotification(String notificationId);
    void deleteAllUserNotifications(String userId);
    
    // Recipe notifications
    void notifyRecipeLiked(Recipe recipe, User liker);
    void notifyRecipeCommented(Recipe recipe, User commenter, String commentContent);
    void notifyRecipeShared(Recipe recipe, User sharer, String platform);
    void notifyRecipeFeatured(Recipe recipe);
    
    // Comment notifications
    void notifyCommentLiked(Comment comment, User liker);
    void notifyCommentReplied(Comment parentComment, Comment reply, User replier);
    
    // User notifications
    void notifyUserFollowed(User followed, User follower);
    void notifyUserMentioned(User mentioned, User mentioner, String contentType, String contentId);
    void notifyUserAchievement(User user, String achievementType, String achievementName, int points);
    
    // Learning notifications
    void notifyLearningMilestone(User user, String milestoneType, String milestoneName, int level);
    void notifySkillLevelUp(User user, String skillName, int newLevel);
    void notifyLearningRecommendation(User user, String recommendationType, String itemId, String itemTitle);
    
    // Group notifications
    void notifyGroupInvitation(User invitee, User inviter, String groupId, String groupName);
    void notifyGroupJoinRequest(User requester, String groupId, String groupName);
    void notifyGroupJoinRequestApproved(User requester, String groupId, String groupName);
    void notifyGroupPostActivity(User user, String groupId, String groupName, String activityType, String contentId);
    
    // Challenge notifications
    void notifyChallengeCreated(String groupId, String challengeId, String challengeTitle, User creator);
    void notifyChallengeSubmission(String challengeId, String challengeTitle, String submissionId, User submitter);
    void notifyChallengeVote(String challengeId, String submissionId, User voter, User submitter);
    void notifyChallengeCompleted(String challengeId, String challengeTitle, List<String> participantIds);
    void notifyChallengeWinner(String challengeId, String challengeTitle, User winner, int position);
    
    // System notifications
    void notifySystemAnnouncement(String title, String message, List<String> userIds);
    void notifyFeatureUpdate(String featureName, String description, List<String> userIds);
    void notifyAccountSecurity(User user, String securityAction, String deviceInfo);
    
    // Scheduled cleanup
    void cleanupOldNotifications();
}