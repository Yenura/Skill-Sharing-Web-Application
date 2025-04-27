package com.example.backend.services;

import com.example.backend.models.Content;
import com.example.backend.models.Section;
import com.example.backend.repositories.ContentRepository;
import com.example.backend.repositories.SectionRepository;
import com.example.backend.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import jakarta.validation.Valid;

import java.util.List;

@Service
public class ContentService {
    private final ContentRepository contentRepository;
    private final SectionRepository sectionRepository;

    @Autowired
    public ContentService(ContentRepository contentRepository, SectionRepository sectionRepository) {
        this.contentRepository = contentRepository;
        this.sectionRepository = sectionRepository;
    }

    @Transactional
    public Content createContent(String sectionId, @Valid Content content) {
        Section section = sectionRepository.findById(sectionId)
            .orElseThrow(() -> new ResourceNotFoundException("Section not found with id: " + sectionId));
        
        content.setSectionId(sectionId);
        
        // Set the order index to be the last in the section
        long currentCount = contentRepository.countBySectionId(sectionId);
        content.setOrderIndex((int) currentCount + 1);
        
        Content savedContent = contentRepository.save(content);
        
        // Update section's contentIds list
        List<String> contentIds = section.getContentIds();
        contentIds.add(savedContent.getId());
        section.setContentIds(contentIds);
        sectionRepository.save(section);
        
        return savedContent;
    }

    public Content getContent(String contentId) {
        return contentRepository.findById(contentId)
            .orElseThrow(() -> new ResourceNotFoundException("Content not found with id: " + contentId));
    }

    public List<Content> getContentBySection(String sectionId) {
        return contentRepository.findBySectionId(sectionId);
    }

    @Transactional
    public Content updateContent(String contentId, @Valid Content contentDetails) {
        Content content = getContent(contentId);
        
        content.setTitle(contentDetails.getTitle());
        content.setDescription(contentDetails.getDescription());
        content.setType(contentDetails.getType());
        content.setContent(contentDetails.getContent());
        content.setMediaUrl(contentDetails.getMediaUrl());
        content.setDurationMinutes(contentDetails.getDurationMinutes());
        
        return contentRepository.save(content);
    }

    @Transactional
    public void deleteContent(String contentId) {
        Content content = getContent(contentId);
        String sectionId = content.getSectionId();
        
        // Remove content ID from section's contentIds list
        Section section = sectionRepository.findById(sectionId)
            .orElseThrow(() -> new ResourceNotFoundException("Section not found with id: " + sectionId));
        List<String> contentIds = section.getContentIds();
        contentIds.remove(contentId);
        section.setContentIds(contentIds);
        sectionRepository.save(section);
        
        contentRepository.delete(content);
        
        // Reorder remaining content in the section
        List<Content> remainingContent = getContentBySection(sectionId);
        for (int i = 0; i < remainingContent.size(); i++) {
            Content item = remainingContent.get(i);
            item.setOrderIndex(i + 1);
            contentRepository.save(item);
        }
    }

    @Transactional
    public void reorderContent(String sectionId, List<String> contentIds) {
        Section section = sectionRepository.findById(sectionId)
            .orElseThrow(() -> new ResourceNotFoundException("Section not found with id: " + sectionId));
            
        // Update section's contentIds list
        section.setContentIds(contentIds);
        sectionRepository.save(section);
        
        // Update order index for each content
        for (int i = 0; i < contentIds.size(); i++) {
            Content content = getContent(contentIds.get(i));
            content.setOrderIndex(i + 1);
            contentRepository.save(content);
        }
    }
} 
