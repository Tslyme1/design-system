import type { StorybookConfig } from '@storybook/react-vite';

/**
 * Витрина живёт рядом с кодом и собирается тем же Vite,
 * что и приложение: алиас `@`, CSS-модули и токены приезжают из vite.config.ts.
 * Отдельной сборки у Storybook нет намеренно — иначе витрина начнёт
 * показывать не то, что попадает в продукт.
 */
const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
};

export default config;
