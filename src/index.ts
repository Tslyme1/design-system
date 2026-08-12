/**
 * Публичный вход дизайн-системы «Уралмаш».
 *
 * Потребляющее приложение импортирует только отсюда.
 *
 * Стили подключаются один раз, до собственных стилей приложения:
 * `import '@uralmash/design-system/styles.css'` — токены и компоненты вместе.
 * Отдельный `/tokens.css` нужен, только если берутся переменные тем без
 * компонентов.
 */

import './tokens/tokens.css';

export * from './tokens';
export * from './primitives';
export * from './components';
