<template>
  <div class="code-completion">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card class="editor-card">
          <template #header>
            <div class="card-header">
              <span>代码编辑器</span>
              <el-select v-model="selectedLanguage" placeholder="选择语言" style="width: 120px">
                <el-option label="JavaScript" value="javascript"></el-option>
                <el-option label="Java" value="java"></el-option>
                <el-option label="Python" value="python"></el-option>
              </el-select>
            </div>
          </template>
          <textarea
            v-model="code"
            class="code-editor"
            placeholder="在这里输入您的代码..."
            @input="handleCodeChange"
          ></textarea>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card class="suggestion-card">
          <template #header>
            <div class="card-header">
              <span>AI 建议</span>
              <el-button
                type="primary"
                size="small"
                @click="getCompletion"
                :loading="loading"
              >
                获取补全
              </el-button>
            </div>
          </template>
          <div class="suggestion-content">
            <div v-if="suggestions.length === 0" class="empty-state">
              <p>点击"获取补全"按钮获取AI代码建议</p>
            </div>
            <div v-else class="suggestions-list">
              <div
                v-for="(suggestion, index) in suggestions"
                :key="index"
                class="suggestion-item"
                @click="applySuggestion(suggestion)"
              >
                <pre><code>{{ suggestion }}</code></pre>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import api from '@/services/api'

const code = ref('')
const selectedLanguage = ref('javascript')
const suggestions = ref([])
const loading = ref(false)

const handleCodeChange = () => {
  // 防抖处理可以在这里添加
}

const getCompletion = async () => {
  if (!code.value.trim()) {
    ElMessage.warning('请先输入一些代码')
    return
  }

  loading.value = true
  try {
    const response = await api.codeCompletion({
      code: code.value,
      language: selectedLanguage.value
    })
    suggestions.value = response.suggestions || []
    ElMessage.success('获取建议成功')
  } catch (error) {
    ElMessage.error('获取建议失败: ' + error.message)
  } finally {
    loading.value = false
  }
}

const applySuggestion = (suggestion) => {
  code.value += '\n' + suggestion
  ElMessage.success('已应用建议')
}
</script>

<style scoped>
.code-completion {
  height: 100%;
}

.editor-card,
.suggestion-card {
  height: calc(100vh - 120px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.code-editor {
  width: 100%;
  height: calc(100vh - 200px);
  padding: 10px;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  resize: none;
  background: #f5f5f5;
}

.suggestion-content {
  height: calc(100vh - 200px);
  overflow-y: auto;
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #909399;
}

.suggestions-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.suggestion-item {
  padding: 10px;
  background: #f5f7fa;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.suggestion-item:hover {
  background: #e6f7ff;
  border-color: #1890ff;
}

.suggestion-item pre {
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.suggestion-item code {
  font-family: 'Courier New', monospace;
  font-size: 13px;
}
</style>