package com.example.backend.utils;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Map;

@Component
public class CDNUtils {

    @Value("${cdn.base-path:/app/cdn}")
    private String basePath;

    @Value("${cdn.url:http://localhost:8080/cdn}")
    private String cdnUrl;

    private final Map<String, String> mimeTypeMap = new ConcurrentHashMap<>();

    public CDNUtils() {
        // Initialize common MIME types
        mimeTypeMap.put("jpg", "image/jpeg");
        mimeTypeMap.put("jpeg", "image/jpeg");
        mimeTypeMap.put("png", "image/png");
        mimeTypeMap.put("gif", "image/gif");
        mimeTypeMap.put("webp", "image/webp");
        mimeTypeMap.put("mp4", "video/mp4");
        mimeTypeMap.put("pdf", "application/pdf");
    }

    public String uploadFile(MultipartFile file, String category) throws IOException {
        String originalFilename = file.getOriginalFilename();
        String extension = getFileExtension(originalFilename);
        String uniqueFilename = generateUniqueFilename(extension);
        
        // Create category directory if it doesn't exist
        Path categoryPath = Paths.get(basePath, category);
        Files.createDirectories(categoryPath);
        
        // Save file
        Path filePath = categoryPath.resolve(uniqueFilename);
        Files.copy(file.getInputStream(), filePath);
        
        // Return CDN URL
        return String.format("%s/%s/%s", cdnUrl, category, uniqueFilename);
    }

    public void deleteFile(String fileUrl) throws IOException {
        String relativePath = fileUrl.substring(cdnUrl.length());
        Path filePath = Paths.get(basePath, relativePath);
        Files.deleteIfExists(filePath);
    }

    public String getContentType(String filename) {
        String extension = getFileExtension(filename).toLowerCase();
        return mimeTypeMap.getOrDefault(extension, "application/octet-stream");
    }

    public boolean isImageFile(String filename) {
        String contentType = getContentType(filename);
        return contentType.startsWith("image/");
    }

    public boolean isValidFile(String filename) {
        String extension = getFileExtension(filename).toLowerCase();
        return mimeTypeMap.containsKey(extension);
    }

    private String generateUniqueFilename(String extension) {
        return UUID.randomUUID().toString() + "." + extension;
    }

    private String getFileExtension(String filename) {
        if (filename == null || filename.lastIndexOf(".") == -1) {
            return "";
        }
        return filename.substring(filename.lastIndexOf(".") + 1);
    }

    public String optimizeImageUrl(String url, int width, int height, String format) {
        if (url == null || url.isEmpty()) {
            return url;
        }

        // Add image optimization parameters
        return String.format("%s?w=%d&h=%d&fmt=%s", url, width, height, format);
    }

    public Map<String, String> generateImageVariants(String originalUrl) {
        Map<String, String> variants = new ConcurrentHashMap<>();
        
        // Generate different sizes for responsive images
        variants.put("thumbnail", optimizeImageUrl(originalUrl, 150, 150, "webp"));
        variants.put("small", optimizeImageUrl(originalUrl, 300, 300, "webp"));
        variants.put("medium", optimizeImageUrl(originalUrl, 600, 600, "webp"));
        variants.put("large", optimizeImageUrl(originalUrl, 1200, 1200, "webp"));
        variants.put("original", originalUrl);
        
        return variants;
    }

    public String getCachePath(String url) {
        try {
            String relativePath = url.substring(cdnUrl.length());
            return Paths.get(basePath, "cache", relativePath).toString();
        } catch (Exception e) {
            return null;
        }
    }
}