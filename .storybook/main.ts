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

  /**
   * Каталоги сборки выведены из-под наблюдения.
   *
   * Vite следит за всем деревом проекта, включая `storybook-static` —
   * результат `build-storybook`. Файлы шрифтов внутри него оказываются
   * заняты, и наблюдатель падает с `EBUSY`, унося весь дев-сервер:
   * витрина умирает молча посреди работы, а причина выглядит случайной,
   * потому что зависит от того, держит ли кто-то файл в этот момент.
   *
   * Это сбивало запуск дважды за одну сессию. Сами каталоги в `.gitignore`
   * и результатом сборки не являются частью исходников — следить за ними
   * незачем.
   */
  viteFinal: async (config) => ({
    ...config,
    server: {
      ...config.server,
      watch: {
        ...config.server?.watch,
        ignored: ['**/storybook-static/**', '**/dist/**', '**/.vite/**'],
      },
    },
  }),
};

export default config;
