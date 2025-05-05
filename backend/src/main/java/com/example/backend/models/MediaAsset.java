package com.example.backend.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.Map;

@Document(collection = "media_assets")
public class MediaAsset {
    @Id
    private String id;
    private String type; // IMAGE or VIDEO
    private String url;
    private String thumbnailUrl;
    private Integer duration; // for videos in seconds
    private Map<String, String> variants; // different sizes/formats
    private String originalFileName;
    private Long fileSize;
    private String mimeType;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String ownerId;

    public MediaAsset() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    
    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }
    
    public String getThumbnailUrl() { return thumbnailUrl; }
    public void setThumbnailUrl(String thumbnailUrl) { this.thumbnailUrl = thumbnailUrl; }
    
    public Integer getDuration() { return duration; }
    public void setDuration(Integer duration) { this.duration = duration; }
    
    public Map<String, String> getVariants() { return variants; }
    public void setVariants(Map<String, String> variants) { this.variants = variants; }
    
    public String getOriginalFileName() { return originalFileName; }
    public void setOriginalFileName(String originalFileName) { this.originalFileName = originalFileName; }
    
    public Long getFileSize() { return fileSize; }
    public void setFileSize(Long fileSize) { this.fileSize = fileSize; }
    
    public String getMimeType() { return mimeType; }
    public void setMimeType(String mimeType) { this.mimeType = mimeType; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    public String getOwnerId() { return ownerId; }
    public void setOwnerId(String ownerId) { this.ownerId = ownerId; }
}