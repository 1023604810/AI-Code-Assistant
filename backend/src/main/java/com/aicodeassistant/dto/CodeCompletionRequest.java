package com.aicodeassistant.dto;

import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

/**
 * 代码补全请求DTO
 */
@Data
public class CodeCompletionRequest {

    @NotBlank(message = "代码内容不能为空")
    private String code;

    @NotBlank(message = "编程语言不能为空")
    private String language;

    private Integer maxSuggestions = 3;
}