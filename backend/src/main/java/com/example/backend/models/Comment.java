package com.example.backend.models;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document
public class Comment {
    @Id
    private String id;

    private String content;

    private User author;

    public User getAuthor() {
        return author;
    }

    public void setAuthor(User author) {
        this.author = author;
    }

    @DBRef
    private Recipe post;

    public Recipe getPost() {
        return post;
    }

    private Comment parent;

    private List<Comment> replies = new ArrayList<>();

    public String getContent() {
        return content;
    }

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}