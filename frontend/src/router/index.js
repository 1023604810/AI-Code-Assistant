import { createRouter, createWebHistory } from 'vue-router'
import CodeCompletion from '@/views/CodeCompletion.vue'
import CodeRefactor from '@/views/CodeRefactor.vue'
import TestGeneration from '@/views/TestGeneration.vue'

const routes = [
  {
    path: '/',
    name: 'CodeCompletion',
    component: CodeCompletion
  },
  {
    path: '/refactor',
    name: 'CodeRefactor',
    component: CodeRefactor
  },
  {
    path: '/tests',
    name: 'TestGeneration',
    component: TestGeneration
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router