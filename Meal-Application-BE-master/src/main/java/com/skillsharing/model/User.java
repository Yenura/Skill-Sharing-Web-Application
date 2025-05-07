package com.skillsharing.model;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Data
@Document(collection = "users")
public class User {
    @Id
    private String id;
    
    private String firstName;
    private String lastName;
    
    @Indexed
    private String username;
    
    @Indexed(unique = true)
    private String email;
    
    private String password;
    private String role; // BEGINNER, PROFESSIONAL, MENTOR
    private Set<String> skills = new HashSet<>();
    private String profilePicture;
    private String bio;
    private Set<String> followers = new HashSet<>();
    private Set<String> following = new HashSet<>();
    private boolean enabled = true;
    
    // Learning streak fields
    private int currentStreak = 0;
    private int longestStreak = 0;
    private LocalDate lastLearningDate;
    private Set<LocalDate> learningDates = new HashSet<>();
    
    // Helper method to get full name
    public String getFullName() {
        if (firstName != null && lastName != null) {
            return firstName + " " + lastName;
        } else if (firstName != null) {
            return firstName;
        } else if (lastName != null) {
            return lastName;
        } else {
            return username;
        }
    }
}
