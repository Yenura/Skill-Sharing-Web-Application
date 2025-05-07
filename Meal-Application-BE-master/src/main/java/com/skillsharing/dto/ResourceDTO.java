package com.skillsharing.dto;

import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class ResourceDTO {
    @NotBlank(message = "Resource title is required")
    private String title;

    @NotBlank(message = "URL is required")
    private String url;

    @NotBlank(message = "Type is required")
    private String type;
}