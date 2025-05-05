package com.example.backend.repositories;

import com.example.backend.models.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    boolean existsByUsername(String username);
    User findByUsername(String username);
    Optional<User> findByEmail(String email);
    User findByResetToken(String resetToken);
    List<User> findByUsernameContainingIgnoreCase(String username);
    List<User> findTop10ByUsernameContainingIgnoreCase(String username);
    
    // Admin analytics methods
    Page<User> findByUsernameContainingIgnoreCase(String username, Pageable pageable);
    
    long countByCreatedAtAfter(LocalDateTime date);
    
    List<User> findTop10ByCreatedAtAfterOrderByCreatedAtDesc(LocalDateTime date);
}
