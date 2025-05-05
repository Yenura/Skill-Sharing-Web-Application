package com.example.backend.utils;

import org.springframework.stereotype.Component;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
public class SearchHighlighter {
    private static final int CONTEXT_LENGTH = 50; // Characters before and after match
    private static final String HIGHLIGHT_START = "<mark>";
    private static final String HIGHLIGHT_END = "</mark>";

    public String highlightText(String text, String searchTerm) {
        if (text == null || searchTerm == null || text.isEmpty() || searchTerm.isEmpty()) {
            return text;
        }

        StringBuilder highlighted = new StringBuilder();
        Pattern pattern = Pattern.compile(searchTerm, Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(text);

        int lastIndex = 0;
        while (matcher.find()) {
            // Add text before match
            highlighted.append(text.substring(lastIndex, matcher.start()));
            // Add highlighted match
            highlighted.append(HIGHLIGHT_START)
                      .append(text.substring(matcher.start(), matcher.end()))
                      .append(HIGHLIGHT_END);
            lastIndex = matcher.end();
        }
        // Add remaining text
        if (lastIndex < text.length()) {
            highlighted.append(text.substring(lastIndex));
        }

        return highlighted.toString();
    }

    public List<String> extractMatchContexts(String text, String searchTerm) {
        if (text == null || searchTerm == null || text.isEmpty() || searchTerm.isEmpty()) {
            return List.of();
        }

        List<String> contexts = new ArrayList<>();
        Pattern pattern = Pattern.compile(searchTerm, Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(text);

        while (matcher.find()) {
            int start = Math.max(0, matcher.start() - CONTEXT_LENGTH);
            int end = Math.min(text.length(), matcher.end() + CONTEXT_LENGTH);

            String context = text.substring(start, end);
            if (start > 0) {
                context = "..." + context;
            }
            if (end < text.length()) {
                context = context + "...";
            }

            // Highlight the match within the context
            String highlightedContext = context.substring(0, matcher.start() - start)
                + HIGHLIGHT_START
                + context.substring(matcher.start() - start, matcher.end() - start)
                + HIGHLIGHT_END
                + context.substring(matcher.end() - start);

            contexts.add(highlightedContext);
        }

        return contexts;
    }

    public double calculateMatchRelevance(String text, String searchTerm) {
        if (text == null || searchTerm == null || text.isEmpty() || searchTerm.isEmpty()) {
            return 0.0;
        }

        Pattern pattern = Pattern.compile(searchTerm, Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(text);

        int matchCount = 0;
        while (matcher.find()) {
            matchCount++;
        }

        // Calculate relevance based on:
        // 1. Number of matches
        // 2. Match positions (earlier matches score higher)
        // 3. Text length (shorter texts with same matches score higher)
        double matchScore = matchCount * 100.0;
        double lengthPenalty = Math.log10(text.length());
        
        return matchScore / lengthPenalty;
    }

    public List<String> highlightMultipleTerms(String text, List<String> searchTerms) {
        if (text == null || searchTerms == null || text.isEmpty() || searchTerms.isEmpty()) {
            return List.of();
        }

        List<String> contexts = new ArrayList<>();
        for (String term : searchTerms) {
            contexts.addAll(extractMatchContexts(text, term));
        }

        return contexts;
    }
}
