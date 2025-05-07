package com.skillsharing.model;

// import lombok.Data;

//import javax.validation.constraints.NotBlank;

// @Data
public class Resource {
    // @NotBlank(message = "Resource title is required")
    private String title;

    // @NotBlank(message = "URL is required")
    private String url;

    // @NotBlank(message = "Type is required")
    private String type;

    //constructor
    public Resource() {}

    public String getTitle() {
        return title;
    }
    public void setTitle(String title) {
        this.title = title;
    }
    public String getUrl() {
        return url;
    }
    public void setUrl(String url) {
        this.url = url;
    }
    public String getType() {
        return type;
    }
    public void setType(String type) {
        this.type = type;
    }
}