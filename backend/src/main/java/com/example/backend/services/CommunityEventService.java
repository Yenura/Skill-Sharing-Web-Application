package com.example.backend.services;

import com.example.backend.models.Community;
import com.example.backend.models.CommunityEvent;
import com.example.backend.models.User;
import com.example.backend.repositories.CommunityEventRepository;
import com.example.backend.repositories.CommunityRepository;
import com.example.backend.repositories.UserRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CommunityEventService {

    private final CommunityEventRepository communityEventRepository;
    private final CommunityRepository communityRepository;
    private final UserRepository userRepository;

    public CommunityEventService(CommunityEventRepository communityEventRepository,
                                CommunityRepository communityRepository,
                                UserRepository userRepository) {
        this.communityEventRepository = communityEventRepository;
        this.communityRepository = communityRepository;
        this.userRepository = userRepository;
    }

    public List<CommunityEvent> getAllEvents() {
        return communityEventRepository.findAll();
    }

    public Optional<CommunityEvent> getEventById(String id) {
        return communityEventRepository.findById(id);
    }

    public List<CommunityEvent> getEventsByCommunity(String communityId) {
        return communityEventRepository.findByCommunityId(communityId);
    }

    public List<CommunityEvent> getUpcomingEvents() {
        return communityEventRepository.findByStartTimeAfter(LocalDateTime.now());
    }

    public List<CommunityEvent> getUpcomingEventsByCommunity(String communityId) {
        return communityEventRepository.findByCommunityIdAndStartTimeAfter(communityId, LocalDateTime.now());
    }

    public CommunityEvent createEvent(CommunityEvent event, String communityId, String organizerId) {
        Optional<Community> communityOptional = communityRepository.findById(communityId);
        Optional<User> organizerOptional = userRepository.findById(organizerId);
        
        if (communityOptional.isPresent() && organizerOptional.isPresent()) {
            Community community = communityOptional.get();
            User organizer = organizerOptional.get();
            
            event.setCommunity(community);
            event.setOrganizer(organizer);
            
            CommunityEvent savedEvent = communityEventRepository.save(event);
            
            community.addEvent(savedEvent);
            communityRepository.save(community);
            
            return savedEvent;
        }
        throw new IllegalArgumentException("Community or User not found");
    }

    public CommunityEvent updateEvent(String id, CommunityEvent eventDetails) {
        Optional<CommunityEvent> eventOptional = communityEventRepository.findById(id);
        if (eventOptional.isPresent()) {
            CommunityEvent event = eventOptional.get();
            
            event.setTitle(eventDetails.getTitle());
            event.setDescription(eventDetails.getDescription());
            event.setLocation(eventDetails.getLocation());
            event.setStartTime(eventDetails.getStartTime());
            event.setEndTime(eventDetails.getEndTime());
            event.setCoverImage(eventDetails.getCoverImage());
            
            return communityEventRepository.save(event);
        }
        throw new IllegalArgumentException("Event not found");
    }

    public void deleteEvent(String id) {
        Optional<CommunityEvent> eventOptional = communityEventRepository.findById(id);
        if (eventOptional.isPresent()) {
            CommunityEvent event = eventOptional.get();
            Community community = event.getCommunity();
            
            community.removeEvent(event);
            communityRepository.save(community);
            
            communityEventRepository.deleteById(id);
        } else {
            throw new IllegalArgumentException("Event not found");
        }
    }

    public CommunityEvent attendEvent(String eventId, String userId) {
        Optional<CommunityEvent> eventOptional = communityEventRepository.findById(eventId);
        Optional<User> userOptional = userRepository.findById(userId);
        
        if (eventOptional.isPresent() && userOptional.isPresent()) {
            CommunityEvent event = eventOptional.get();
            User user = userOptional.get();
            
            event.addAttendee(user);
            return communityEventRepository.save(event);
        }
        throw new IllegalArgumentException("Event or User not found");
    }

    public CommunityEvent cancelAttendance(String eventId, String userId) {
        Optional<CommunityEvent> eventOptional = communityEventRepository.findById(eventId);
        Optional<User> userOptional = userRepository.findById(userId);
        
        if (eventOptional.isPresent() && userOptional.isPresent()) {
            CommunityEvent event = eventOptional.get();
            User user = userOptional.get();
            
            event.removeAttendee(user);
            return communityEventRepository.save(event);
        }
        throw new IllegalArgumentException("Event or User not found");
    }
}
