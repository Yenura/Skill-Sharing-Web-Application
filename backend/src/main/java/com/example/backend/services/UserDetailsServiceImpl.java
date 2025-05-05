package com.example.backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import com.example.backend.models.User;
import com.example.backend.repositories.UserRepository;
import java.util.Optional; // Import Optional

@Service
@Primary
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String identifier) throws UsernameNotFoundException {
        // Try finding by username first
        User user = userRepository.findByUsername(identifier);

        // If not found by username, try finding by email
        if (user == null) {
            Optional<User> userOptional = userRepository.findByEmail(identifier);
            if (userOptional.isPresent()) {
                user = userOptional.get();
            }
        }

        // If still not found, throw exception
        if (user == null) {
            throw new UsernameNotFoundException("User not found with identifier: " + identifier);
        }
        
        // Return the found user (which implements UserDetails)
        return user; 
    }
}
