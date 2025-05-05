package com.example.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<?> handleResourceNotFoundException(
            ResourceNotFoundException ex, WebRequest request) {
        ErrorDetails errorDetails = new ErrorDetails(
                new Date(), ex.getMessage(), request.getDescription(false));
        return new ResponseEntity<>(errorDetails, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<?> handleBadCredentialsException(
            BadCredentialsException ex, WebRequest request) {
        ErrorDetails errorDetails = new ErrorDetails(
                new Date(), "Invalid username or password", request.getDescription(false));
        return new ResponseEntity<>(errorDetails, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<?> handleUsernameNotFoundException(
            UsernameNotFoundException ex, WebRequest request) {
        ErrorDetails errorDetails = new ErrorDetails(
                new Date(), ex.getMessage(), request.getDescription(false));
        return new ResponseEntity<>(errorDetails, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValidationExceptions(
            MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(LearningException.class)
    public ResponseEntity<?> handleLearningException(LearningException ex, WebRequest request) {
        Map<String, Object> errorDetails = new HashMap<>();
        errorDetails.put("timestamp", new Date());
        errorDetails.put("message", ex.getMessage());
        errorDetails.put("errorCode", ex.getErrorCode());
        errorDetails.put("path", request.getDescription(false));

        HttpStatus status;
        if (ex instanceof LearningException.MilestoneNotFoundException) {
            status = HttpStatus.NOT_FOUND;
        } else if (ex instanceof LearningException.InvalidMilestoneException) {
            status = HttpStatus.BAD_REQUEST;
        } else if (ex instanceof LearningException.UnauthorizedAccessException) {
            status = HttpStatus.FORBIDDEN;
        } else {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
        }

        return new ResponseEntity<>(errorDetails, status);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<?> handleIllegalArgumentException(IllegalArgumentException ex, WebRequest request) {
        Map<String, Object> errorDetails = new HashMap<>();
        errorDetails.put("timestamp", new Date());
        errorDetails.put("message", ex.getMessage());
        errorDetails.put("path", request.getDescription(false));

        return new ResponseEntity<>(errorDetails, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleGlobalException(Exception ex, WebRequest request) {
        Map<String, Object> errorDetails = new HashMap<>();
        errorDetails.put("timestamp", new Date());
        errorDetails.put("message", "An unexpected error occurred");
        errorDetails.put("error", ex.getMessage());
        errorDetails.put("path", request.getDescription(false));

        return new ResponseEntity<>(errorDetails, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(SearchException.class)
    public ResponseEntity<?> handleSearchException(SearchException ex, WebRequest request) {
        Map<String, Object> errorDetails = new HashMap<>();
        errorDetails.put("timestamp", new Date());
        errorDetails.put("message", ex.getMessage());
        errorDetails.put("errorCode", ex.getErrorCode());
        errorDetails.put("path", request.getDescription(false));

        return new ResponseEntity<>(errorDetails, HttpStatus.BAD_REQUEST);
    }
}