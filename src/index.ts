/**
 * Публичный вход дизайн-системы «Уралмаш».
 *
 * Потребляющее приложение импортирует только отсюда.
 * Стили подключаются один раз: `import '@uralmash/design-system/tokens.css'`.
 */

import './tokens/tokens.css';

export * from './tokens';
export * from './primitives';
export * from './components';
