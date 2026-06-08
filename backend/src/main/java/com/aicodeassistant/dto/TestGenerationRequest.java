package com.aicodeassistant.dto;

import lombok.Data;

import javax.validation.constraints.NotBlank;

/**
 * 测试生成请求DTO
 */
@Data
public class TestGenerationRequest {

    @NotBlank(message = "代码内容不能为空")
    private String code;

    @NotBlank(message = "编程语言不能为空")
    private String language;

    private String testFramework = "auto";
}