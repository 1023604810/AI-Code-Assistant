<template>
  <div class="code-refactor">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card class="editor-card">
          <template #header>
            <div class="card-header">
              <span>原始代码</span>
              <el-select v-model="selectedLanguage" placeholder="选择语言" style="width: 120px">
                <el-option label="JavaScript" value="javascript"></el-option>
                <el-option label="Java" value="java"></el-option>
                <el-option label="Python" value="python"></el-option>
              </el-select>
            </div>
          </template>
          <textarea
            v-model="originalCode"
            class="code-editor"
            placeholder="粘贴需要重构的代码..."
          ></textarea>
          <div class="action-buttons">
            <el-button
              type="primary"
              @click="analyzeCode"
              :loading="analyzing"
            >
              分析代码
            </el-button>
          </div>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card class="refactor-card">
          <template #header>
            <span>重构建议</span>
          </template>
          <div class="refactor-content">
            <div v-if="refactorSuggestions.length === 0" class="empty-state">
              <p>点击"分析代码"获取重构建议</p>
            </div>
            <div v-else class="suggestions-list">
              <div
                v-for="(suggestion, index) in refactorSuggestions"
                :key="index"
                class="suggestion-item"
              >
                <div class="suggestion-header">
                  <el-tag :type="getSeverityType(suggestion.severity)">
                    {{ suggestion.severity }}
                  </el-tag>
                  <span class="suggestion-title">{{ suggestion.title }}</span>
                </div>
                <p class="suggestion-description">{{ suggestion.description }}</p>
                <div class="suggestion-code">
                  <pre><code>{{ suggestion.code }}</code></pre>
                </div>
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

const originalCode = ref('')
const selectedLanguage = ref('javascript')
const refactorSuggestions = ref([])
const analyzing = ref(false)

const analyzeCode = async () => {
  if (!originalCode.value.trim()) {
    ElMessage.warning('请先输入需要重构的代码')
    return
  }

  analyzing.value = true
  try {
    const response = await api.codeRefactor({
      code: originalCode.value,
      language: selectedLanguage.value
    })
    refactorSuggestions.value = response.suggestions || []
    ElMessage.success('分析完成')
  } catch (error) {
    ElMessage.error('分析失败: ' + error.message)
  } finally {
    analyzing.value = false
  }
}

const getSeverityType = (severity) => {
  const types = {
    'high': 'danger',
    'medium': 'warning',
    'low': 'info'
  }
  return types[severity] || 'info'
}
</script>

<style scoped>
.code-refactor {
  height: 100%;
}

.editor-card,
.refactor-card {
  height: calc(100vh - 120px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.code-editor {
  width: 100%;
  height: calc(100vh - 280px);
  padding: 10px;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  resize: none;
  background: #f5f5f5;
}

.action-buttons {
  margin-top: 10px;
  text-align: center;
}

.refactor-content {
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
  gap: 15px;
}

.suggestion-item {
  padding: 15px;
  background: #f5f7fa;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
}

.suggestion-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.suggestion-title {
  font-weight: bold;
  color: #303133;
}

.suggestion-description {
  margin: 10px 0;
  color: #606266;
  line-height: 1.5;
}

.suggestion-code {
  background: #fafafa;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #e4e7ed;
}

.suggestion-code pre {
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.suggestion-code code {
  font-family: 'Courier New', monospace;
  font-size: 13px;
}
</style>