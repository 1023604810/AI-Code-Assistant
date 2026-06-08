package com.aicodeassistant.controller;

import com.aicodeassistant.dto.CodeCompletionRequest;
import com.aicodeassistant.dto.CodeCompletionResponse;
import com.aicodeassistant.dto.CodeRefactorRequest;
import com.aicodeassistant.dto.CodeRefactorResponse;
import com.aicodeassistant.dto.TestGenerationRequest;
import com.aicodeassistant.dto.TestGenerationResponse;
import com.aicodeassistant.service.AiCodeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

/**
 * AI Code Assistant Controller
 * 处理AI代码相关的HTTP请求
 */
@Slf4j
@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AiCodeController {

    private final AiCodeService aiCodeService;

    /**
     * 代码补全接口
     */
    @PostMapping("/completion")
    public ResponseEntity<CodeCompletionResponse> codeCompletion(
            @Valid @RequestBody CodeCompletionRequest request) {
        log.info("Received code completion request for language: {}", request.getLanguage());
        CodeCompletionResponse response = aiCodeService.getCodeCompletion(request);
        return ResponseEntity.ok(response);
    }

    /**
     * 代码重构建议接口
     */
    @PostMapping("/refactor")
    public ResponseEntity<CodeRefactorResponse> codeRefactor(
            @Valid @RequestBody CodeRefactorRequest request) {
        log.info("Received code refactor request for language: {}", request.getLanguage());
        CodeRefactorResponse response = aiCodeService.getCodeRefactorSuggestions(request);
        return ResponseEntity.ok(response);
    }

    /**
     * 单元测试生成接口
     */
    @PostMapping("/tests")
    public ResponseEntity<TestGenerationResponse> generateTests(
            @Valid @RequestBody TestGenerationRequest request) {
        log.info("Received test generation request for language: {}", request.getLanguage());
        TestGenerationResponse response = aiCodeService.generateUnitTests(request);
        return ResponseEntity.ok(response);
    }
}