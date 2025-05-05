package com.example.backend.aspects;

import com.example.backend.annotations.RateLimit;
import com.example.backend.config.RateLimitingConfig;
import io.github.bucket4j.Bucket;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.server.ResponseStatusException;

import jakarta.servlet.http.HttpServletRequest;

import java.lang.reflect.Method;

@Aspect
@Component
public class RateLimitingAspect {

    @Autowired
    private RateLimitingConfig rateLimitingConfig;

    @Around("@annotation(com.example.backend.annotations.RateLimit)")
    public Object rateLimit(ProceedingJoinPoint joinPoint) throws Throwable {
        // Get the method and its rate limit annotation
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        Method method = signature.getMethod();
        RateLimit rateLimit = method.getAnnotation(RateLimit.class);

        // Get client IP and build rate limit key
        String clientIp = getClientIp();
        String key = buildRateLimitKey(rateLimit.key(), clientIp);

        // Get or create rate limit bucket
        Bucket bucket = rateLimitingConfig.resolveBucket(key);

        // Try to consume a token
        if (!bucket.tryConsume(1)) {
            throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS, "Rate limit exceeded");
        }

        // If we got here, proceed with the method execution
        return joinPoint.proceed();
    }

    private String getClientIp() {
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes())
            .getRequest();

        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }

        return request.getRemoteAddr();
    }

    private String buildRateLimitKey(String key, String clientIp) {
        return String.format("%s_%s", key.isEmpty() ? "default" : key, clientIp);
    }
}