package com.example.backend.controllers;

import com.example.backend.models.MediaAsset;
import com.example.backend.services.MediaAssetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/media")
@CrossOrigin(origins = "http://localhost:3000")
public class MediaAssetController {

    @Autowired
    private MediaAssetService mediaAssetService;

    @PostMapping("/upload")
    public ResponseEntity<MediaAsset> uploadMedia(
            @RequestParam("file") MultipartFile file,
            @RequestParam("ownerId") String ownerId) {
        try {
            MediaAsset mediaAsset = mediaAssetService.uploadMedia(file, ownerId);
            return new ResponseEntity<>(mediaAsset, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (IOException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/upload/multiple")
    public ResponseEntity<List<MediaAsset>> uploadMultipleMedia(
            @RequestParam("files") List<MultipartFile> files,
            @RequestParam("ownerId") String ownerId) {
        try {
            List<MediaAsset> mediaAssets = files.stream()
                .map(file -> {
                    try {
                        return mediaAssetService.uploadMedia(file, ownerId);
                    } catch (IOException e) {
                        throw new RuntimeException(e);
                    }
                })
                .toList();
            return new ResponseEntity<>(mediaAssets, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/user/{ownerId}")
    public ResponseEntity<List<MediaAsset>> getMediaByOwner(@PathVariable String ownerId) {
        List<MediaAsset> mediaAssets = mediaAssetService.getMediaByOwner(ownerId);
        return ResponseEntity.ok(mediaAssets);
    }

    @GetMapping("/user/{ownerId}/{type}")
    public ResponseEntity<List<MediaAsset>> getMediaByOwnerAndType(
            @PathVariable String ownerId,
            @PathVariable String type) {
        List<MediaAsset> mediaAssets = mediaAssetService.getMediaByOwnerAndType(ownerId, type);
        return ResponseEntity.ok(mediaAssets);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMedia(
            @PathVariable String id,
            @RequestParam String ownerId) {
        try {
            mediaAssetService.deleteMedia(id, ownerId);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}