package com.example.backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/test")
public class TestController {

    @Autowired
    private MongoTemplate mongoTemplate;

    @GetMapping
    public String testGet() {
        return "Backend is working!";
    }

    @PostMapping
    public String testPost(@RequestBody String message) {
        return "Received message: " + message;
    }

    @PutMapping("/{id}")
    public String testPut(@PathVariable String id, @RequestBody String message) {
        return "Updated message for id " + id + ": " + message;
    }

    @DeleteMapping("/{id}")
    public String testDelete(@PathVariable String id) {
        return "Deleted item with id: " + id;
    }

    @GetMapping("/mongodb")
    public ResponseEntity<String> testMongoDBConnection() {
        try {
            String databaseName = mongoTemplate.getDb().getName();
            return ResponseEntity.ok("Successfully connected to MongoDB! Database: " + databaseName);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to connect to MongoDB: " + e.getMessage());
        }
    }
} 
