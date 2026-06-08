# 🚀 项目启动指南

## 前置条件检查

在启动项目之前，请确保您的环境满足以下要求：

### 必需软件
- [ ] Node.js 18+ 
- [ ] Java 17+
- [ ] Maven 3.8+
- [ ] Docker & Docker Compose
- [ ] OpenAI API Key

### 检查命令
```bash
node --version    # 应该显示 v18.x.x
java --version    # 应该显示 17.x.x
mvn --version     # 应该显示 3.8.x
docker --version  # 应该显示 Docker版本
docker-compose --version  # 应该显示 Docker Compose版本
```

## 📝 配置步骤

### 1. 获取OpenAI API Key
1. 访问 https://platform.openai.com/
2. 注册/登录账号
3. 进入API Keys页面
4. 创建新的API Key
5. 复制API Key（只显示一次，请妥善保存）

### 2. 配置环境变量
```bash
# 复制环境变量模板
cp .env.example .env

# 编辑.env文件，填入您的OpenAI API Key
# OPENAI_API_KEY=sk-your-actual-api-key-here
```

## 🎯 启动方式

### 方式一：Docker一键启动（推荐）

```bash
# 构建并启动所有服务
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

**访问地址：**
- 前端应用：http://localhost:3000
- 后端API：http://localhost:8080
- MySQL数据库：localhost:3306

### 方式二：手动启动

#### 启动MySQL数据库
```bash
# 使用Docker启动MySQL
docker run -d \
  --name ai-code-assistant-mysql \
  -e MYSQL_ROOT_PASSWORD=root123 \
  -e MYSQL_DATABASE=ai_code_assistant \
  -e MYSQL_USER=devuser \
  -e MYSQL_PASSWORD=devpass123 \
  -p 3306:3306 \
  -v $(pwd)/database/init.sql:/docker-entrypoint-initdb.d/init.sql \
  mysql:8.0
```

#### 启动后端服务
```bash
cd backend

# 安装依赖
mvn clean install

# 启动服务
mvn spring-boot:run

# 或者打包后运行
mvn clean package
java -jar target/ai-code-assistant-backend-1.0.0.jar
```

#### 启动前端服务
```bash
cd frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 或者构建生产版本
npm run build
```

## 🧪 功能测试

### 1. 测试后端API
```bash
# 测试代码补全接口
curl -X POST http://localhost:8080/api/ai/completion \
  -H "Content-Type: application/json" \
  -d '{
    "code": "function hello() {",
    "language": "javascript",
    "maxSuggestions": 3
  }'

# 测试代码重构接口
curl -X POST http://localhost:8080/api/ai/refactor \
  -H "Content-Type: application/json" \
  -d '{
    "code": "var x=1+2+3+4+5;",
    "language": "javascript"
  }'

# 测试测试生成接口
curl -X POST http://localhost:8080/api/ai/tests \
  -H "Content-Type: application/json" \
  -d '{
    "code": "function add(a,b){return a+b;}",
    "language": "javascript"
  }'
```

### 2. 测试前端界面
1. 打开浏览器访问 http://localhost:3000
2. 测试代码补全功能
3. 测试代码重构功能
4. 测试测试生成功能

## 🐛 常见问题解决

### 问题1：MySQL连接失败
**解决方案：**
```bash
# 检查MySQL容器状态
docker ps | grep mysql

# 查看MySQL日志
docker logs ai-code-assistant-mysql

# 重启MySQL容器
docker restart ai-code-assistant-mysql
```

### 问题2：OpenAI API调用失败
**解决方案：**
1. 检查API Key是否正确配置
2. 确认API Key有足够的额度
3. 检查网络连接是否正常
4. 查看后端日志获取详细错误信息

### 问题3：前端无法连接后端
**解决方案：**
1. 检查后端服务是否正常启动
2. 确认后端端口8080没有被占用
3. 检查前端代理配置是否正确
4. 查看浏览器控制台的错误信息

### 问题4：Docker容器启动失败
**解决方案：**
```bash
# 查看容器日志
docker-compose logs

# 重新构建镜像
docker-compose build

# 清理并重新启动
docker-compose down -v
docker-compose up -d
```

## 📊 性能监控

### 查看应用日志
```bash
# 查看所有服务日志
docker-compose logs -f

# 查看特定服务日志
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mysql
```

### 监控资源使用
```bash
# 查看容器资源使用情况
docker stats

# 查看磁盘使用
docker system df
```

## 🎓 开发调试

### 前端调试
1. 在浏览器中打开开发者工具（F12）
2. 查看Console和Network标签
3. Vue DevTools扩展可以帮助调试Vue组件

### 后端调试
1. 在IDE中设置断点
2. 以Debug模式运行Spring Boot应用
3. 查看控制台输出的日志信息

## 🚀 部署到生产环境

### 构建生产镜像
```bash
# 构建所有服务的生产镜像
docker-compose -f docker-compose.prod.yml build

# 启动生产环境
docker-compose -f docker-compose.prod.yml up -d
```

### 安全配置
1. 修改默认数据库密码
2. 配置HTTPS
3. 设置防火墙规则
4. 定期备份数据库
5. 监控API调用频率

## 📞 技术支持

如果遇到问题，请：
1. 查看日志文件获取详细错误信息
2. 检查常见问题解决方案
3. 提交Issue到项目仓库

---

**祝您使用愉快！** 🎉