package com.example.backend.filters;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.UUID;

@Component
@Order(1)
public class RequestTrackingFilter extends OncePerRequestFilter {
    
    private static final Logger logger = LoggerFactory.getLogger(RequestTrackingFilter.class);
    private static final String REQUEST_ID_HEADER = "X-Request-ID";
    private static final String REQUEST_TIME_HEADER = "X-Request-Time";

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, 
                                  FilterChain filterChain) throws ServletException, IOException {
        long startTime = System.currentTimeMillis();
        String requestId = getOrGenerateRequestId(request);
        
        try {
            MDC.put("requestId", requestId);
            MDC.put("remoteAddr", request.getRemoteAddr());
            MDC.put("method", request.getMethod());
            MDC.put("uri", request.getRequestURI());
            
            // Add request ID to response headers
            response.setHeader(REQUEST_ID_HEADER, requestId);
            
            // Log request details
            logger.info("Incoming request: method={}, uri={}, remoteAddr={}, requestId={}", 
                request.getMethod(), request.getRequestURI(), request.getRemoteAddr(), requestId);
            
            // Continue with the request
            filterChain.doFilter(request, response);
        } finally {
            // Calculate and log request duration
            long duration = System.currentTimeMillis() - startTime;
            response.setHeader(REQUEST_TIME_HEADER, String.valueOf(duration));
            
            logger.info("Request completed: method={}, uri={}, duration={}ms, status={}", 
                request.getMethod(), request.getRequestURI(), duration, response.getStatus());
            
            // Clean up MDC
            MDC.clear();
        }
    }

    private String getOrGenerateRequestId(HttpServletRequest request) {
        String requestId = request.getHeader(REQUEST_ID_HEADER);
        if (requestId == null || requestId.isEmpty()) {
            requestId = UUID.randomUUID().toString();
        }
        return requestId;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        // Skip tracking for health checks and static resources
        return path.contains("/health") || 
               path.contains("/static/") ||
               path.endsWith(".ico");
    }
}