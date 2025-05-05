package com.example.backend.repositories;

import com.example.backend.models.Report;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ReportRepository extends MongoRepository<Report, String> {
    
    // Find reports by status
    Page<Report> findByStatus(String status, Pageable pageable);
    
    // Find reports by content type and ID
    List<Report> findByContentTypeAndContentId(String contentType, String contentId);
    
    // Find reports by reporter
    List<Report> findByReporterId(String reporterId);
    
    // Find recent reports with a specific status
    List<Report> findTop10ByStatusOrderByCreatedAtDesc(String status);
    
    // Count reports by status
    long countByStatus(String status);
    
    // Find reports created after a certain date
    List<Report> findByCreatedAtAfter(LocalDateTime date);
    
    // Find reports resolved after a certain date
    List<Report> findByResolvedAtAfter(LocalDateTime date);
    
    // Find reports by content type
    Page<Report> findByContentType(String contentType, Pageable pageable);
    
    // Find reports by content type and status
    Page<Report> findByContentTypeAndStatus(String contentType, String status, Pageable pageable);
}
