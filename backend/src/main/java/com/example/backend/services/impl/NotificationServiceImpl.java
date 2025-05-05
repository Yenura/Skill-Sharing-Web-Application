package com.example.backend.services.impl;

import com.example.backend.models.Comment;
import com.example.backend.models.Notification;
import com.example.backend.models.Recipe;
import com.example.backend.models.User;
import com.example.backend.repositories.NotificationRepository;
import com.example.backend.services.NotificationService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class NotificationServiceImpl implements NotificationService {
    private final NotificationRepository notificationRepository;
    private static final Logger logger = LoggerFactory.getLogger(NotificationServiceImpl.class);

    public NotificationServiceImpl(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    // Basic notification operations
    @Override
    public Notification createNotification(Notification notification) {
        if (notification.getCreatedAt() == null) {
            notification.setCreatedAt(LocalDateTime.now());
        }
        return notificationRepository.save(notification);
    }

    @Override
    public Page<Notification> getUserNotifications(String userId, Pageable pageable) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);
    }

    @Override
    public List<Notification> getUnreadNotifications(String userId) {
        return notificationRepository.findByUserIdAndReadFalse(userId);
    }

    @Override
    public void markAsRead(String notificationId) {
        notificationRepository.findById(notificationId).ifPresent(notification -> {
            notification.setRead(true);
            notification.setReadAt(LocalDateTime.now());
            notificationRepository.save(notification);
        });
    }

    @Override
    public void markAllAsRead(String userId) {
        List<Notification> unreadNotifications = notificationRepository.findByUserIdAndReadFalse(userId);
        LocalDateTime now = LocalDateTime.now();
        
        for (Notification notification : unreadNotifications) {
            notification.setRead(true);
            notification.setReadAt(now);
        }
        
        notificationRepository.saveAll(unreadNotifications);
    }

    @Override
    public void deleteNotification(String notificationId) {
        notificationRepository.deleteById(notificationId);
    }

    @Override
    public void deleteAllUserNotifications(String userId) {
        notificationRepository.deleteByUserId(userId);
    }

    @Override
    public void cleanupOldNotifications() {
        // Delete notifications older than 90 days
        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(90);
        notificationRepository.deleteByCreatedAtBefore(cutoffDate);
        logger.info("Cleaned up notifications older than {}", cutoffDate);
    }

    // Recipe notifications
    @Override
    public void notifyRecipeLiked(Recipe recipe, User liker) {
        // Skip if user is liking their own recipe
        if (recipe.getAuthorId().equals(liker.getId())) {
            return;
        }
        
        Map<String, Object> data = new HashMap<>();
        data.put("recipeId", recipe.getId());
        data.put("recipeTitle", recipe.getTitle());
        data.put("likerId", liker.getId());
        data.put("likerName", liker.getUsername());
        
        Notification notification = new Notification();
        notification.setUserId(recipe.getAuthorId());
        notification.setType("RECIPE_LIKE");
        notification.setMessage(liker.getUsername() + " liked your recipe: " + recipe.getTitle());
        notification.setData(data);
        notification.setCreatedAt(LocalDateTime.now());
        notification.setRead(false);
        
        notificationRepository.save(notification);
    }

    @Override
    public void notifyRecipeCommented(Recipe recipe, User commenter, String commentContent) {
        // Skip if user is commenting on their own recipe
        if (recipe.getAuthorId().equals(commenter.getId())) {
            return;
        }
        
        Map<String, Object> data = new HashMap<>();
        data.put("recipeId", recipe.getId());
        data.put("recipeTitle", recipe.getTitle());
        data.put("commenterId", commenter.getId());
        data.put("commenterName", commenter.getUsername());
        data.put("commentContent", commentContent);
        
        Notification notification = new Notification();
        notification.setUserId(recipe.getAuthorId());
        notification.setType("RECIPE_COMMENT");
        notification.setMessage(commenter.getUsername() + " commented on your recipe: " + recipe.getTitle());
        notification.setData(data);
        notification.setCreatedAt(LocalDateTime.now());
        notification.setRead(false);
        
        notificationRepository.save(notification);
    }

    @Override
    public void notifyCommentReplied(Comment parentComment, Comment reply, User replier) {
        // Skip if user is replying to their own comment
        if (parentComment.getAuthor().getId().equals(replier.getId())) {
            return;
        }
        
        Map<String, Object> data = new HashMap<>();
        data.put("recipeId", parentComment.getPost().getId());
        data.put("recipeTitle", parentComment.getPost().getTitle());
        data.put("commentId", parentComment.getId());
        data.put("replyId", reply.getId());
        data.put("replierId", replier.getId());
        data.put("replierName", replier.getUsername());
        data.put("replyContent", reply.getContent());
        
        Notification notification = new Notification();
        notification.setUserId(parentComment.getAuthor().getId());
        notification.setType("COMMENT_REPLY");
        notification.setMessage(replier.getUsername() + " replied to your comment on: " + parentComment.getPost().getTitle());
        notification.setData(data);
        notification.setCreatedAt(LocalDateTime.now());
        notification.setRead(false);
        
        notificationRepository.save(notification);
    }

    @Override
    public void notifyUserFollowed(User followed, User follower) {
        // Skip if user is trying to follow themselves
        if (followed.getId().equals(follower.getId())) {
            return;
        }
        
        Map<String, Object> data = new HashMap<>();
        data.put("followerId", follower.getId());
        data.put("followerName", follower.getUsername());
        data.put("followerImage", follower.getProfileImage());
        
        Notification notification = new Notification();
        notification.setUserId(followed.getId());
        notification.setType("USER_FOLLOW");
        notification.setMessage(follower.getUsername() + " started following you");
        notification.setData(data);
        notification.setCreatedAt(LocalDateTime.now());
        notification.setRead(false);
        
        notificationRepository.save(notification);
    }

    // Stub implementations for the remaining methods
    // In a production environment, these would be fully implemented
    
    @Override
    public void notifyRecipeShared(Recipe recipe, User sharer, String platform) {
        logger.info("Recipe shared notification: {} by {} on {}", recipe.getTitle(), sharer.getUsername(), platform);
    }

    @Override
    public void notifyRecipeFeatured(Recipe recipe) {
        logger.info("Recipe featured notification: {}", recipe.getTitle());
    }

    @Override
    public void notifyCommentLiked(Comment comment, User liker) {
        logger.info("Comment liked notification: {} liked by {}", comment.getId(), liker.getUsername());
    }

    @Override
    public void notifyUserMentioned(User mentioned, User mentioner, String contentType, String contentId) {
        logger.info("User mentioned notification: {} mentioned by {} in {} {}", 
                mentioned.getUsername(), mentioner.getUsername(), contentType, contentId);
    }

    @Override
    public void notifyUserAchievement(User user, String achievementType, String achievementName, int points) {
        logger.info("User achievement notification: {} earned {} achievement: {} ({} points)", 
                user.getUsername(), achievementType, achievementName, points);
    }

    @Override
    public void notifyLearningMilestone(User user, String milestoneType, String milestoneName, int level) {
        logger.info("Learning milestone notification: {} reached {} milestone: {} (level {})", 
                user.getUsername(), milestoneType, milestoneName, level);
    }

    @Override
    public void notifySkillLevelUp(User user, String skillName, int newLevel) {
        logger.info("Skill level up notification: {} reached level {} in {}", 
                user.getUsername(), newLevel, skillName);
    }

    @Override
    public void notifyLearningRecommendation(User user, String recommendationType, String itemId, String itemTitle) {
        logger.info("Learning recommendation notification: {} received {} recommendation: {}", 
                user.getUsername(), recommendationType, itemTitle);
    }

    @Override
    public void notifyGroupInvitation(User invitee, User inviter, String groupId, String groupName) {
        logger.info("Group invitation notification: {} invited {} to group {}", 
                inviter.getUsername(), invitee.getUsername(), groupName);
    }

    @Override
    public void notifyGroupJoinRequest(User requester, String groupId, String groupName) {
        logger.info("Group join request notification: {} requested to join {}", 
                requester.getUsername(), groupName);
    }

    @Override
    public void notifyGroupJoinRequestApproved(User requester, String groupId, String groupName) {
        logger.info("Group join request approved notification: {}'s request to join {} was approved", 
                requester.getUsername(), groupName);
    }

    @Override
    public void notifyGroupPostActivity(User user, String groupId, String groupName, String activityType, String contentId) {
        logger.info("Group post activity notification: {} performed {} in group {} on content {}", 
                user.getUsername(), activityType, groupName, contentId);
    }

    @Override
    public void notifyChallengeCreated(String groupId, String challengeId, String challengeTitle, User creator) {
        logger.info("Challenge created notification: {} created challenge {} in group {}", 
                creator.getUsername(), challengeTitle, groupId);
    }

    @Override
    public void notifyChallengeSubmission(String challengeId, String challengeTitle, String submissionId, User submitter) {
        logger.info("Challenge submission notification: {} submitted entry to challenge {}", 
                submitter.getUsername(), challengeTitle);
    }

    @Override
    public void notifyChallengeVote(String challengeId, String submissionId, User voter, User submitter) {
        logger.info("Challenge vote notification: {} voted for {}'s submission in challenge {}", 
                voter.getUsername(), submitter.getUsername(), challengeId);
    }

    @Override
    public void notifyChallengeCompleted(String challengeId, String challengeTitle, List<String> participantIds) {
        logger.info("Challenge completed notification: Challenge {} completed with {} participants", 
                challengeTitle, participantIds.size());
    }

    @Override
    public void notifyChallengeWinner(String challengeId, String challengeTitle, User winner, int position) {
        logger.info("Challenge winner notification: {} won position {} in challenge {}", 
                winner.getUsername(), position, challengeTitle);
    }

    @Override
    public void notifySystemAnnouncement(String title, String message, List<String> userIds) {
        logger.info("System announcement notification: {} sent to {} users", title, userIds.size());
    }

    @Override
    public void notifyFeatureUpdate(String featureName, String description, List<String> userIds) {
        logger.info("Feature update notification: {} update sent to {} users", featureName, userIds.size());
    }

    @Override
    public void notifyAccountSecurity(User user, String securityAction, String deviceInfo) {
        logger.info("Account security notification: {} action for user {} on device {}", 
                securityAction, user.getUsername(), deviceInfo);
    }
}
