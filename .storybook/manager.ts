import { addons } from 'storybook/manager-api';
import { lightTheme, darkTheme } from './theme';
import './manager.css';

type ThemeName = 'light' | 'dark';

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
 *    Вопреки прежнему комментарию здесь, в рантайме это поддерживается:
 *    `setConfig` шлёт событие `setConfig`, оболочка ловит его и вызывает
 *    `setOptions`, а тот кладёт новую тему в состояние.
 * 2. `data-theme` на корне документа оболочки включает наши переменные из
 *    `tokens.css`, которыми в `manager.css` докрашено то, до чего первый
 *    механизм не дотягивается: фон документа за панелями и полосы прокрутки.
 */
const applyTheme = (name: ThemeName) => {
  addons.setConfig({ theme: name === 'dark' ? darkTheme : lightTheme });
  document.documentElement.setAttribute('data-theme', name);
};

/**
 * Стартовая тема берётся из адреса, а не задаётся светлой.
 *
 * Storybook хранит выбранные globals в ссылке (`?globals=theme:dark`), и по
 * ней страница открывается после перезагрузки или из закладки.
 */
const themeFromUrl = (): ThemeName => {
  const globals = new URLSearchParams(window.location.search).get('globals') ?? '';
  return globals.includes('theme:dark') ? 'dark' : 'light';
};

applyTheme(themeFromUrl());

/**
 * Подписка на переключатель — внутри `register`, а не на верхнем уровне модуля.
 *
 * Это и был дефект, из-за которого тема применялась только после F5. На момент
 * выполнения `manager.ts` канала ещё нет, и `addons.getChannel()` в этот момент
 * возвращает не канал, а заглушку (`mockChannel`) — молча, без ошибки. Подписка
 * уходила в неё и не срабатывала никогда; работала только строка выше, читающая
 * адрес при загрузке. Отсюда и складывалось впечатление, что «локально всё
 * хорошо»: в открытой вкладке адрес уже содержал `globals=theme:dark`, а на
 * чистом адресе витрины взяться ему было неоткуда.
 *
 * `register` вызывается после того, как оболочка создала канал, поэтому здесь
 * `getChannel()` отдаёт настоящий.
 */
addons.register('uztm/theme-sync', () => {
  addons.getChannel().on('globalsUpdated', ({ globals }: { globals?: Record<string, unknown> }) => {
    const next = globals?.theme;
    if (next === 'light' || next === 'dark') applyTheme(next);
  });
});
