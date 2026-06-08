const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');

const app = express();
const PORT = process.env.PORT || 8080;

// 配置DeepSeek API客户端
const openai = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY || 'your-api-key-here',
  baseURL: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com/v1'
});

// DeepSeek模型名称
const AI_MODEL = process.env.AI_MODEL || 'deepseek-chat';

// 内存存储（演示用）
let codeHistory = [];
let apiUsageStats = {
  completion: { request_count: 0, success_count: 0, failure_count: 0 },
  refactor: { request_count: 0, success_count: 0, failure_count: 0 },
  test: { request_count: 0, success_count: 0, failure_count: 0 }
};

// 中间件
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// 更新使用统计
function updateStats(apiType, success) {
  if (!apiUsageStats[apiType]) {
    apiUsageStats[apiType] = { request_count: 0, success_count: 0, failure_count: 0 };
  }
  apiUsageStats[apiType].request_count++;
  if (success) {
    apiUsageStats[apiType].success_count++;
  } else {
    apiUsageStats[apiType].failure_count++;
  }
}

// 代码补全接口
app.post('/api/ai/completion', async (req, res) => {
  try {
    const { code, language, maxSuggestions = 3 } = req.body;
    
    if (!code || !language) {
      return res.status(400).json({ success: false, message: '缺少必要参数' });
    }

    // 构建提示词
    const prompt = `你是一个专业的${language}编程助手。请为以下代码提供${maxSuggestions}个合理的代码补全建议：\n\n代码：\n${code}\n\n请只返回代码补全内容，每行一个建议，不要包含任何解释。`;

    // 调用DeepSeek API
    const response = await openai.chat.completions.create({
      model: AI_MODEL,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 500,
      temperature: 0.7
    });

    const suggestions = response.choices[0].message.content
      .split('\n')
      .filter(line => line.trim() && !line.trim().startsWith('//') && !line.trim().startsWith('#'))
      .slice(0, maxSuggestions);

    // 保存历史记录
    codeHistory.unshift({
      id: Date.now(),
      code_type: 'completion',
      language,
      original_code: code,
      ai_response: JSON.stringify(suggestions),
      created_at: new Date().toISOString()
    });
    if (codeHistory.length > 20) codeHistory.pop();

    updateStats('completion', true);

    res.json({ success: true, message: '代码补全成功', suggestions });

  } catch (error) {
    console.error('Code completion error:', error);
    updateStats('completion', false);
    
    // 返回模拟数据（演示用）
    res.json({ 
      success: false, 
      message: '代码补全失败: ' + error.message, 
      suggestions: [
        'return result;',
        'console.log(data);',
        'const result = process(input);'
      ]
    });
  }
});

// 代码重构接口
app.post('/api/ai/refactor', async (req, res) => {
  try {
    const { code, language } = req.body;
    
    if (!code || !language) {
      return res.status(400).json({ success: false, message: '缺少必要参数' });
    }

    // 构建提示词
    const prompt = `你是一个专业的${language}代码审查专家。请分析以下代码，并提供重构建议。\n\n代码：\n${code}\n\n请以JSON格式返回建议，每个建议包含：\n- severity: 严重程度(high/medium/low)\n- title: 标题\n- description: 描述\n- code: 重构后的代码\n\n返回格式：[{"severity":"high|medium|low","title":"建议标题","description":"详细描述","code":"重构代码"}]`;

    // 调用DeepSeek API
    const response = await openai.chat.completions.create({
      model: AI_MODEL,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1000,
      temperature: 0.7
    });

    let suggestions = [];
    try {
      suggestions = JSON.parse(response.choices[0].message.content);
    } catch {
      suggestions = [{
        severity: 'medium',
        title: '代码结构优化',
        description: '建议将复杂逻辑提取为独立方法，提高代码可读性和可维护性',
        code: '// 重构后的代码示例\nfunction optimizedMethod() {\n  // 提取的复杂逻辑\n  return result;\n}'
      }];
    }

    // 保存历史记录
    codeHistory.unshift({
      id: Date.now(),
      code_type: 'refactor',
      language,
      original_code: code,
      ai_response: JSON.stringify(suggestions),
      created_at: new Date().toISOString()
    });
    if (codeHistory.length > 20) codeHistory.pop();

    updateStats('refactor', true);

    res.json({ success: true, message: '代码分析完成', suggestions });

  } catch (error) {
    console.error('Code refactor error:', error);
    updateStats('refactor', false);
    
    // 返回模拟数据（演示用）
    res.json({ 
      success: false, 
      message: '代码分析失败: ' + error.message, 
      suggestions: [{
        severity: 'medium',
        title: '代码结构优化',
        description: '建议将复杂逻辑提取为独立方法，提高代码可读性和可维护性',
        code: '// 重构后的代码示例\nfunction optimizedMethod() {\n  // 提取的复杂逻辑\n  return result;\n}'
      }]
    });
  }
});

// 测试生成接口
app.post('/api/ai/tests', async (req, res) => {
  try {
    const { code, language, testFramework = 'auto' } = req.body;
    
    if (!code || !language) {
      return res.status(400).json({ success: false, message: '缺少必要参数' });
    }

    // 获取测试框架
    const framework = getTestFramework(language);

    // 构建提示词
    const prompt = `你是一个专业的测试工程师。请为以下${language}代码生成完整的单元测试，使用${framework}框架。\n\n代码：\n${code}\n\n请生成2-3个测试用例，每个测试用例包含测试名称、测试框架和完整的测试代码。\n\n请以JSON格式返回：[{"name":"测试名称","framework":"测试框架","code":"完整测试代码"}]`;

    // 调用DeepSeek API
    const response = await openai.chat.completions.create({
      model: AI_MODEL,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1000,
      temperature: 0.7
    });

    let tests = [];
    try {
      tests = JSON.parse(response.choices[0].message.content);
    } catch {
      tests = [{
        name: 'testBasicFunctionality',
        framework: framework,
        code: generateSampleTestCode(language)
      }];
    }

    // 保存历史记录
    codeHistory.unshift({
      id: Date.now(),
      code_type: 'test',
      language,
      original_code: code,
      ai_response: JSON.stringify(tests),
      created_at: new Date().toISOString()
    });
    if (codeHistory.length > 20) codeHistory.pop();

    updateStats('test', true);

    res.json({ success: true, message: '测试生成完成', tests });

  } catch (error) {
    console.error('Test generation error:', error);
    updateStats('test', false);
    
    // 返回模拟数据（演示用）
    const framework = getTestFramework(req.body.language || 'javascript');
    res.json({ 
      success: false, 
      message: '测试生成失败: ' + error.message, 
      tests: [{
        name: 'testBasicFunctionality',
        framework: framework,
        code: generateSampleTestCode(req.body.language || 'javascript')
      }]
    });
  }
});

// 获取历史记录接口
app.get('/api/history', (req, res) => {
  res.json({ success: true, history: codeHistory });
});

// 获取统计信息接口
app.get('/api/stats', (req, res) => {
  res.json({ success: true, stats: apiUsageStats });
});

// 根据语言获取测试框架
function getTestFramework(language) {
  const frameworks = {
    'javascript': 'Jest',
    'java': 'JUnit',
    'python': 'PyTest'
  };
  return frameworks[language.toLowerCase()] || 'Jest';
}

// 生成示例测试代码
function generateSampleTestCode(language) {
  const tests = {
    'javascript': `test('basic functionality', () => {\n  const input = 'test';\n  const result = methodUnderTest(input);\n  \n  expect(result).toBeDefined();\n  expect(result).toBe('expected');\n});`,
    'java': `@Test\npublic void testBasicFunctionality() {\n    String input = \"test\";\n    String result = methodUnderTest(input);\n    \n    assertNotNull(result);\n    assertEquals(\"expected\", result);\n}`,
    'python': `def test_basic_functionality():\n    input = \"test\"\n    result = method_under_test(input)\n    \n    assert result is not None\n    assert result == \"expected\"`
  };
  return tests[language.toLowerCase()] || '// Sample test code';
}

// 健康检查接口
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`AI Code Assistant Backend running on http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('  POST /api/ai/completion - 代码补全');
  console.log('  POST /api/ai/refactor - 代码重构');
  console.log('  POST /api/ai/tests - 测试生成');
  console.log('  GET /api/history - 获取历史记录');
  console.log('  GET /api/stats - 获取统计信息');
  console.log('  GET /api/health - 健康检查');
});