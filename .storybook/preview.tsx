import type { Preview, Decorator } from '@storybook/react-vite';
import { DocsContainer } from '@storybook/addon-docs/blocks';
import type { DocsContainerProps } from '@storybook/addon-docs/blocks';
import { addons } from 'storybook/preview-api';
import { useEffect, useState, type PropsWithChildren } from 'react';
import { lightTheme, darkTheme } from './theme';
import '../src/tokens/tokens.css';
import './preview.css';

type ThemeName = 'light' | 'dark';

/**
 * Текущая тема внутри превью-окна.
 *
 * Страница Docs живёт не в оболочке Storybook, а в iframe превью, и про
 * `setConfig` из `manager.ts` не знает — у неё свой провайдер темы, который
 * по умолчанию всегда светлый. Отсюда и брались белые куски, которые мы
 * четыре раза перекрашивали через CSS: перекрашивалось следствие.
 *
 * Начальное значение читается из адреса iframe (`?globals=theme:dark`) —
 * на момент первой отрисовки канал ещё молчит, и без этого страница успевала
 * мигнуть светлым. Дальше значение обновляют события канала: `setGlobals`
 * приходит на старте превью, `globalsUpdated` — на каждое переключение.
 */
const themeFromUrl = (): ThemeName => {
  const globals = new URLSearchParams(window.location.search).get('globals') ?? '';
  return globals.includes('theme:dark') ? 'dark' : 'light';
};

const useThemeName = (): ThemeName => {
  const [theme, setTheme] = useState<ThemeName>(themeFromUrl);

  useEffect(() => {
    const channel = addons.getChannel();
    const handle = ({ globals }: { globals?: Record<string, unknown> }) => {
      const next = globals?.theme;
      if (next === 'light' || next === 'dark') setTheme(next);
    };

    channel.on('setGlobals', handle);
    channel.on('globalsUpdated', handle);
    return () => {
      channel.off('setGlobals', handle);
      channel.off('globalsUpdated', handle);
    };
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return theme;
};

/**
 * Тема переключается тем же способом, что и в приложении: атрибутом
 * `data-theme` на корне документа. Никаких пропов темы у компонентов нет —
 * компонент не должен знать, в какой теме он нарисован.
 */
const withTheme: Decorator = (Story, context) => {
  const theme = context.globals.theme as ThemeName;

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  /**
   * Фон и цвет текста ставятся здесь, а не наследуются от страницы.
   * Контейнер истории внутри Docs красится собственным фоном Storybook,
   * поэтому при тёмной теме компонент оставался на белом квадрате —
   * сравнивать тему в таком виде невозможно.
   */
  return (
    <div style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }}>
      <Story />
    </div>
  );
};

/**
 * Обёртка страницы Docs со своей темой.
 *
 * `DocsContainer` принимает `theme` — это штатная точка расширения, а не
 * обход. Через неё тему получает вся начинка страницы разом: заголовки,
 * таблица пропсов вместе с её кнопками и полями, блоки кода, оглавление.
 * Перечислять их классы в CSS больше не нужно — и не нужно догадываться,
 * какой класс мы ещё не нашли.
 */
const ThemedDocs = ({ children, context }: PropsWithChildren<DocsContainerProps>) => {
  const theme = useThemeName();

  return (
    <DocsContainer context={context} theme={theme === 'dark' ? darkTheme : lightTheme}>
      {children}
    </DocsContainer>
  );
};

const preview: Preview = {
  decorators: [withTheme],

  globalTypes: {
    theme: {
      description: 'Тема',
      toolbar: {
        title: 'Тема',
        icon: 'circlehollow',
        items: [
          { value: 'light', title: 'Светлая' },
          { value: 'dark', title: 'Тёмная' },
        ],
        dynamicTitle: true,
      },
    },
  },

  initialGlobals: {
    theme: 'light',
  },

  parameters: {
    layout: 'centered',

    /* Порядок разделов фиксирован. Алфавитный порядок ставит Foundations
       после Components, и витрина начинает читаться с конца. */
    options: {
      storySort: {
        order: ['Docs', 'Foundations', 'Primitives', 'Components', 'Patterns', 'Pages'],
      },
    },

    /* a11y включён на всех историях, а не выборочно: выборочная проверка
       доступности означает, что проверяется только то, что и так в порядке. */
    a11y: {
      test: 'error',
    },

    backgrounds: { disable: true },

    docs: {
      toc: true,
      container: ThemedDocs,
    },
  },
};

export default preview;
