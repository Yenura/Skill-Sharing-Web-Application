package com.example.backend.controllers;

import com.example.backend.models.Content;
import com.example.backend.services.ContentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/content")
public class ContentController {
    private final ContentService contentService;

    @Autowired
    public ContentController(ContentService contentService) {
        this.contentService = contentService;
    }

    @PostMapping("/section/{sectionId}")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<Content> createContent(
            @PathVariable String sectionId,
            @Valid @RequestBody Content content) {
        Content newContent = contentService.createContent(sectionId, content);
        return ResponseEntity.ok(newContent);
    }

    @GetMapping("/{contentId}")
    public ResponseEntity<Content> getContent(@PathVariable String contentId) {
        Content content = contentService.getContent(contentId);
        return ResponseEntity.ok(content);
    }

    @GetMapping("/section/{sectionId}")
    public ResponseEntity<List<Content>> getContentBySection(@PathVariable String sectionId) {
        List<Content> content = contentService.getContentBySection(sectionId);
        return ResponseEntity.ok(content);
    }

    @PutMapping("/{contentId}")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<Content> updateContent(
            @PathVariable String contentId,
            @Valid @RequestBody Content contentDetails) {
        Content updatedContent = contentService.updateContent(contentId, contentDetails);
        return ResponseEntity.ok(updatedContent);
    }

    @DeleteMapping("/{contentId}")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<Void> deleteContent(@PathVariable String contentId) {
        contentService.deleteContent(contentId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/section/{sectionId}/reorder")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<Void> reorderContent(
            @PathVariable String sectionId,
            @RequestBody List<String> contentIds) {
        contentService.reorderContent(sectionId, contentIds);
        return ResponseEntity.ok().build();
    }
} 
