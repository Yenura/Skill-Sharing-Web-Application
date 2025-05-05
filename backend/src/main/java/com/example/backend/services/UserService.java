package com.example.backend.services;

import com.example.backend.models.User;
import com.example.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User findById(String id) {
        return userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
    }

    public String getUserIdByUsername(String username) {
        User user = userRepository.findByUsername(username);
        if (user != null) {
            return user.getId().toString();  
        } else {
            throw new RuntimeException("User not found");
        }
    }
}
