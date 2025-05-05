package com.example.backend.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "communities")
public class Community {
    @Id
    private String id;
    private String name;
    private String description;
    private String category;
    private String coverImage;
    private int memberCount;
    private boolean isPrivate;
    private LocalDateTime createdAt;
    private List<String> rules;
    
    @DBRef
    private List<User> members;
    
    @DBRef
    private List<User> moderators;
    
    @DBRef
    private List<CommunityPost> posts;
    
    @DBRef
    private List<CommunityEvent> events;

    public Community() {
        this.members = new ArrayList<>();
        this.moderators = new ArrayList<>();
        this.posts = new ArrayList<>();
        this.events = new ArrayList<>();
        this.rules = new ArrayList<>();
        this.createdAt = LocalDateTime.now();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getCoverImage() {
        return coverImage;
    }

    public void setCoverImage(String coverImage) {
        this.coverImage = coverImage;
    }

    public int getMemberCount() {
        return memberCount;
    }

    public void setMemberCount(int memberCount) {
        this.memberCount = memberCount;
    }

    public boolean isPrivate() {
        return isPrivate;
    }

    public void setPrivate(boolean isPrivate) {
        this.isPrivate = isPrivate;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public List<String> getRules() {
        return rules;
    }

    public void setRules(List<String> rules) {
        this.rules = rules;
    }

    public List<User> getMembers() {
        return members;
    }

    public void setMembers(List<User> members) {
        this.members = members;
    }

    public List<User> getModerators() {
        return moderators;
    }

    public void setModerators(List<User> moderators) {
        this.moderators = moderators;
    }

    public List<CommunityPost> getPosts() {
        return posts;
    }

    public void setPosts(List<CommunityPost> posts) {
        this.posts = posts;
    }

    public List<CommunityEvent> getEvents() {
        return events;
    }

    public void setEvents(List<CommunityEvent> events) {
        this.events = events;
    }
    
    public void addMember(User user) {
        if (!this.members.contains(user)) {
            this.members.add(user);
            this.memberCount++;
        }
    }
    
    public void removeMember(User user) {
        if (this.members.contains(user)) {
            this.members.remove(user);
            this.memberCount--;
        }
    }
    
    public void addModerator(User user) {
        if (!this.moderators.contains(user)) {
            this.moderators.add(user);
        }
    }
    
    public void removeModerator(User user) {
        this.moderators.remove(user);
    }
    
    public void addPost(CommunityPost post) {
        this.posts.add(post);
    }
    
    public void removePost(CommunityPost post) {
        this.posts.remove(post);
    }
    
    public void addEvent(CommunityEvent event) {
        this.events.add(event);
    }
    
    public void removeEvent(CommunityEvent event) {
        this.events.remove(event);
    }
}
