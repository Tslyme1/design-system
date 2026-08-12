import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [react()],
  server: {
    // По умолчанию Vite слушает только IPv6-loopback ([::1]) — браузер,
    // резолвящий localhost в 127.0.0.1, получает ERR_CONNECTION_REFUSED.
    host: '127.0.0.1',
    port: 5173,
    watch: {
      // Сборка Storybook пишет сюда сотни файлов; наблюдатель Vite
      // ловит их в момент записи и падает с EBUSY, унося дев-сервер.
      ignored: ['**/storybook-static/**'],
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      // Демо-данные витрины. Один источник на все истории: одинаковые
      // сущности обязаны выглядеть одинаково во всех разделах Storybook.
      '@fixtures': fileURLToPath(new URL('./.storybook/fixtures.ts', import.meta.url)),
      // Хелперы витрины: подписи вариантов, матрица состояний, разбор анатомии.
      '@spec': fileURLToPath(new URL('./.storybook/spec.tsx', import.meta.url)),
    },
  },
  css: {
    modules: {
      localsConvention: 'camelCaseOnly',
    },
  },
});
