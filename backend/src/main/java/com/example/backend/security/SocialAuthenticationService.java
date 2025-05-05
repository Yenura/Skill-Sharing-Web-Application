package com.example.backend.security;

import com.example.backend.models.User;
import com.example.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class SocialAuthenticationService extends DefaultOAuth2UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oauth2User = super.loadUser(userRequest);
        
        User user = processOAuthUser(userRequest, oauth2User);
        
        return new SocialUserPrincipal(user, oauth2User.getAttributes());
    }

    public User processOAuthUser(OAuth2UserRequest oAuth2UserRequest, OAuth2User oAuth2User) {
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        String provider = oAuth2UserRequest.getClientRegistration().getRegistrationId();
        
        Optional<User> userOptional = userRepository.findByEmail(email);
        
        if (userOptional.isPresent()) {
            User existingUser = userOptional.get();
            // Update provider details if needed
            if (!provider.equals(existingUser.getProvider())) {
                existingUser.setProvider(provider);
                return userRepository.save(existingUser);
            }
            return existingUser;
        } else {
            // Create new user
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setName(name);
            newUser.setUsername(generateUsername(email));
            newUser.setEnabled(true);
            newUser.setProvider(provider);
            newUser.setRoles(Collections.singleton("ROLE_USER"));
            
            return userRepository.save(newUser);
        }
    }

    private String generateUsername(String email) {
        // Implement your username generation logic here
        return email;
    }
}

class SocialUserPrincipal extends UserPrincipal implements OAuth2User {
    private Map<String, Object> attributes;

    public SocialUserPrincipal(User user, Map<String, Object> attributes) {
        super(user.getId(), user.getEmail(), user.getPassword(), List.of(new SimpleGrantedAuthority("ROLE_USER")));
        this.attributes = attributes;
    }

    @Override
    public Map<String, Object> getAttributes() {
        return attributes;
    }

    @Override
    public String getName() {
        return ((String) attributes.get("name"));
    }
} 