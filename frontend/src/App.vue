<template>
  <div id="app">
    <el-container class="app-container">
      <el-header class="app-header">
        <div class="logo">
          <h2>🤖 AI Code Assistant</h2>
        </div>
        <nav class="nav-menu">
          <router-link to="/" class="nav-item">代码补全</router-link>
          <router-link to="/refactor" class="nav-item">代码重构</router-link>
          <router-link to="/tests" class="nav-item">测试生成</router-link>
        </nav>
      </el-header>
      <el-main class="app-main">
        <router-view />
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  console.log('AI Code Assistant initialized')
})
</script>

<style scoped>
.app-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.logo h2 {
  margin: 0;
  font-size: 1.5rem;
}

.nav-menu {
  display: flex;
  gap: 20px;
}

.nav-item {
  color: white;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 4px;
  transition: background 0.3s;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.2);
}

.app-main {
  flex: 1;
  overflow: auto;
  padding: 20px;
}
</style>