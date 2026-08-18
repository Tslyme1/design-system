import type { Preview, Decorator } from '@storybook/react-vite';
import { DocsContainer } from '@storybook/addon-docs/blocks';
import type { DocsContainerProps } from '@storybook/addon-docs/blocks';
import { addons } from 'storybook/preview-api';
import { useEffect, useSyncExternalStore, type PropsWithChildren } from 'react';
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
 * мигнуть светлым.
 */
const themeFromUrl = (): ThemeName => {
  const globals = new URLSearchParams(window.location.search).get('globals') ?? '';
  return globals.includes('theme:dark') ? 'dark' : 'light';
};

/**
 * Тема хранится на уровне модуля, а не в состоянии контейнера Docs.
 *
 * В состоянии компонента она не держалась: Storybook пересобирает страницу
 * Docs при смене globals, контейнер монтируется заново и читает тему из
 * адреса — то есть всегда светлую, потому что в адрес iframe globals попадают
 * не всегда. Внешне это выглядело как «переключатель не работает, помогает
 * только F5»: перезагрузка возвращала globals в адрес, и тема бралась оттуда.
 *
 * Модульное состояние живёт столько же, сколько документ превью, и
 * перемонтирование его не трогает.
 */
let currentTheme: ThemeName = themeFromUrl();
const themeListeners = new Set<() => void>();

const setTheme = (next: ThemeName) => {
  if (next === currentTheme) return;
  currentTheme = next;
  document.documentElement.setAttribute('data-theme', next);
  themeListeners.forEach((notify) => notify());
};

document.documentElement.setAttribute('data-theme', currentTheme);

/**
 * Подписка через `ready()`, а не `getChannel()`.
 *
 * Пока канал не создан, `getChannel()` молча возвращает заглушку `mockChannel`
 * — без ошибки и без предупреждения. Подписка на неё не срабатывает никогда,
 * и это вторая половина того же дефекта, что был в `manager.ts`.
 *
 * Слушаем оба события: `setGlobals` приходит на старте превью,
 * `globalsUpdated` — на каждое переключение в тулбаре.
 */
void addons.ready().then((channel) => {
  const handle = ({ globals }: { globals?: Record<string, unknown> }) => {
    const next = globals?.theme;
    if (next === 'light' || next === 'dark') setTheme(next);
  };

  channel.on('setGlobals', handle);
  channel.on('globalsUpdated', handle);
});

const subscribeTheme = (notify: () => void) => {
  themeListeners.add(notify);
  return () => {
    themeListeners.delete(notify);
  };
};

const useThemeName = (): ThemeName => useSyncExternalStore(subscribeTheme, () => currentTheme);

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

  /**
   * Контролы для пропов, объявленных как `ReactNode`.
   *
   * Тип контрола Storybook выводит из типа пропа, а `ReactNode` для него —
   * объект: в панели появляется редактор JSON, и первое же обращение к нему
   * подставляет пустой `{}`. React такой объект отрисовать не может, история
   * падает с «Objects are not valid as a React child», хотя в коде компонента
   * ошибки нет — падает витрина, а выглядит как дефект компонента.
   *
   * Поэтому: пропам, куда в жизни приходит текст, — текстовый контрол; слотам,
   * куда приходит разметка, контрол выключен. Разметку в поле ввода всё равно
   * не набрать, а выключенный контрол честно говорит, что значение задаётся
   * в коде истории.
   *
   * Список глобальный, а не покомпонентный, потому что ошибка общая: она
   * повторится у каждого следующего компонента с подписью или пояснением.
   */
  argTypes: {
    label: { control: 'text' },
    description: { control: 'text' },
    hint: { control: 'text' },
    error: { control: 'text' },
    title: { control: 'text' },
    caption: { control: 'text' },
    content: { control: 'text' },
    meta: { control: 'text' },
    placeholder: { control: 'text' },
    children: { control: 'text' },

    action: { control: false },
    footer: { control: false },
    aside: { control: false },
    trigger: { control: false },
    empty: { control: false },
  },

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
