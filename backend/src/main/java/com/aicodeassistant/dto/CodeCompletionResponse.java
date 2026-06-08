package com.aicodeassistant.dto;

import lombok.Data;

import java.util.List;

/**
 * 代码补全响应DTO
 */
@Data
public class CodeCompletionResponse {

    private boolean success;
    private String message;
    private List<String> suggestions;
}