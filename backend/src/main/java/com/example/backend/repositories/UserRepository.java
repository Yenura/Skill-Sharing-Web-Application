package com.example.backend.repositories;

import com.example.backend.models.User;
import org.springframework.data.domain.Page;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    boolean existsByUsername(String username);
    User findByUsername(String username);
    User findByEmail(String email);
    User findByResetToken(String resetToken);
    List<User> findByUsernameContainingIgnoreCase(String username);
    List<User> findTop10ByUsernameContainingIgnoreCase(String username);
}
