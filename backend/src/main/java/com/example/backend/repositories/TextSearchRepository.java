package com.example.backend.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.mongodb.core.aggregation.AggregationOperation;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.TextCriteria;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.repository.NoRepositoryBean;

import java.util.List;

@NoRepositoryBean
public interface TextSearchRepository<T, ID> extends MongoRepository<T, ID> {
    // Text search with pagination
    Page<T> findAllBy(Query query, Class<T> clazz);
    
    // Aggregation pipeline execution
    <R> List<R> executeAggregation(List<AggregationOperation> operations, Class<R> outputType);
    
    // Faceted search
    <R> List<R> executeFacetedSearch(Query query, List<String> facets, Class<R> outputType);
    
    // Count by criteria
    long countByQuery(Query query);
    
    // Fuzzy search with configurable similarity
    Page<T> findAllByFuzzy(String searchTerm, double minSimilarity, Class<T> clazz);
    
    // Search suggestions (autocomplete)
    List<String> getSuggestions(String prefix, String field, int limit);
    
    // Full-text search with text score
    Page<T> findAllByTextScore(TextCriteria criteria, Class<T> clazz);
    
    // Search with multiple fields and weights
    Page<T> findAllByWeightedFields(String searchTerm, List<String> fields, List<Float> weights, Class<T> clazz);
} 
