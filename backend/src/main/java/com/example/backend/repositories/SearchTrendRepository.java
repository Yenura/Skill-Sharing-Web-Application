package com.example.backend.repositories;

import com.example.backend.models.SearchTrend;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface SearchTrendRepository extends MongoRepository<SearchTrend, String> {
    Optional<SearchTrend> findBySearchTermAndSearchType(String searchTerm, String searchType);
    List<SearchTrend> findByIsPopularTrue();
    List<SearchTrend> findByLastSearchedAfter(LocalDateTime date);
    List<SearchTrend> findTop10BySearchTypeOrderBySearchCountDesc(String searchType);
    List<SearchTrend> findTop10ByOrderByClickThroughCountDesc();
    List<SearchTrend> findBySearchTypeAndLastSearchedAfterOrderBySearchCountDesc(String searchType, LocalDateTime date);
    List<SearchTrend> findByFirstSearchedAfter(LocalDateTime date);
    List<SearchTrend> findBySearchTypeOrderByPopularityScoreDesc(String searchType);
    
    // Admin analytics methods
    List<SearchTrend> findTop10ByOrderByPopularityScoreDesc();
}