package com.skillsharing.repository;

import com.skillsharing.model.Message;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface MessageRepository extends MongoRepository<Message, String> {
    List<Message> findBySenderIdAndReceiverIdOrderByCreatedAtDesc(String senderId, String receiverId);
    List<Message> findByReceiverIdAndReadOrderByCreatedAtDesc(String receiverId, boolean read);
    long countByReceiverIdAndRead(String receiverId, boolean read);
    
    // Find all conversations for a user (messages where user is either sender or receiver)
    @Query("{ $or: [ { 'senderId': ?0 }, { 'receiverId': ?0 } ] }")
    List<Message> findAllBySenderIdOrReceiverId(String userId);
    
    // Find the latest message between two users
    @Query("{ $or: [ { $and: [ {'senderId': ?0}, {'receiverId': ?1} ] }, { $and: [ {'senderId': ?1}, {'receiverId': ?0} ] } ] }")
    List<Message> findMessagesBetweenUsers(String user1Id, String user2Id);
}
