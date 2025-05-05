package com.example.backend.services;

import com.example.backend.models.SearchTrend;
import com.example.backend.repositories.SearchTrendRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SearchTrendService {
    private final SearchTrendRepository searchTrendRepository;
    private static final Logger logger = LoggerFactory.getLogger(SearchTrendService.class);

    public SearchTrendService(SearchTrendRepository searchTrendRepository) {
        this.searchTrendRepository = searchTrendRepository;
    }

    private static final int POPULARITY_THRESHOLD = 10; // Minimum searches to be considered popular
    private static final double RELEVANCE_THRESHOLD = 0.7; // Minimum relevance score

    @Transactional
    public void trackSearch(String searchTerm, String searchType, int resultCount, double relevanceScore) {
        Optional<SearchTrend> optionalTrend = searchTrendRepository.findBySearchTermAndSearchType(searchTerm, searchType);
        if (optionalTrend.isPresent()) {
            SearchTrend trend = optionalTrend.get();
            trend.incrementSearchCount();
            trend.setResultCount(resultCount);
            trend.updateRelevanceScore(relevanceScore);

            // Update popularity status
            if (trend.getSearchCount() >= POPULARITY_THRESHOLD
                    && trend.getAverageRelevanceScore() >= RELEVANCE_THRESHOLD) {
                trend.setPopular(true);
            }
        } else {
            SearchTrend trend = new SearchTrend();
            trend.setSearchTerm(searchTerm);
            trend.setSearchType(searchType);
            trend.setResultCount(resultCount);
            trend.setAverageRelevanceScore(relevanceScore);
        }
        searchTrendRepository.save(optionalTrend.orElseGet(() -> new SearchTrend()));
    }

    @Transactional
    public void trackClickThrough(String searchTerm, String searchType) {
        Optional<SearchTrend> optionalTrend = searchTrendRepository.findBySearchTermAndSearchType(searchTerm, searchType);
        if (optionalTrend.isPresent()) {
            SearchTrend trend = optionalTrend.get();
            trend.incrementClickThrough();
            searchTrendRepository.save(trend);
        }
    }

    public List<String> getTrendingSearches(String searchType) {
        LocalDateTime weekAgo = LocalDateTime.now().minusWeeks(1);
        return searchTrendRepository
                .findBySearchTypeAndLastSearchedAfterOrderBySearchCountDesc(searchType, weekAgo)
                .stream()
                .limit(10)
                .map(SearchTrend::getSearchTerm)
                .collect(Collectors.toList());
    }

    public List<String> getPopularSearches() {
        return searchTrendRepository.findByIsPopularTrue()
                .stream()
                .map(SearchTrend::getSearchTerm)
                .collect(Collectors.toList());
    }

    @Scheduled(cron = "0 0 * * * *") // Run hourly
    @Transactional
    public void updateTrendingStatus() {
        LocalDateTime weekAgo = LocalDateTime.now().minusWeeks(1);
        List<SearchTrend> recentTrends = searchTrendRepository.findByLastSearchedAfter(weekAgo);

        recentTrends.forEach(trend -> {
            boolean isPopular = trend.getSearchCount() >= POPULARITY_THRESHOLD
                    && trend.getAverageRelevanceScore() >= RELEVANCE_THRESHOLD;
            trend.setPopular(isPopular);
        });

        searchTrendRepository.saveAll(recentTrends);
    }

    public List<String> getMostEffectiveSearches() {
        return searchTrendRepository.findTop10ByOrderByClickThroughCountDesc()
                .stream()
                .map(SearchTrend::getSearchTerm)
                .collect(Collectors.toList());
    }

    @Transactional
    public void processSearchTrends() {
        logger.info("Processing search trends");
        // Add implementation for processing search trends
        // This method was referenced in ScheduledTasks but was missing
    }

    /**
     * Get top search trends ordered by popularity
     * @param limit Maximum number of trends to return
     * @return List of top search trends
     */
    public List<SearchTrend> getTopSearchTrends(int limit) {
        return searchTrendRepository.findTop10ByOrderByPopularityScoreDesc()
                .stream()
                .limit(limit)
                .collect(Collectors.toList());
    }

    /**
     * Track when a user clicks on a search result
     * @param searchTerm The search term that was used
     * @param resultId The ID of the clicked result
     * @param resultType The type of the clicked result (recipe, user, etc.)
     */
    public void trackClickThrough(String searchTerm, String resultId, String resultType) {
        try {
            SearchTrend trend = searchTrendRepository.findBySearchTermAndSearchType(searchTerm, resultType)
                    .orElse(null);
                    
            if (trend != null) {
                // Increment click-through count
                trend.setClickThroughCount(trend.getClickThroughCount() + 1);
                
                // Update popularity score based on click-through
                double newScore = calculatePopularityScore(trend);
                trend.setPopularityScore(newScore);
                
                searchTrendRepository.save(trend);
                
                // Log click-through for analytics
                logger.info("Click-through tracked for search term: {}, result: {}, type: {}", 
                        searchTerm, resultId, resultType);
            }
        } catch (Exception e) {
            logger.error("Error tracking click-through: {}", e.getMessage(), e);
        }
    }
    
    /**
     * Calculate a popularity score for a search trend based on recency, search count, and click-through rate
     * @param trend The search trend
     * @return A popularity score
     */
    private double calculatePopularityScore(SearchTrend trend) {
        // Calculate days since last search (recency factor)
        long daysSinceLastSearch = java.time.temporal.ChronoUnit.DAYS.between(trend.getLastSearched(), LocalDateTime.now());
        double recencyFactor = Math.max(0.1, 1.0 / (1.0 + daysSinceLastSearch));
        
        // Calculate click-through rate
        double clickThroughRate = trend.getSearchCount() > 0 ? 
                (double) trend.getClickThroughCount() / trend.getSearchCount() : 0;
                
        // Calculate volume factor (log scale to prevent very popular terms from dominating)
        double volumeFactor = Math.log10(trend.getSearchCount() + 1);
        
        // Combine factors with weights
        return (0.3 * recencyFactor + 0.4 * clickThroughRate + 0.3 * volumeFactor) * 100;
    }

    public void processSearchQuery(String query, String type) {
        try {
            SearchTrend trend = searchTrendRepository.findBySearchTermAndSearchType(query, type)
                    .orElseGet(() -> {
                        SearchTrend newTrend = new SearchTrend();
                        newTrend.setSearchTerm(query);
                        newTrend.setSearchType(type);
                        return newTrend;
                    });
            trend.incrementSearchCount();
            searchTrendRepository.save(trend);
        } catch (Exception e) {
            logger.error("Error processing search query: {}", e.getMessage());
        }
    }

    public List<String> getPopularSearchTerms() {
        return searchTrendRepository.findAll().stream()
                .sorted((a, b) -> Integer.compare(b.getSearchCount(), a.getSearchCount()))
                .limit(20)
                .map(SearchTrend::getSearchTerm)
                .toList();
    }

    public List<SearchTrend> getRecentTrends() {
        LocalDateTime weekAgo = LocalDateTime.now().minusWeeks(1);
        return searchTrendRepository.findByFirstSearchedAfter(weekAgo).stream()
                .sorted((a, b) -> b.getFirstSearched().compareTo(a.getFirstSearched()))
                .toList();
    }
}