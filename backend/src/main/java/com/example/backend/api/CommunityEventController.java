package com.example.backend.api;

import com.example.backend.models.CommunityEvent;
import com.example.backend.services.CommunityEventService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/community-events")
public class CommunityEventController {

    private final CommunityEventService communityEventService;

    public CommunityEventController(CommunityEventService communityEventService) {
        this.communityEventService = communityEventService;
    }

    @GetMapping
    public ResponseEntity<List<CommunityEvent>> getAllEvents() {
        List<CommunityEvent> events = communityEventService.getAllEvents();
        return new ResponseEntity<>(events, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CommunityEvent> getEventById(@PathVariable String id) {
        Optional<CommunityEvent> event = communityEventService.getEventById(id);
        return event.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/community/{communityId}")
    public ResponseEntity<List<CommunityEvent>> getEventsByCommunity(@PathVariable String communityId) {
        List<CommunityEvent> events = communityEventService.getEventsByCommunity(communityId);
        return new ResponseEntity<>(events, HttpStatus.OK);
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<CommunityEvent>> getUpcomingEvents() {
        List<CommunityEvent> events = communityEventService.getUpcomingEvents();
        return new ResponseEntity<>(events, HttpStatus.OK);
    }

    @GetMapping("/upcoming/community/{communityId}")
    public ResponseEntity<List<CommunityEvent>> getUpcomingEventsByCommunity(@PathVariable String communityId) {
        List<CommunityEvent> events = communityEventService.getUpcomingEventsByCommunity(communityId);
        return new ResponseEntity<>(events, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<CommunityEvent> createEvent(
            @RequestBody CommunityEvent event,
            @RequestParam String communityId,
            @RequestParam String organizerId) {
        try {
            CommunityEvent newEvent = communityEventService.createEvent(event, communityId, organizerId);
            return new ResponseEntity<>(newEvent, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<CommunityEvent> updateEvent(@PathVariable String id, @RequestBody CommunityEvent event) {
        try {
            CommunityEvent updatedEvent = communityEventService.updateEvent(id, event);
            return new ResponseEntity<>(updatedEvent, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable String id) {
        try {
            communityEventService.deleteEvent(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/{eventId}/attend")
    public ResponseEntity<CommunityEvent> attendEvent(@PathVariable String eventId, @RequestParam String userId) {
        try {
            CommunityEvent event = communityEventService.attendEvent(eventId, userId);
            return new ResponseEntity<>(event, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/{eventId}/cancel-attendance")
    public ResponseEntity<CommunityEvent> cancelAttendance(@PathVariable String eventId, @RequestParam String userId) {
        try {
            CommunityEvent event = communityEventService.cancelAttendance(eventId, userId);
            return new ResponseEntity<>(event, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
}
