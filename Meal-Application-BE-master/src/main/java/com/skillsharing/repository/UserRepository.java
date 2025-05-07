package com.skillsharing.repository;

import com.skillsharing.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
    Optional<User> findByUsername(String username);
    boolean existsByEmail(String email);
    boolean existsByUsername(String username);
    
    // Add search methods
    List<User> findByUsernameContainingIgnoreCaseOrSkillsContainingIgnoreCase(String username, String skill);
    
    // Search by partial username only
    List<User> findByUsernameContainingIgnoreCase(String username);
    
    // Custom query to find users by partial skill match
    @Query("{ 'skills': { $regex: ?0, $options: 'i' } }")
    List<User> findBySkillsRegex(String skillRegex);
    
    // Improved search methods with better MongoDB compatibility
    @Query("{ 'username': { $regex: ?0, $options: 'i' } }")
    List<User> findByUsernameRegex(String usernameRegex);
    
    // Find users by either username or skills
    @Query("{ $or: [ { 'username': { $regex: ?0, $options: 'i' } }, { 'skills': { $regex: ?0, $options: 'i' } } ] }")
    List<User> findByUsernameOrSkillsRegex(String regex);
    
    // Find users by name (first name, last name, or username)
    @Query("{ $or: [ " + 
           "{ 'firstName': { $regex: ?0, $options: 'i' } }, " +
           "{ 'lastName': { $regex: ?0, $options: 'i' } }, " +
           "{ 'username': { $regex: ?0, $options: 'i' } }, " +
           "{ 'skills': { $regex: ?0, $options: 'i' } } ] }")
    List<User> findByNameOrSkillsRegex(String regex);
}
