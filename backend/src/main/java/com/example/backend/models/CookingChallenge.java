package com.example.backend.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "cooking_challenges")
public class CookingChallenge {
    @Id
    private String id;
    
    private String title;
    private String description;
    private String groupId;
    private String createdBy;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String difficulty;
    private List<String> ingredients;
    private List<String> rules;
    private List<String> criteria;
    private List<ChallengeSubmission> submissions;
    private String status; // UPCOMING, ACTIVE, COMPLETED, CANCELLED
    private String imageUrl;
    private List<String> tags;
    private int participantCount;
    private boolean featured;
    
    public CookingChallenge() {
        this.submissions = new ArrayList<>();
        this.ingredients = new ArrayList<>();
        this.rules = new ArrayList<>();
        this.criteria = new ArrayList<>();
        this.tags = new ArrayList<>();
        this.participantCount = 0;
        this.featured = false;
    }
    
    // Nested class for challenge submissions
    public static class ChallengeSubmission {
        private String id;
        private String userId;
        private String username;
        private String recipeId;
        private String recipeTitle;
        private LocalDateTime submittedAt;
        private List<String> mediaUrls;
        private String description;
        private int votes;
        private List<String> voterIds;
        private List<Rating> ratings;
        
        public ChallengeSubmission() {
            this.mediaUrls = new ArrayList<>();
            this.voterIds = new ArrayList<>();
            this.ratings = new ArrayList<>();
            this.votes = 0;
        }
        
        // Nested class for ratings
        public static class Rating {
            private String userId;
            private String username;
            private int score; // 1-5
            private String comment;
            private LocalDateTime ratedAt;
            
            public Rating() {
                this.ratedAt = LocalDateTime.now();
            }
            
            // Getters and setters
            public String getUserId() { return userId; }
            public void setUserId(String userId) { this.userId = userId; }
            
            public String getUsername() { return username; }
            public void setUsername(String username) { this.username = username; }
            
            public int getScore() { return score; }
            public void setScore(int score) { this.score = score; }
            
            public String getComment() { return comment; }
            public void setComment(String comment) { this.comment = comment; }
            
            public LocalDateTime getRatedAt() { return ratedAt; }
            public void setRatedAt(LocalDateTime ratedAt) { this.ratedAt = ratedAt; }
        }
        
        // Getters and setters
        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        
        public String getUserId() { return userId; }
        public void setUserId(String userId) { this.userId = userId; }
        
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        
        public String getRecipeId() { return recipeId; }
        public void setRecipeId(String recipeId) { this.recipeId = recipeId; }
        
        public String getRecipeTitle() { return recipeTitle; }
        public void setRecipeTitle(String recipeTitle) { this.recipeTitle = recipeTitle; }
        
        public LocalDateTime getSubmittedAt() { return submittedAt; }
        public void setSubmittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; }
        
        public List<String> getMediaUrls() { return mediaUrls; }
        public void setMediaUrls(List<String> mediaUrls) { this.mediaUrls = mediaUrls; }
        
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        
        public int getVotes() { return votes; }
        public void setVotes(int votes) { this.votes = votes; }
        
        public List<String> getVoterIds() { return voterIds; }
        public void setVoterIds(List<String> voterIds) { this.voterIds = voterIds; }
        
        public List<Rating> getRatings() { return ratings; }
        public void setRatings(List<Rating> ratings) { this.ratings = ratings; }
    }
    
    // Getters and setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getGroupId() { return groupId; }
    public void setGroupId(String groupId) { this.groupId = groupId; }
    
    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }
    
    public LocalDateTime getStartDate() { return startDate; }
    public void setStartDate(LocalDateTime startDate) { this.startDate = startDate; }
    
    public LocalDateTime getEndDate() { return endDate; }
    public void setEndDate(LocalDateTime endDate) { this.endDate = endDate; }
    
    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }
    
    public List<String> getIngredients() { return ingredients; }
    public void setIngredients(List<String> ingredients) { this.ingredients = ingredients; }
    
    public List<String> getRules() { return rules; }
    public void setRules(List<String> rules) { this.rules = rules; }
    
    public List<String> getCriteria() { return criteria; }
    public void setCriteria(List<String> criteria) { this.criteria = criteria; }
    
    public List<ChallengeSubmission> getSubmissions() { return submissions; }
    public void setSubmissions(List<ChallengeSubmission> submissions) { this.submissions = submissions; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    
    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }
    
    public int getParticipantCount() { return participantCount; }
    public void setParticipantCount(int participantCount) { this.participantCount = participantCount; }
    
    public boolean isFeatured() { return featured; }
    public void setFeatured(boolean featured) { this.featured = featured; }
}
