package com.aicodeassistant.openai;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import okhttp3.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.concurrent.TimeUnit;

/**
 * OpenAI API服务类
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class OpenAiService {

    @Value("${openai.api.key}")
    private String apiKey;

    @Value("${openai.api.url}")
    private String apiUrl;

    private final Gson gson = new Gson();
    private final OkHttpClient client = new OkHttpClient.Builder()
            .connectTimeout(30, TimeUnit.SECONDS)
            .readTimeout(30, TimeUnit.SECONDS)
            .writeTimeout(30, TimeUnit.SECONDS)
            .build();

    /**
     * 调用OpenAI API
     */
    public String callOpenAiApi(String prompt) throws IOException {
        // 构建请求体
        JsonObject requestBody = new JsonObject();
        requestBody.addProperty("model", "gpt-3.5-turbo");
        requestBody.addProperty("max_tokens", 500);
        requestBody.addProperty("temperature", 0.7);

        JsonObject message = new JsonObject();
        message.addProperty("role", "user");
        message.addProperty("content", prompt);

        requestBody.add("messages", gson.toJsonTree(new Object[]{message}));

        // 构建HTTP请求
        Request request = new Request.Builder()
                .url(apiUrl)
                .addHeader("Authorization", "Bearer " + apiKey)
                .addHeader("Content-Type", "application/json")
                .post(RequestBody.create(requestBody.toString(), MediaType.parse("application/json")))
                .build();

        // 发送请求
        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                throw new IOException("OpenAI API request failed: " + response.code());
            }

            String responseBody = response.body().string();
            log.debug("OpenAI API response: {}", responseBody);

            // 解析响应
            return parseOpenAiResponse(responseBody);
        }
    }

    /**
     * 解析OpenAI API响应
     */
    private String parseOpenAiResponse(String responseBody) {
        try {
            JsonObject responseJson = gson.fromJson(responseBody, JsonObject.class);
            
            if (responseJson.has("choices") && responseJson.getAsJsonArray("choices").size() > 0) {
                JsonObject choice = responseJson.getAsJsonArray("choices").get(0).getAsJsonObject();
                
                if (choice.has("message")) {
                    JsonObject message = choice.getAsJsonObject("message");
                    if (message.has("content")) {
                        return message.get("content").getAsString();
                    }
                }
                
                // 兼容旧版本API格式
                if (choice.has("text")) {
                    return choice.get("text").getAsString();
                }
            }
            
            return "No response content found";
            
        } catch (Exception e) {
            log.error("Failed to parse OpenAI response", e);
            return "Failed to parse response: " + e.getMessage();
        }
    }

    /**
     * 检查API密钥是否配置
     */
    public boolean isApiKeyConfigured() {
        return apiKey != null && !apiKey.isEmpty() && !apiKey.equals("your-api-key-here");
    }
}