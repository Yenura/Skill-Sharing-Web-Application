package com.example.backend.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;

public class ErrorResponseDTO {
    private String errorCode;
    private String message;
    private List<String> details;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime timestamp;
    
    private String path;
    private int status;

    public ErrorResponseDTO() {
        this.timestamp = LocalDateTime.now();
        this.details = new ArrayList<>();
    }

    public ErrorResponseDTO(String errorCode, String message, String path, int status) {
        this();
        this.errorCode = errorCode;
        this.message = message;
        this.path = path;
        this.status = status;
    }

    public void addDetail(String detail) {
        if (this.details == null) {
            this.details = new ArrayList<>();
        }
        this.details.add(detail);
    }

    // Getters and Setters
    public String getErrorCode() { return errorCode; }
    public void setErrorCode(String errorCode) { this.errorCode = errorCode; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public List<String> getDetails() { return details; }
    public void setDetails(List<String> details) { this.details = details; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    public String getPath() { return path; }
    public void setPath(String path) { this.path = path; }

    public int getStatus() { return status; }
    public void setStatus(int status) { this.status = status; }
}