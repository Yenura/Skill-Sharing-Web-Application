package com.skillsharing.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserSearchResultDTO {
    private String id;
    private String username;
    private String firstName;
    private String lastName;
    private String fullName;
    private String profilePicture;
    private String bio;
    private boolean isFollowing;
}
