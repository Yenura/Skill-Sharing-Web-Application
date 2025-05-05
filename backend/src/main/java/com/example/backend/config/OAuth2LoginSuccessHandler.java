package com.example.backend.config;

import com.example.backend.models.User;
import com.example.backend.repositories.UserRepository;
import com.example.backend.security.JwtTokenUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Collections;
import java.util.Optional;

@Component
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private JwtTokenUtil jwtTokenUtil;
    
    private String frontendUrl = "http://localhost:3000";
    
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, 
                                      HttpServletResponse response, 
                                      Authentication authentication) throws IOException, ServletException {
        
        OAuth2AuthenticationToken oauthToken = (OAuth2AuthenticationToken) authentication;
        OAuth2User oauth2User = oauthToken.getPrincipal();
        
        String email = oauth2User.getAttribute("email");
        String provider = oauthToken.getAuthorizedClientRegistrationId();
        
        Optional<User> userOptional = userRepository.findByEmail(email);
        
        if (userOptional.isEmpty()) {
            // Create new user if not exists
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setName(oauth2User.getAttribute("name"));
            newUser.setUsername(generateUsername(email));
            newUser.setEnabled(true);
            newUser.setProvider(provider);
            newUser.setRoles(Collections.singleton("ROLE_USER"));
            userRepository.save(newUser);
        }
        
        // Redirect to frontend with token
        String token = jwtTokenUtil.generateToken(email);
        String redirectUrl = frontendUrl + "/oauth2/redirect?token=" + token;
        response.sendRedirect(redirectUrl);
    }
    
    private String generateUsername(String email) {
        return email;
    }
}
