import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { copyFileSync } from 'node:fs';
import { fileURLToPath, URL } from 'node:url';

/**
 * Сборка дизайн-системы как библиотеки.
 *
 * Отдельным файлом от `vite.config.ts`: тот обслуживает песочницу — дев-сервер,
 * алиасы витрины, приложение целиком. Смешивать их в одном конфиге значит
 * тащить в пакет то, что нужно только разработке.
 *
 * Три решения, которые здесь приняты явно:
 *
 * 1. React вынесен наружу (`external`). Библиотека, принесшая с собой второй
 *    React, ломает хуки в приложении — это не оптимизация размера, а условие
 *    работоспособности. Вместе с ним вынесен floating-ui: он объявлен в
 *    `dependencies`, потребитель получит его установкой пакета, а вшитая
 *    копия просто удвоила бы вес, если он уже есть в приложении.
 * 2. Стили собираются в один файл, а не режутся по компонентам
 *    (`cssCodeSplit: false`). Потребитель подключает их одной строкой; порядок
 *    правил при этом задаём мы, а не порядок импортов в чужом коде.
 * 3. Токены дополнительно кладутся отдельным файлом. Приложению, которому нужны
 *    только переменные тем (например, покрасить свою разметку), не нужно тянуть
 *    стили всех компонентов.
 */
const copyTokens = () => ({
  name: 'copy-tokens-css',
  closeBundle() {
    copyFileSync(
      fileURLToPath(new URL('./src/tokens/tokens.css', import.meta.url)),
      fileURLToPath(new URL('./dist/tokens.css', import.meta.url)),
    );
  },
});

export default defineConfig({
  plugins: [react(), copyTokens()],

  css: {
    modules: {
      localsConvention: 'camelCaseOnly',
    },
  },

  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
    cssCodeSplit: false,

    lib: {
      entry: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
      formats: ['es'],
      fileName: () => 'index.js',
    },

    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'react/jsx-dev-runtime',
        /^@floating-ui\//,
      ],
      output: {
        assetFileNames: (asset) => (asset.name?.endsWith('.css') ? 'styles.css' : '[name][extname]'),
      },
    },
  },
});
