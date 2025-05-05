package com.example.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.messaging.MessageSecurityMetadataSourceRegistry;
import org.springframework.security.config.annotation.web.socket.AbstractSecurityWebSocketMessageBrokerConfigurer;

@Configuration
public class WebSocketSecurityConfig extends AbstractSecurityWebSocketMessageBrokerConfigurer {

    @Override
    protected void configureInbound(MessageSecurityMetadataSourceRegistry messages) {
        messages
            .simpDestMatchers("/app/**").authenticated()
            .simpSubscribeDestMatchers("/user/**").authenticated()
            .simpSubscribeDestMatchers("/topic/trending-searches").permitAll()
            .simpSubscribeDestMatchers("/topic/search-trends").permitAll()
            .anyMessage().authenticated();
    }

    @Override
    protected boolean sameOriginDisabled() {
        // Disable CSRF for WebSocket since we're using token-based authentication
        return true;
    }
}