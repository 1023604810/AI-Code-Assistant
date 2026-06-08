package com.aicodeassistant.dto;

import lombok.Data;

import java.util.List;

/**
 * 代码重构响应DTO
 */
@Data
public class CodeRefactorResponse {

    private boolean success;
    private String message;
    private List<RefactorSuggestion> suggestions;

    @Data
    public static class RefactorSuggestion {
        private String severity;
        private String title;
        private String description;
        private String code;
    }
}