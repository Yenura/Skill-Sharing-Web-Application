package com.example.backend.controllers;

import com.example.backend.models.Bookmark;
import com.example.backend.repositories.BookmarkRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.Date;

@RestController
@RequestMapping("/api/bookmarks")
public class BookmarkController {

    @Autowired
    private BookmarkRepository bookmarkRepository;

    @GetMapping("/{userId}")
    public ResponseEntity<List<Bookmark>> getUserBookmarks(@PathVariable String userId) {
        List<Bookmark> bookmarks = bookmarkRepository.findByUserId(userId);
        return ResponseEntity.ok(bookmarks);
    }

    @PostMapping
    public ResponseEntity<Bookmark> createBookmark(@RequestBody Bookmark bookmark) {
        // Check if bookmark already exists
        if (bookmarkRepository.existsByUserIdAndResourceId(bookmark.getUserId(), bookmark.getResourceId())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
        
        bookmark.setCreatedAt(new Date());
        Bookmark savedBookmark = bookmarkRepository.save(bookmark);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedBookmark);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Bookmark> updateBookmark(@PathVariable String id, @RequestBody Bookmark bookmarkDetails) {
        return bookmarkRepository.findById(id)
                .map(bookmark -> {
                    bookmark.setTitle(bookmarkDetails.getTitle());
                    bookmark.setNote(bookmarkDetails.getNote());
                    bookmark.setTags(bookmarkDetails.getTags());
                    return ResponseEntity.ok(bookmarkRepository.save(bookmark));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBookmark(@PathVariable String id) {
        return bookmarkRepository.findById(id)
                .map(bookmark -> {
                    bookmarkRepository.delete(bookmark);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
