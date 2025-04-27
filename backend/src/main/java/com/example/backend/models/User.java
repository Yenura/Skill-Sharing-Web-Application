package com.example.backend.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import java.time.LocalDateTime;
import java.util.Set;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.Collection;
import java.util.HashSet;
import java.util.stream.Collectors;
import lombok.Getter;
import lombok.Setter;

// MongoDB document representing users in the "users" collection
@Document(collection = "users")
// Lombok annotations to auto-generate getters, setters, constructors, etc.
@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class User implements UserDetails {

    // Unique identifier for the user (MongoDB ID)
    @Id
    private String id;

    // Username with validation for length and uniqueness (indexed in MongoDB)
    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    @Indexed(unique = true)  // Ensure username uniqueness in MongoDB
    private String username;

    // User's email with validation for proper format and uniqueness
    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    @Indexed(unique = true)  // Ensure email uniqueness in MongoDB
    private String email;

    // User's password (typically hashed and stored securely)
    @NotBlank(message = "Password is required")
    private String password;

    // Token for password reset functionality
    private String resetToken;

    // Expiry time for the password reset token
    private LocalDateTime resetTokenExpiry;

    // Set of roles assigned to the user (e.g., "ADMIN", "USER")
    private Set<String> roles = new HashSet<>();

    // Flag indicating whether the user account is enabled or disabled
    private boolean enabled = true;

    // Timestamp when the user account was created
    @CreatedDate
    private LocalDateTime createdAt;

    // Timestamp for the last modification made to the user account
    @LastModifiedDate
    private LocalDateTime updatedAt;

    // Implementation of UserDetails interface: Authorities (roles) of the user
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Convert roles to GrantedAuthority objects prefixed with "ROLE_"
        return roles.stream()
                .map(role -> new SimpleGrantedAuthority("ROLE_" + role))
                .collect(Collectors.toList());
    }

    // Getter for username (from UserDetails interface)
    @Override
    public String getUsername() {
        return username;
    }

    // User account is not expired by default
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    // User account is not locked by default
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    // Credentials (password) are not expired by default
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    // Account is enabled by default
    @Override
    public boolean isEnabled() {
        return enabled;
    }

    // Getter and setter methods. (auto-generated via Lombok, but included explicitly for clarity)
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    @Override
    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getResetToken() {
        return resetToken;
    }

    public void setResetToken(String resetToken) {
        this.resetToken = resetToken;
    }

    public LocalDateTime getResetTokenExpiry() {
        return resetTokenExpiry;
    }

    public void setResetTokenExpiry(LocalDateTime resetTokenExpiry) {
        this.resetTokenExpiry = resetTokenExpiry;
    }

    public Set<String> getRoles() {
        return roles;
    }

    public void setRoles(Set<String> roles) {
        this.roles = roles;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}
