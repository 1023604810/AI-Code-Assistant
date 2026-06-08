import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 30000
})

// 请求拦截器
api.interceptors.request.use(
  config => {
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)

export default {
  // 代码补全
  async codeCompletion(params) {
    return api.post('/ai/completion', params)
  },

  // 代码重构建议
  async codeRefactor(params) {
    return api.post('/ai/refactor', params)
  },

  // 生成单元测试
  async generateTests(params) {
    return api.post('/ai/tests', params)
  },

  // 获取历史记录
  async getHistory() {
    return api.get('/history')
  },

  // 保存历史记录
  async saveHistory(params) {
    return api.post('/history', params)
  }
}