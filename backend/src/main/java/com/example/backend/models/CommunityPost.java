package com.example.backend.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "communityPosts")
public class CommunityPost {
    @Id
    private String id;
    private String title;
    private String content;
    private List<String> images;
    
    @DBRef
    private User author;
    
    @DBRef
    private Community community;
    
    private LocalDateTime createdAt;
    private int likes;
    
    @DBRef
    private List<Comment> comments;

    public CommunityPost() {
        this.images = new ArrayList<>();
        this.comments = new ArrayList<>();
        this.createdAt = LocalDateTime.now();
        this.likes = 0;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public List<String> getImages() {
        return images;
    }

    public void setImages(List<String> images) {
        this.images = images;
    }

    public User getAuthor() {
        return author;
    }

    public void setAuthor(User author) {
        this.author = author;
    }

    public Community getCommunity() {
        return community;
    }

    public void setCommunity(Community community) {
        this.community = community;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public int getLikes() {
        return likes;
    }

    public void setLikes(int likes) {
        this.likes = likes;
    }

    public List<Comment> getComments() {
        return comments;
    }

    public void setComments(List<Comment> comments) {
        this.comments = comments;
    }
    
    public void addComment(Comment comment) {
        this.comments.add(comment);
    }
    
    public void removeComment(Comment comment) {
        this.comments.remove(comment);
    }
    
    public void incrementLikes() {
        this.likes++;
    }
    
    public void decrementLikes() {
        if (this.likes > 0) {
            this.likes--;
        }
    }
    
    public void addImage(String imageUrl) {
        this.images.add(imageUrl);
    }
    
    public void removeImage(String imageUrl) {
        this.images.remove(imageUrl);
    }
}
