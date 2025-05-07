package com.skillsharing.dto;

import com.skillsharing.model.Community;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

public class CommunityDTO {
    private String id;
    private String name;
    private String description;
    private String category;
    private String creatorId;
    private String creatorName;
    private LocalDateTime createdAt;
    private String coverImage;
    private Set<String> members = new HashSet<>();
    private Set<String> moderators = new HashSet<>();
    private Set<String> posts = new HashSet<>();
    private boolean isPrivate;
    private int memberCount;
    private int postCount;
    private boolean isMember;
    private boolean isModerator;
    
    // Default constructor
    public CommunityDTO() {
    }
    
    // Constructor from Community entity
    public CommunityDTO(Community community) {
        this.id = community.getId();
        this.name = community.getName();
        this.description = community.getDescription();
        this.category = community.getCategory();
        this.creatorId = community.getCreatorId();
        this.createdAt = community.getCreatedAt();
        this.coverImage = community.getCoverImage();
        this.members = community.getMembers();
        this.moderators = community.getModerators();
        this.posts = community.getPosts();
        this.isPrivate = community.isPrivate();
        this.memberCount = community.getMembers().size();
        this.postCount = community.getPosts().size();
    }
    
    // Getters and Setters
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

    public String getCreatorId() {
        return creatorId;
    }

    public void setCreatorId(String creatorId) {
        this.creatorId = creatorId;
    }

    public String getCreatorName() {
        return creatorName;
    }

    public void setCreatorName(String creatorName) {
        this.creatorName = creatorName;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getCoverImage() {
        return coverImage;
    }

    public void setCoverImage(String coverImage) {
        this.coverImage = coverImage;
    }

    public Set<String> getMembers() {
        return members;
    }

    public void setMembers(Set<String> members) {
        this.members = members;
    }

    public Set<String> getModerators() {
        return moderators;
    }

    public void setModerators(Set<String> moderators) {
        this.moderators = moderators;
    }

    public Set<String> getPosts() {
        return posts;
    }

    public void setPosts(Set<String> posts) {
        this.posts = posts;
    }

    public boolean isPrivate() {
        return isPrivate;
    }

    public void setPrivate(boolean isPrivate) {
        this.isPrivate = isPrivate;
    }

    public int getMemberCount() {
        return memberCount;
    }

    public void setMemberCount(int memberCount) {
        this.memberCount = memberCount;
    }

    public int getPostCount() {
        return postCount;
    }

    public void setPostCount(int postCount) {
        this.postCount = postCount;
    }

    public boolean isMember() {
        return isMember;
    }

    public void setMember(boolean isMember) {
        this.isMember = isMember;
    }

    public boolean isModerator() {
        return isModerator;
    }

    public void setModerator(boolean isModerator) {
        this.isModerator = isModerator;
    }
}
