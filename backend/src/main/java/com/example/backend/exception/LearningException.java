package com.example.backend.exception;

public class LearningException extends RuntimeException {
    private String errorCode;

    public LearningException(String message) {
        super(message);
    }

    public LearningException(String message, String errorCode) {
        super(message);
        this.errorCode = errorCode;
    }

    public LearningException(String message, Throwable cause) {
        super(message, cause);
    }

    public LearningException(String message, String errorCode, Throwable cause) {
        super(message, cause);
        this.errorCode = errorCode;
    }

    public String getErrorCode() {
        return errorCode;
    }

    public static class MilestoneNotFoundException extends LearningException {
        public MilestoneNotFoundException(String id) {
            super("Milestone not found with id: " + id, "MILESTONE_404");
        }
    }

    public static class InvalidMilestoneException extends LearningException {
        public InvalidMilestoneException(String message) {
            super(message, "MILESTONE_400");
        }
    }

    public static class UnauthorizedAccessException extends LearningException {
        public UnauthorizedAccessException(String message) {
            super(message, "UNAUTHORIZED_403");
        }
    }

    public static class ProgressTrackingException extends LearningException {
        public ProgressTrackingException(String message) {
            super(message, "PROGRESS_500");
        }
    }
}