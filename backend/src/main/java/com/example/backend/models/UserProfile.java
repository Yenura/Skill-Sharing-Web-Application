package com.example.backend.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

// MongoDB document representing a user profile
@Document(collection = "user_profiles")
public class UserProfile {

    // Unique identifier for the user profile
    @Id
    private String id;

    // The ID of the user this profile belongs to
    private String userId;

    // Short biography of the user
    private String bio;

    // Profile picture URL or identifier
    private String profilePicture;

    // User's expertise level in cooking (e.g., beginner, intermediate, advanced, professional)
    private String cookingExpertise;

    // List of cooking interests (e.g., baking, vegan, international cuisine)
    private List<String> cookingInterests;

    // List of favorite cuisines (e.g., Italian, Mexican, Japanese)
    private List<String> favoriteCuisines;

    // Number of recipes shared by the user
    private int recipesShared;

    // Number of followers the user has
    private int followersCount;

    // Number of people the user is following
    private int followingCount;

    // Whether the user's profile is private (true) or public (false)
    private boolean isPrivate;

    // List of dietary preferences (e.g., vegetarian, vegan, gluten-free)
    private List<String> dietaryPreferences;

    // The user's location (could be city, country, etc.)
    private String location;

    // The user's personal or business website
    private String website;

    // List of social media profile links (e.g., Instagram, Twitter, Facebook)
    private List<String> socialMediaLinks;

    // Default constructor for creating an empty UserProfile object
    public UserProfile() {}

    // Getters and setters for each field.

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getProfilePicture() {
        return profilePicture;
    }

    public void setProfilePicture(String profilePicture) {
        this.profilePicture = profilePicture;
    }

    public String getCookingExpertise() {
        return cookingExpertise;
    }

    public void setCookingExpertise(String cookingExpertise) {
        this.cookingExpertise = cookingExpertise;
    }

    public List<String> getCookingInterests() {
        return cookingInterests;
    }

    public void setCookingInterests(List<String> cookingInterests) {
        this.cookingInterests = cookingInterests;
    }

    public List<String> getFavoriteCuisines() {
        return favoriteCuisines;
    }

    public void setFavoriteCuisines(List<String> favoriteCuisines) {
        this.favoriteCuisines = favoriteCuisines;
    }

    public int getRecipesShared() {
        return recipesShared;
    }

    public void setRecipesShared(int recipesShared) {
        this.recipesShared = recipesShared;
    }

    public int getFollowersCount() {
        return followersCount;
    }

    public void setFollowersCount(int followersCount) {
        this.followersCount = followersCount;
    }

    public int getFollowingCount() {
        return followingCount;
    }

    public void setFollowingCount(int followingCount) {
        this.followingCount = followingCount;
    }

    public boolean isPrivate() {
        return isPrivate;
    }

    public void setPrivate(boolean isPrivate) {
        this.isPrivate = isPrivate;
    }

    public List<String> getDietaryPreferences() {
        return dietaryPreferences;
    }

    public void setDietaryPreferences(List<String> dietaryPreferences) {
        this.dietaryPreferences = dietaryPreferences;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getWebsite() {
        return website;
    }

    public void setWebsite(String website) {
        this.website = website;
    }

    public List<String> getSocialMediaLinks() {
        return socialMediaLinks;
    }

    public void setSocialMediaLinks(List<String> socialMediaLinks) {
        this.socialMediaLinks = socialMediaLinks;
    }
}
