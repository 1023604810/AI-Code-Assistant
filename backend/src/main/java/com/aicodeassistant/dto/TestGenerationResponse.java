package com.aicodeassistant.dto;

import lombok.Data;

import java.util.List;

/**
 * 测试生成响应DTO
 */
@Data
public class TestGenerationResponse {

    private boolean success;
    private String message;
    private List<TestCase> tests;

    @Data
    public static class TestCase {
        private String name;
        private String framework;
        private String code;
    }
}