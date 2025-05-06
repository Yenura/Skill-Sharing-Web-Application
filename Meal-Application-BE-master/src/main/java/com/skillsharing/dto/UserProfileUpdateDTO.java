package com.skillsharing.dto;

import java.util.Set;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class UserProfileUpdateDTO {
    private String firstName;
    private String lastName;
    private String bio;
    private Set<String> skills;
    private String email;
    private String currentPassword;
    private String newPassword;
    private String profilePicture;
}
