package com.example.backend.listeners;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;
import org.springframework.web.socket.messaging.SessionSubscribeEvent;
import org.springframework.web.socket.messaging.SessionUnsubscribeEvent;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class WebSocketEventListener {
    private static final Logger logger = LoggerFactory.getLogger(WebSocketEventListener.class);
    
    // Track active sessions and their subscriptions
    private final Map<String, String> sessionUsers = new ConcurrentHashMap<>();
    private final Map<String, Integer> userConnectionCount = new ConcurrentHashMap<>();

    @EventListener
    public void handleWebSocketConnectListener(SessionConnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String sessionId = headerAccessor.getSessionId();
        String userId = getUserId(headerAccessor);
        
        if (userId != null) {
            sessionUsers.put(sessionId, userId);
            userConnectionCount.merge(userId, 1, Integer::sum);
            logger.info("User {} connected. Session ID: {}. Total connections: {}", 
                userId, sessionId, userConnectionCount.get(userId));
        }
    }

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String sessionId = headerAccessor.getSessionId();
        String userId = sessionUsers.remove(sessionId);
        
        if (userId != null) {
            int connections = userConnectionCount.merge(userId, -1, Integer::sum);
            if (connections <= 0) {
                userConnectionCount.remove(userId);
                logger.info("User {} disconnected and has no active connections", userId);
            } else {
                logger.info("User {} disconnected. Remaining connections: {}", userId, connections);
            }
        }
    }

    @EventListener
    public void handleWebSocketSubscribeListener(SessionSubscribeEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String sessionId = headerAccessor.getSessionId();
        String destination = headerAccessor.getDestination();
        String userId = sessionUsers.get(sessionId);
        
        logger.debug("Session {} (User: {}) subscribed to {}", 
            sessionId, userId, destination);
    }

    @EventListener
    public void handleWebSocketUnsubscribeListener(SessionUnsubscribeEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String sessionId = headerAccessor.getSessionId();
        String destination = headerAccessor.getDestination();
        String userId = sessionUsers.get(sessionId);
        
        logger.debug("Session {} (User: {}) unsubscribed from {}", 
            sessionId, userId, destination);
    }

    private String getUserId(SimpMessageHeaderAccessor headerAccessor) {
        // Try to get user ID from the message headers
        Object raw = headerAccessor.getUser();
        if (raw != null) {
            return raw.toString();
        }
        
        // Try to get from session attributes
        Map<String, Object> attributes = headerAccessor.getSessionAttributes();
        if (attributes != null && attributes.containsKey("userId")) {
            return attributes.get("userId").toString();
        }
        
        return null;
    }

    public boolean isUserConnected(String userId) {
        return userConnectionCount.containsKey(userId) && 
               userConnectionCount.get(userId) > 0;
    }

    public int getUserConnectionCount(String userId) {
        return userConnectionCount.getOrDefault(userId, 0);
    }

    public Map<String, Integer> getActiveUsers() {
        return new ConcurrentHashMap<>(userConnectionCount);
    }
}