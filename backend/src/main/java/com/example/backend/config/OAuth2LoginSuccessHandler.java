package com.example.backend.config;

import com.example.backend.models.User;
import com.example.backend.repositories.UserRepository;
import com.example.backend.dto.TokenDTO;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import java.io.IOException;
import java.util.Map;
import java.util.HashSet;

@Component
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
    
    @Autowired
    private TokenGenerator tokenGenerator;
    
    @Autowired
    private UserRepository userRepository;
    
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, 
                                      HttpServletResponse response, 
                                      Authentication authentication) throws IOException, ServletException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        Map<String, Object> attributes = oAuth2User.getAttributes();
        
        String email = (String) attributes.get("email");
        String name = (String) attributes.get("name");
        
        User user = userRepository.findByEmail(email);
        if (user == null) {
            // Create new user if not exists
            user = new User();
            user.setEmail(email);
            user.setUsername(email);
            user.setEnabled(true);
            user.setRoles(new HashSet<>());
            user.getRoles().add("USER");
            userRepository.save(user);
        }
        
        // Generate JWT token
        TokenDTO tokenDTO = tokenGenerator.createToken(authentication);
        
        // Redirect to frontend with token
        String redirectUrl = String.format("http://localhost:3000/oauth2/success?token=%s", tokenDTO.getAccessToken());
        getRedirectStrategy().sendRedirect(request, response, redirectUrl);
    }
}
