package com.example.backend.aspects;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.util.StopWatch;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.Map;
import java.util.HashMap;

@Aspect
@Component
public class PerformanceMonitoringAspect {
    
    private static final Logger logger = LoggerFactory.getLogger(PerformanceMonitoringAspect.class);
    
    private final Map<String, AtomicInteger> methodCallCounts = new ConcurrentHashMap<>();
    private final Map<String, Double> averageExecutionTimes = new ConcurrentHashMap<>();

    @Around("execution(* com.example.backend.services.SearchService.*(..))")
    public Object monitorSearchPerformance(ProceedingJoinPoint joinPoint) throws Throwable {
        return monitorPerformance(joinPoint, "SEARCH");
    }

    @Around("execution(* com.example.backend.services.LearningMilestoneService.*(..))")
    public Object monitorLearningPerformance(ProceedingJoinPoint joinPoint) throws Throwable {
        return monitorPerformance(joinPoint, "LEARNING");
    }

    private Object monitorPerformance(ProceedingJoinPoint joinPoint, String operationType) throws Throwable {
        String methodName = joinPoint.getSignature().getName();
        String key = operationType + "_" + methodName;
        
        // Initialize counters if not exists
        methodCallCounts.putIfAbsent(key, new AtomicInteger(0));
        averageExecutionTimes.putIfAbsent(key, 0.0);

        StopWatch stopWatch = new StopWatch();
        stopWatch.start();

        try {
            return joinPoint.proceed();
        } finally {
            stopWatch.stop();
            updateMetrics(key, stopWatch.getTotalTimeMillis());
            logPerformanceMetrics(key, stopWatch.getTotalTimeMillis());
        }
    }

    private void updateMetrics(String key, long executionTime) {
        int currentCount = methodCallCounts.get(key).incrementAndGet();
        double currentAvg = averageExecutionTimes.get(key);
        double newAvg = ((currentAvg * (currentCount - 1)) + executionTime) / currentCount;
        averageExecutionTimes.put(key, newAvg);
    }

    private void logPerformanceMetrics(String key, long executionTime) {
        logger.info("Performance Metrics - Operation: {}", key);
        logger.info("Execution Time: {} ms", executionTime);
        logger.info("Average Execution Time: {} ms", String.format("%.2f", averageExecutionTimes.get(key)));
        logger.info("Total Calls: {}", methodCallCounts.get(key).get());
        
        // Log warning if execution time is significantly higher than average
        double avgTime = averageExecutionTimes.get(key);
        if (executionTime > avgTime * 2 && methodCallCounts.get(key).get() > 10) {
            logger.warn("Performance Warning - {} execution time is {} ms, which is significantly higher than the average {} ms",
                key, executionTime, String.format("%.2f", avgTime));
        }
    }

    public Map<String, Object> getPerformanceMetrics() {
        Map<String, Object> metrics = new HashMap<>();
        methodCallCounts.forEach((key, count) -> {
            Map<String, Object> methodMetrics = new HashMap<>();
            methodMetrics.put("calls", count.get());
            methodMetrics.put("averageExecutionTime", String.format("%.2f", averageExecutionTimes.get(key)));
            metrics.put(key, methodMetrics);
        });
        return metrics;
    }
}