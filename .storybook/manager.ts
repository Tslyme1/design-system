import { addons } from 'storybook/manager-api';
import { lightTheme, darkTheme } from './theme';
import './manager.css';

/**
 * Тема оболочки следует за темой историй.
 *
 * Оболочка Storybook живёт в отдельном документе и про `data-theme` внутри
 * канваса не знает: светлый сайдбар оставался светлым рядом с тёмным
 * компонентом. Сравнивать тёмную тему в таком окружении невозможно — глаз
 * подстраивается под самый яркий кусок экрана, а им оказывался интерфейс
 * витрины.
 *
 * Работают два механизма сразу, и это не перестраховка:
 *
 * 1. `setConfig` меняет тему самого Storybook — сайдбар, тулбар, панели.
 *    Runtime-переключение темы им официально не поддерживается, поэтому
 *    одного его мало.
 * 2. `data-theme` на корне документа оболочки включает наши переменные из
 *    `tokens.css`, которыми в `manager.css` докрашено то, до чего первый
 *    механизм не дотягивается.
 */
const applyTheme = (name: 'light' | 'dark') => {
  addons.setConfig({ theme: name === 'dark' ? darkTheme : lightTheme });
  document.documentElement.setAttribute('data-theme', name);
};

/**
 * Стартовая тема берётся из адреса, а не задаётся светлой.
 *
 * Storybook хранит выбранные globals в ссылке (`?globals=theme:dark`), и по
 * ней страница открывается после перезагрузки или из закладки. Пока здесь
 * стояло `applyTheme('light')`, оболочка каждый раз собиралась светлой, и
 * тёмной её делал только рантайм-вызов — а он перерисовывает не всё. Части
 * интерфейса так и оставались светлыми, и это чинилось только сменой темы
 * туда-обратно вручную.
 */
const themeFromUrl = (): 'light' | 'dark' => {
  const globals = new URLSearchParams(window.location.search).get('globals') ?? '';
  return globals.includes('theme:dark') ? 'dark' : 'light';
};

applyTheme(themeFromUrl());

addons.getChannel().on('globalsUpdated', ({ globals }: { globals: Record<string, unknown> }) => {
  const next = globals.theme;
  if (next === 'light' || next === 'dark') applyTheme(next);
});
