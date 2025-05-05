package com.example.backend.exception;

public class SearchException extends RuntimeException {
    private String errorCode;

    public SearchException(String message) {
        super(message);
    }

    public SearchException(String message, String errorCode) {
        super(message);
        this.errorCode = errorCode;
    }

    public String getErrorCode() {
        return errorCode;
    }

    public static class InvalidSearchCriteriaException extends SearchException {
        public InvalidSearchCriteriaException(String message) {
            super(message, "SEARCH_400");
        }
    }

    public static class SearchExecutionException extends SearchException {
        public SearchExecutionException(String message) {
            super(message, "SEARCH_500");
        }
    }

    public static class SearchTimeoutException extends SearchException {
        public SearchTimeoutException(String message) {
            super(message, "SEARCH_408");
        }
    }
    
    public static class TooManyResultsException extends SearchException {
        public TooManyResultsException(String message) {
            super(message, "SEARCH_413");
        }
    }

    public static class NoResultsFoundException extends SearchException {
        public NoResultsFoundException(String message) {
            super(message, "SEARCH_404");
        }
    }
}