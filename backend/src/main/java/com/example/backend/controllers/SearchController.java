package com.example.backend.controllers;

import com.example.backend.services.SearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/search")
@CrossOrigin(origins = "http://localhost:3000")
public class SearchController {

    @Autowired
    private SearchService searchService;

    @GetMapping
    public ResponseEntity<?> search(
            @RequestParam String q,
            @RequestParam(defaultValue = "all") String type,
            @RequestParam(defaultValue = "0.8") double similarity
    ) {
        try {
            Map<String, Object> results = searchService.searchAll(q, similarity);
            return ResponseEntity.ok(results);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body("Error performing search: " + e.getMessage());
        }
    }

    @GetMapping("/fuzzy")
    public ResponseEntity<?> fuzzySearch(
            @RequestParam String q,
            @RequestParam String type,
            @RequestParam(defaultValue = "0.8") double similarity
    ) {
        try {
            Map<String, Object> results = searchService.fuzzySearch(q, type, similarity);
            return ResponseEntity.ok(results);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body("Error performing fuzzy search: " + e.getMessage());
        }
    }

    @PostMapping("/weighted")
    public ResponseEntity<?> weightedSearch(
            @RequestParam String q,
            @RequestParam String type,
            @RequestBody Map<String, Float> fieldWeights
    ) {
        try {
            Map<String, Object> results = searchService.weightedSearch(q, type, fieldWeights);
            return ResponseEntity.ok(results);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body("Error performing weighted search: " + e.getMessage());
        }
    }

    @GetMapping("/faceted")
    public ResponseEntity<?> facetedSearch(
            @RequestParam String q,
            @RequestParam String type,
            @RequestParam List<String> facets
    ) {
        try {
            Map<String, Object> results = searchService.facetedSearch(q, type, facets);
            return ResponseEntity.ok(results);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body("Error performing faceted search: " + e.getMessage());
        }
    }
} 
