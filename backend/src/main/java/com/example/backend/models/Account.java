package com.example.backend.models;

import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

// This class represents an Account entity that is stored in the MongoDB "accounts" collection.
@Data  // Lombok annotation to generate getters, setters, toString, equals, and hashCode methods automatically.
@Document(collection = "accounts")
public class Account {

    // The unique identifier for each Account object in the collection.
    @Id
    private Integer id;
    
    // The first name of the account holder.
    private String firstName;
    
    // The last name of the account holder.
    private String lastName;
    
    // The username associated with the account.
    private String userName;
    
    // The password for the account (usually stored encrypted in practice).
    private String password;
    
    // The date when the account was created..
    @CreatedDate
    private LocalDate createdDate;
}
