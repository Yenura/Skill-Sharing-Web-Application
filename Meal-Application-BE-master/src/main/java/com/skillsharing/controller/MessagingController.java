package com.skillsharing.controller;

import com.skillsharing.model.Message;
import com.skillsharing.model.User;
import com.skillsharing.repository.MessageRepository;
import com.skillsharing.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/messages")
@RequiredArgsConstructor
public class MessagingController {
    
    private static final Logger logger = LoggerFactory.getLogger(MessagingController.class);
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    
    // Send a message
    @PostMapping("/send/{receiverId}")
    public ResponseEntity<?> sendMessage(@PathVariable String receiverId, @RequestBody Map<String, String> messageRequest) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUserEmail = authentication.getName();
        
        Optional<User> currentUserOpt = userRepository.findByEmail(currentUserEmail);
        Optional<User> receiverUserOpt = userRepository.findById(receiverId);
        
        if (currentUserOpt.isEmpty() || receiverUserOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }
        
        User currentUser = currentUserOpt.get();
        
        if (messageRequest.get("content") == null || messageRequest.get("content").trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Message content cannot be empty");
        }
        
        Message message = new Message();
        message.setSenderId(currentUser.getId());
        message.setReceiverId(receiverId);
        message.setContent(messageRequest.get("content"));
        message.setRead(false);
        message.setCreatedAt(LocalDateTime.now());
        
        Message savedMessage = messageRepository.save(message);
        
        return ResponseEntity.ok(savedMessage);
    }
    
    // Get conversation with a user
    @GetMapping("/conversation/{userId}")
    public ResponseEntity<?> getConversation(@PathVariable String userId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUserEmail = authentication.getName();
        
        Optional<User> currentUserOpt = userRepository.findByEmail(currentUserEmail);
        
        if (currentUserOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }
        
        User currentUser = currentUserOpt.get();
        
        // Get all messages between the two users
        List<Message> messages = messageRepository.findMessagesBetweenUsers(currentUser.getId(), userId);
        
        // Sort by timestamp
        messages.sort(Comparator.comparing(Message::getCreatedAt));
        
        // Mark received messages as read
        for (Message message : messages) {
            if (message.getReceiverId().equals(currentUser.getId()) && !message.isRead()) {
                message.setRead(true);
                messageRepository.save(message);
            }
        }
        
        return ResponseEntity.ok(messages);
    }
    
    // Get all conversations
    @GetMapping("/conversations")
    public ResponseEntity<?> getAllConversations() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUserEmail = authentication.getName();
        
        Optional<User> currentUserOpt = userRepository.findByEmail(currentUserEmail);
        
        if (currentUserOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }
        
        User currentUser = currentUserOpt.get();
        
        // Get all messages sent or received by the current user
        List<Message> allMessages = messageRepository.findAllBySenderIdOrReceiverId(currentUser.getId());
        
        // Extract unique conversation partners
        Set<String> partnerIds = new HashSet<>();
        for (Message message : allMessages) {
            if (message.getSenderId().equals(currentUser.getId())) {
                partnerIds.add(message.getReceiverId());
            } else {
                partnerIds.add(message.getSenderId());
            }
        }
        
        // Fetch user details and latest message for each conversation
        List<Map<String, Object>> conversations = new ArrayList<>();
        for (String partnerId : partnerIds) {
            Optional<User> partnerOpt = userRepository.findById(partnerId);
            if (partnerOpt.isPresent()) {
                User partner = partnerOpt.get();
                
                // Get the latest message in this conversation
                List<Message> conversationMessages = messageRepository.findMessagesBetweenUsers(currentUser.getId(), partnerId);
                conversationMessages.sort((m1, m2) -> m2.getCreatedAt().compareTo(m1.getCreatedAt()));
                
                Message latestMessage = !conversationMessages.isEmpty() ? conversationMessages.get(0) : null;
                
                // Count unread messages
                long unreadCount = conversationMessages.stream()
                    .filter(m -> m.getReceiverId().equals(currentUser.getId()) && !m.isRead())
                    .count();
                
                Map<String, Object> conversation = new HashMap<>();
                conversation.put("userId", partner.getId());
                conversation.put("username", partner.getUsername());
                conversation.put("firstName", partner.getFirstName());
                conversation.put("lastName", partner.getLastName());
                conversation.put("profilePicture", partner.getProfilePicture());
                conversation.put("latestMessage", latestMessage);
                conversation.put("unreadCount", unreadCount);
                
                conversations.add(conversation);
            }
        }
        
        // Sort by latest message timestamp
        conversations.sort((c1, c2) -> {
            Message m1 = (Message) c1.get("latestMessage");
            Message m2 = (Message) c2.get("latestMessage");
            
            if (m1 == null) return 1;
            if (m2 == null) return -1;
            
            return m2.getCreatedAt().compareTo(m1.getCreatedAt());
        });
        
        return ResponseEntity.ok(conversations);
    }
    
    // Get unread message count
    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Long>> getUnreadMessageCount() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUserEmail = authentication.getName();
        
        Optional<User> currentUserOpt = userRepository.findByEmail(currentUserEmail);
        if (currentUserOpt.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        User currentUser = currentUserOpt.get();
        long count = messageRepository.countByReceiverIdAndRead(currentUser.getId(), false);
        
        Map<String, Long> response = new HashMap<>();
        response.put("count", count);
        
        return ResponseEntity.ok(response);
    }
}
