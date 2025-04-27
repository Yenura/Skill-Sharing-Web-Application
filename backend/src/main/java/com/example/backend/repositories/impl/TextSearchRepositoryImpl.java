package com.example.backend.repositories.impl;

import com.example.backend.repositories.TextSearchRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.*;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.TextCriteria;
import org.springframework.data.mongodb.core.query.TextQuery;
import org.springframework.data.mongodb.repository.query.MongoEntityInformation;
import org.springframework.data.mongodb.repository.support.SimpleMongoRepository;
import org.springframework.data.mongodb.core.query.TextQuery;
import org.springframework.data.domain.Sort.Direction;
import org.bson.Document;

import java.util.List;
import java.util.ArrayList;
import java.util.regex.Pattern;
import java.util.Arrays;

public class TextSearchRepositoryImpl<T, ID> extends SimpleMongoRepository<T, ID> implements TextSearchRepository<T, ID> {
    
    private final MongoTemplate mongoTemplate;
    private final MongoEntityInformation<T, ID> entityInformation;

    public TextSearchRepositoryImpl(MongoEntityInformation<T, ID> metadata, MongoTemplate mongoTemplate) {
        super(metadata, mongoTemplate);
        this.mongoTemplate = mongoTemplate;
        this.entityInformation = metadata;
    }

    @Override
    public Page<T> findAllBy(Query query, Class<T> clazz) {
        long total = mongoTemplate.count(query, clazz);
        
        // Create a copy of the query without pagination for total count
        Query countQuery = Query.of(query).skip(-1).limit(-1);
        long totalCount = mongoTemplate.count(countQuery, clazz);
        
        // Get pageable information from the query
        int skip = query.getSkip() > 0 ? (int) query.getSkip() : 0;
        int limit = query.getLimit() > 0 ? (int) query.getLimit() : 10;
        Pageable pageable = PageRequest.of(skip / limit, limit);
        
        List<T> content = mongoTemplate.find(query, clazz);
        
        return new PageImpl<>(content, pageable, totalCount);
    }

    @Override
    public <R> List<R> executeAggregation(List<AggregationOperation> operations, Class<R> outputType) {
        TypedAggregation<T> aggregation = Aggregation.newAggregation(
            entityInformation.getJavaType(),
            operations
        );
        return mongoTemplate.aggregate(aggregation, outputType).getMappedResults();
    }

    @Override
    public <R> List<R> executeFacetedSearch(Query query, List<String> facets, Class<R> outputType) {
        List<AggregationOperation> operations = new ArrayList<>();
        
        // Add match operation for the main query
        Criteria matchCriteria = new Criteria();
        query.getQueryObject().forEach((key, value) -> 
            matchCriteria.and(key).is(value)
        );
        operations.add(Aggregation.match(matchCriteria));
        
        // Add project operation to include only requested facets
        ProjectionOperation projection = Aggregation.project();
        facets.forEach(facet -> projection.and(facet).as(facet));
        operations.add(projection);
        
        TypedAggregation<T> aggregation = Aggregation.newAggregation(
            entityInformation.getJavaType(),
            operations
        );
        
        return mongoTemplate.aggregate(aggregation, outputType).getMappedResults();
    }

    @Override
    public long countByQuery(Query query) {
        return mongoTemplate.count(query, entityInformation.getJavaType());
    }

    @Override
    public Page<T> findAllByFuzzy(String searchTerm, double minSimilarity, Class<T> clazz) {
        List<AggregationOperation> operations = new ArrayList<>();
        
        // Add match operation with $text search
        operations.add(Aggregation.match(
            new Criteria().orOperator(
                Criteria.where("$text").is(searchTerm),
                createFuzzyRegexCriteria(searchTerm, minSimilarity)
            )
        ));
        
        // Add sort by text score
        operations.add(Aggregation.sort(Direction.DESC, "score"));
        
        TypedAggregation<T> aggregation = Aggregation.newAggregation(
            entityInformation.getJavaType(),
            operations
        );
        
        List<T> results = mongoTemplate.aggregate(aggregation, clazz).getMappedResults();
        return new PageImpl<>(results);
    }

    @Override
    public List<String> getSuggestions(String prefix, String field, int limit) {
        Criteria criteria = Criteria.where(field)
            .regex("^" + Pattern.quote(prefix), "i");
        
        Aggregation aggregation = Aggregation.newAggregation(
            Aggregation.match(criteria),
            Aggregation.group(field),
            Aggregation.limit(limit)
        );
        
        return mongoTemplate.aggregate(aggregation, 
                entityInformation.getJavaType(), 
                String.class)
            .getMappedResults();
    }

    @Override
    public Page<T> findAllByTextScore(TextCriteria criteria, Class<T> clazz) {
        TextQuery query = TextQuery.queryText(criteria)
            .sortByScore();
        
        List<T> results = mongoTemplate.find(query, clazz);
        return new PageImpl<>(results);
    }

    @Override
    public Page<T> findAllByWeightedFields(String searchTerm, List<String> fields, List<Float> weights, Class<T> clazz) {
        List<AggregationOperation> operations = new ArrayList<>();
        
        // Create text search criteria
        TextCriteria textCriteria = TextCriteria.forDefaultLanguage()
            .matchingAny(searchTerm);
        operations.add(Aggregation.match(textCriteria));
        
        // Add weighted fields
        ProjectionOperation projection = Aggregation.project()
            .andExpression("textScore").as("score");
        
        for (int i = 0; i < fields.size(); i++) {
            String field = fields.get(i);
            float weight = weights.get(i);
            projection = projection.and(field)
                .multiply(weight)
                .as(field + "Score");
        }
        operations.add(projection);
        
        // Sort by weighted score
        operations.add(Aggregation.sort(Direction.DESC, "score"));
        
        TypedAggregation<T> aggregation = Aggregation.newAggregation(
            entityInformation.getJavaType(),
            operations
        );
        
        List<T> results = mongoTemplate.aggregate(aggregation, clazz).getMappedResults();
        return new PageImpl<>(results);
    }

    private Criteria createFuzzyRegexCriteria(String searchTerm, double minSimilarity) {
        String[] terms = searchTerm.toLowerCase().split("\\s+");
        List<Criteria> criteria = new ArrayList<>();
        
        for (String term : terms) {
            StringBuilder pattern = new StringBuilder();
            pattern.append("(?i)"); // Case insensitive
            
            // Allow for character insertions/deletions
            for (char c : term.toCharArray()) {
                pattern.append("[")
                    .append(c)
                    .append("]{1,2}"); // Match character 1-2 times
            }
            
            criteria.add(Criteria.where("$regex").is(pattern.toString()));
        }
        
        return new Criteria().orOperator(criteria.toArray(new Criteria[0]));
    }
} 
