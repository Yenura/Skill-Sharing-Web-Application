package com.example.backend.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "reports")
public class Report {
    @Id
    private String id;
    
    private String reporterId;
    private String reporterUsername;
    private String contentType; // RECIPE, COMMENT, USER, GROUP
    private String contentId;
    private String reason;
    private String details;
    private String status; // PENDING, REVIEWED, RESOLVED, DISMISSED
    private LocalDateTime createdAt;
    private LocalDateTime resolvedAt;
    private String moderatorNote;
    
    public Report() {
        this.createdAt = LocalDateTime.now();
        this.status = "PENDING";
    }
    
    // Getters and setters
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    
    public String getReporterId() {
        return reporterId;
    }
    
    public void setReporterId(String reporterId) {
        this.reporterId = reporterId;
    }
    
    public String getReporterUsername() {
        return reporterUsername;
    }
    
    public void setReporterUsername(String reporterUsername) {
        this.reporterUsername = reporterUsername;
    }
    
    public String getContentType() {
        return contentType;
    }
    
    public void setContentType(String contentType) {
        this.contentType = contentType;
    }
    
    public String getContentId() {
        return contentId;
    }
    
    public void setContentId(String contentId) {
        this.contentId = contentId;
    }
    
    public String getReason() {
        return reason;
    }
    
    public void setReason(String reason) {
        this.reason = reason;
    }
    
    public String getDetails() {
        return details;
    }
    
    public void setDetails(String details) {
        this.details = details;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getResolvedAt() {
        return resolvedAt;
    }
    
    public void setResolvedAt(LocalDateTime resolvedAt) {
        this.resolvedAt = resolvedAt;
    }
    
    public String getModeratorNote() {
        return moderatorNote;
    }
    
    public void setModeratorNote(String moderatorNote) {
        this.moderatorNote = moderatorNote;
    }
}
