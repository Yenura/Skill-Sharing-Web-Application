package com.example.backend.utils;

import org.springframework.stereotype.Component;
import java.util.regex.Pattern;
import java.util.regex.Matcher;
import java.util.List;
import java.util.ArrayList;
import java.util.Map;
import java.util.HashMap;

@Component
public class SearchHighlighter {

    private static final String HIGHLIGHT_START = "<mark>";
    private static final String HIGHLIGHT_END = "</mark>";

    /**
     * Highlights search terms in the given text
     * @param text The original text
     * @param searchTerm The search term to highlight
     * @return Text with search terms wrapped in highlight tags
     */
    public String highlightText(String text, String searchTerm) {
        if (text == null || searchTerm == null || searchTerm.trim().isEmpty()) {
            return text;
        }

        // Escape special regex characters in search term
        String escapedTerm = Pattern.quote(searchTerm.trim());
        
        // Case insensitive replacement
        String pattern = "(?i)(" + escapedTerm + ")";
        return text.replaceAll(pattern, "<mark>$1</mark>");
    }

    /**
     * Highlights search terms in object fields
     * @param object The object containing text fields
     * @param searchTerm The search term to highlight
     * @return Map containing highlighted fields
     */
    public Map<String, Object> highlightObject(Object object, String searchTerm) {
        Map<String, Object> highlighted = new HashMap<>();
        
        if (object == null) {
            return highlighted;
        }

        // Use reflection to get object fields
        for (java.lang.reflect.Field field : object.getClass().getDeclaredFields()) {
            field.setAccessible(true);
            try {
                Object value = field.get(object);
                if (value instanceof String) {
                    highlighted.put(field.getName(), highlightText((String) value, searchTerm));
                } else {
                    highlighted.put(field.getName(), value);
                }
            } catch (IllegalAccessException e) {
                highlighted.put(field.getName(), null);
            }
        }

        return highlighted;
    }

    public List<Object> highlightList(List<?> list, String searchTerm) {
        List<Object> highlighted = new ArrayList<>();
        
        for (Object item : list) {
            if (item instanceof String) {
                highlighted.add(highlightText((String) item, searchTerm));
            } else if (item instanceof Map) {
                highlighted.add(highlightObject((Map<String, Object>) item, searchTerm));
            } else if (item instanceof List) {
                highlighted.add(highlightList((List<?>) item, searchTerm));
            } else {
                highlighted.add(item);
            }
        }
        
        return highlighted;
    }

    public String[] getHighlightedSnippets(String text, String searchTerm, int snippetLength, int maxSnippets) {
        if (text == null || searchTerm == null || searchTerm.trim().isEmpty()) {
            return new String[0];
        }

        Pattern pattern = Pattern.compile(
            "(?i)(.{0," + snippetLength + "}\\b" + 
            Pattern.quote(searchTerm.trim()) + 
            "\\b.{0," + snippetLength + "})"
        );
        Matcher matcher = pattern.matcher(text);

        List<String> snippets = new ArrayList<>();
        while (matcher.find() && snippets.size() < maxSnippets) {
            String snippet = matcher.group(1);
            snippet = snippet.trim();
            if (snippet.length() > snippetLength * 2) {
                snippet = "..." + snippet.substring(snippetLength) + "...";
            } else if (!snippet.equals(text)) {
                snippet = "..." + snippet + "...";
            }
            snippets.add(highlightText(snippet, searchTerm));
        }

        return snippets.toArray(new String[0]);
    }

    /**
     * Highlights multiple search terms in text
     * @param text The original text
     * @param searchTerms Array of search terms to highlight
     * @return Text with all search terms highlighted
     */
    public String highlightMultipleTerms(String text, String[] searchTerms) {
        if (text == null || searchTerms == null || searchTerms.length == 0) {
            return text;
        }

        String result = text;
        for (String term : searchTerms) {
            result = highlightText(result, term);
        }
        return result;
    }
} 
