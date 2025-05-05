package com.example.backend.services;

import com.example.backend.models.MediaAsset;
import com.example.backend.repositories.MediaAssetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class MediaAssetService {
    
    @Autowired
    private MediaAssetRepository mediaAssetRepository;
    
    private static final int MAX_VIDEO_DURATION = 30; // seconds
    private static final long MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
    private static final String[] ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/gif"};
    private static final String[] ALLOWED_VIDEO_TYPES = {"video/mp4", "video/quicktime"};

    @Transactional
    public MediaAsset uploadMedia(MultipartFile file, String ownerId) throws IOException {
        validateFile(file);
        
        MediaAsset mediaAsset = new MediaAsset();
        mediaAsset.setOwnerId(ownerId);
        mediaAsset.setOriginalFileName(StringUtils.cleanPath(file.getOriginalFilename()));
        mediaAsset.setFileSize(file.getSize());
        mediaAsset.setMimeType(file.getContentType());
        mediaAsset.setType(file.getContentType().startsWith("image/") ? "IMAGE" : "VIDEO");
        
        // Generate unique filename
        String filename = UUID.randomUUID().toString() + "_" + mediaAsset.getOriginalFileName();
        
        // Process and store the file
        if (mediaAsset.getType().equals("IMAGE")) {
            processImage(file, mediaAsset);
        } else {
            processVideo(file, mediaAsset);
        }
        
        return mediaAssetRepository.save(mediaAsset);
    }

    private void validateFile(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }
        
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("File size exceeds maximum limit");
        }
        
        String contentType = file.getContentType();
        boolean isAllowed = false;
        
        for (String type : ALLOWED_IMAGE_TYPES) {
            if (type.equals(contentType)) {
                isAllowed = true;
                break;
            }
        }
        
        for (String type : ALLOWED_VIDEO_TYPES) {
            if (type.equals(contentType)) {
                isAllowed = true;
                // Validate video duration
                if (getVideoDuration(file) > MAX_VIDEO_DURATION) {
                    throw new IllegalArgumentException("Video duration exceeds 30 seconds limit");
                }
                break;
            }
        }
        
        if (!isAllowed) {
            throw new IllegalArgumentException("File type not allowed");
        }
    }

    private void processImage(MultipartFile file, MediaAsset mediaAsset) throws IOException {
        BufferedImage originalImage = ImageIO.read(new ByteArrayInputStream(file.getBytes()));
        
        // Create variants
        Map<String, String> variants = new HashMap<>();
        variants.put("original", saveImage(originalImage, file.getOriginalFilename()));
        variants.put("thumbnail", createAndSaveThumbnail(originalImage, file.getOriginalFilename()));
        variants.put("medium", createAndSaveMediumSize(originalImage, file.getOriginalFilename()));
        
        mediaAsset.setVariants(variants);
        mediaAsset.setUrl(variants.get("original"));
        mediaAsset.setThumbnailUrl(variants.get("thumbnail"));
    }

    private void processVideo(MultipartFile file, MediaAsset mediaAsset) throws IOException {
        // Process video and create thumbnail
        String videoUrl = saveVideo(file);
        String thumbnailUrl = generateVideoThumbnail(file);
        
        Map<String, String> variants = new HashMap<>();
        variants.put("original", videoUrl);
        variants.put("thumbnail", thumbnailUrl);
        
        mediaAsset.setVariants(variants);
        mediaAsset.setUrl(videoUrl);
        mediaAsset.setThumbnailUrl(thumbnailUrl);
        mediaAsset.setDuration(getVideoDuration(file));
    }

    private String saveImage(BufferedImage image, String filename) {
        // Implementation for saving image to storage/CDN
        return ""; // Return URL of saved image
    }

    private String saveVideo(MultipartFile video) {
        // Implementation for saving video to storage/CDN
        return ""; // Return URL of saved video
    }

    private String createAndSaveThumbnail(BufferedImage original, String filename) {
        // Implementation for creating and saving thumbnail
        return ""; // Return URL of thumbnail
    }

    private String createAndSaveMediumSize(BufferedImage original, String filename) {
        // Implementation for creating and saving medium size
        return ""; // Return URL of medium size
    }

    private String generateVideoThumbnail(MultipartFile video) {
        // Implementation for generating video thumbnail
        return ""; // Return URL of thumbnail
    }

    private int getVideoDuration(MultipartFile video) {
        // Implementation for getting video duration
        return 0; // Return duration in seconds
    }

    @Transactional
    public void deleteMedia(String id, String ownerId) {
        mediaAssetRepository.deleteByOwnerIdAndId(ownerId, id);
    }

    public List<MediaAsset> getMediaByOwner(String ownerId) {
        return mediaAssetRepository.findByOwnerId(ownerId);
    }

    public List<MediaAsset> getMediaByOwnerAndType(String ownerId, String type) {
        return mediaAssetRepository.findByOwnerIdAndType(ownerId, type);
    }
}