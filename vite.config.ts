import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react()],
    define: {
      // API Key가 없으면 빈 문자열('')을 넣어 에러 방지
      'process.env.API_KEY': JSON.stringify(env.API_KEY || '')
    }
  };
});