<template>
  <div class="test-generation">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card class="editor-card">
          <template #header>
            <div class="card-header">
              <span>源代码</span>
              <el-select v-model="selectedLanguage" placeholder="选择语言" style="width: 120px">
                <el-option label="JavaScript" value="javascript"></el-option>
                <el-option label="Java" value="java"></el-option>
                <el-option label="Python" value="python"></el-option>
              </el-select>
            </div>
          </template>
          <textarea
            v-model="sourceCode"
            class="code-editor"
            placeholder="粘贴需要生成测试的代码..."
          ></textarea>
          <div class="action-buttons">
            <el-button
              type="primary"
              @click="generateTests"
              :loading="generating"
            >
              生成测试
            </el-button>
          </div>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card class="test-card">
          <template #header>
            <div class="card-header">
              <span>生成的测试</span>
              <el-button
                size="small"
                @click="copyTests"
                :disabled="generatedTests.length === 0"
              >
                复制测试
              </el-button>
            </div>
          </template>
          <div class="test-content">
            <div v-if="generatedTests.length === 0" class="empty-state">
              <p>点击"生成测试"按钮自动生成单元测试</p>
            </div>
            <div v-else class="tests-list">
              <div
                v-for="(test, index) in generatedTests"
                :key="index"
                class="test-item"
              >
                <div class="test-header">
                  <el-tag type="success">{{ test.framework }}</el-tag>
                  <span class="test-name">{{ test.name }}</span>
                </div>
                <div class="test-code">
                  <pre><code>{{ test.code }}</code></pre>
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

const sourceCode = ref('')
const selectedLanguage = ref('javascript')
const generatedTests = ref([])
const generating = ref(false)

const generateTests = async () => {
  if (!sourceCode.value.trim()) {
    ElMessage.warning('请先输入需要生成测试的代码')
    return
  }

  generating.value = true
  try {
    const response = await api.generateTests({
      code: sourceCode.value,
      language: selectedLanguage.value
    })
    generatedTests.value = response.tests || []
    ElMessage.success('测试生成完成')
  } catch (error) {
    ElMessage.error('生成失败: ' + error.message)
  } finally {
    generating.value = false
  }
}

const copyTests = () => {
  const allTests = generatedTests.value.map(test => test.code).join('\n\n')
  navigator.clipboard.writeText(allTests).then(() => {
    ElMessage.success('已复制到剪贴板')
  }).catch(() => {
    ElMessage.error('复制失败')
  })
}
</script>

<style scoped>
.test-generation {
  height: 100%;
}

.editor-card,
.test-card {
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

.test-content {
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

.tests-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.test-item {
  padding: 15px;
  background: #f0f9ff;
  border: 1px solid #b3d8ff;
  border-radius: 4px;
}

.test-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.test-name {
  font-weight: bold;
  color: #303133;
}

.test-code {
  background: #fafafa;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #e4e7ed;
}

.test-code pre {
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.test-code code {
  font-family: 'Courier New', monospace;
  font-size: 13px;
}
</style>