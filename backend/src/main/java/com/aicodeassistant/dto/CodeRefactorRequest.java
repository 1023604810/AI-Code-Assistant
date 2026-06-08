package com.aicodeassistant.dto;

import lombok.Data;

import javax.validation.constraints.NotBlank;

/**
 * 代码重构请求DTO
 */
@Data
public class CodeRefactorRequest {

    @NotBlank(message = "代码内容不能为空")
    private String code;

    @NotBlank(message = "编程语言不能为空")
    private String language;
}