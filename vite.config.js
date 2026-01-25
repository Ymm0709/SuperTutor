import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 根据环境变量决定 base path
// 如果是 GitHub Pages，使用仓库名作为 base path
// 如果是本地开发，使用根路径
export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? '/SuperTutor/' : '/',
})

