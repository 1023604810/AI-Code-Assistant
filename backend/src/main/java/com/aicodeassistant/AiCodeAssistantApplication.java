package com.aicodeassistant;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * AI Code Assistant Backend Application
 * 智能代码助手后端服务主启动类
 */
@SpringBootApplication
public class AiCodeAssistantApplication {

    public static void main(String[] args) {
        SpringApplication.run(AiCodeAssistantApplication.class, args);
        System.out.println("AI Code Assistant Backend started successfully!");
    }
}