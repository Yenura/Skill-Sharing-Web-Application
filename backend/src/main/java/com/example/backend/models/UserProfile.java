package com.example.backend.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Document(collection = "user_profiles")
public class UserProfile {
    @Id
    private String id;
    private String userId;
    private String bio;
    private String profilePicture;
    private String cookingExpertise; // beginner, intermediate, advanced, professional
    private List<String> cookingInterests; // e.g., baking, vegan, international cuisine
    private List<String> favoriteCuisines;
    private int recipesShared;
    private int followersCount;
    private int followingCount;
    private boolean isPrivate;
    private List<String> dietaryPreferences; // e.g., vegetarian, vegan, gluten-free
    private String location;
    private String website;
    private List<String> socialMediaLinks;

    public UserProfile() {}

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
