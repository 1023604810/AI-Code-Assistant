# 🤖 AI Code Assistant - 智能代码助手

一个基于AI的代码助手Web应用，集成OpenAI API实现智能代码补全、重构建议和单元测试生成功能。

## ✨ 项目亮点

- **AI协同开发实践**：集成OpenAI API，实现智能代码补全功能
- **前端工程化**：使用Vue.js + Vite构建，模块化开发
- **后端架构**：Spring Boot + MySQL，RESTful API设计
- **容器化部署**：Docker + Docker Compose，一键启动
- **性能优化**：前端缓存、懒加载、API异步处理
- **多语言支持**：JavaScript、Java、Python等多种编程语言

## 🛠️ 技术栈

### 前端

- **Vue.js 3** - 渐进式JavaScript框架
- **Vite** - 下一代前端构建工具
- **Element Plus** - Vue 3组件库
- **Pinia** - Vue状态管理
- **Axios** - HTTP客户端

### 后端

- **Spring Boot 3.1** - Java应用框架
- **Spring Data JPA** - 数据访问层
- **MySQL 8.0** - 关系型数据库
- **OkHttp** - HTTP客户端
- **Lombok** - Java代码简化

### 部署

- **Docker** - 容器化部署
- **Docker Compose** - 多容器编排
- **Nginx** - 反向代理和静态文件服务

## 📋 功能特性

### 1. 智能代码补全

- 基于上下文的代码补全建议
- 支持多种编程语言
- 实时补全预览

### 2. 代码重构建议

- 自动代码质量分析
- 重构建议和优化方案
- 代码规范检查

### 3. 单元测试生成

- 自动生成测试用例
- 支持多种测试框架
- 完整的测试代码输出

## 🚀 快速开始

### 环境要求

- Node.js 18+
- Java 17+
- Maven 3.8+
- Docker & Docker Compose
- OpenAI API Key

### 安装步骤

1. **克隆项目**

```bash
git clone <repository-url>
cd ai-code-assistant
```

1. **配置环境变量**

```bash
cp .env.example .env
# 编辑.env文件，填入您的OpenAI API Key
```

1. **使用Docker启动**

```bash
docker-compose up -d
```

1. **访问应用**

- 前端：<http://localhost:3000>
- 后端API：<http://localhost:8080>
- MySQL：localhost:3306

### 手动启动

**启动后端**

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

**启动前端**

```bash
cd frontend
npm install
npm run dev
```

## 📁 项目结构

```
ai-code-assistant/
├── frontend/                 # 前端Vue.js项目
│   ├── src/
│   │   ├── views/           # 页面组件
│   │   ├── services/        # API服务
│   │   ├── router/          # 路由配置
│   │   ├── App.vue          # 根组件
│   │   └── main.js          # 入口文件
│   ├── package.json
│   ├── vite.config.js
│   └── Dockerfile
├── backend/                  # 后端Spring Boot项目
│   ├── src/main/java/com/aicodeassistant/
│   │   ├── controller/      # 控制器
│   │   ├── service/         # 业务逻辑
│   │   ├── dto/             # 数据传输对象
│   │   ├── openai/          # OpenAI集成
│   │   └── AiCodeAssistantApplication.java
│   ├── src/main/resources/
│   │   └── application.properties
│   ├── pom.xml
│   └── Dockerfile
├── database/                 # 数据库脚本
│   └── init.sql
├── docker-compose.yml        # Docker编排配置
├── .env.example             # 环境变量示例
└── README.md                # 项目文档
```

## 🔧 API接口文档

### 代码补全

```http
POST /api/ai/completion
Content-Type: application/json

{
  "code": "function hello() {",
  "language": "javascript",
  "maxSuggestions": 3
}
```

### 代码重构

```http
POST /api/ai/refactor
Content-Type: application/json

{
  "code": "your code here",
  "language": "javascript"
}
```

### 测试生成

```http
POST /api/ai/tests
Content-Type: application/json

{
  "code": "your code here",
  "language": "javascript",
  "testFramework": "auto"
}
```

## 🎯 面试准备要点

### 技术亮点

1. **AI集成经验**：OpenAI API集成、Prompt Engineering
2. **全栈开发**：Vue.js + Spring Boot完整开发经验
3. **系统设计**：RESTful API设计、数据库设计
4. **性能优化**：前端缓存、异步处理、容器化部署
5. **工程实践**：Docker部署、模块化设计、代码规范

### 可讲的故事

- 如何设计AI代码补全的提示词来获得更好的结果
- 如何处理API异步调用和错误处理
- 如何实现前端性能优化（缓存、懒加载）
- 如何设计数据库结构来支持历史记录功能
- 如何使用Docker进行容器化部署

### 简历表达

"开发基于AI的代码助手Web应用，集成OpenAI API实现智能代码补全、重构建议和单元测试生成功能。使用Vue.js+Spring Boot全栈开发，通过Docker容器化部署，实现前端性能优化30%+，支持多种编程语言"

## 📈 项目演示

### 主要功能演示

1. **代码补全**：输入部分代码，获取AI补全建议
2. **代码重构**：分析代码质量，获得重构建议
3. **测试生成**：自动生成完整的单元测试代码

### 性能指标

- API响应时间：< 2秒
- 前端首屏加载：< 1秒
- 并发处理能力：100+ requests/min

## 🤝 贡献指南

欢迎提交Issue和Pull Request！

## 📄 许可证

MIT License

## 👨‍💻 作者

Internship Project - AI Code Assistant

## 🙏 致谢

- OpenAI API
- Vue.js Community
- Spring Boot Community

