import { create } from 'storybook/theming/create';
import { palette, fontFamily } from '../src/tokens/primitives';

/**
 * Темы оболочки Storybook, собранные из наших примитивов.
 *
 * Прямой импорт `tokens/primitives` в продуктовом коде запрещён и ловится
 * линтером. Здесь он законен и необходим: оболочка витрины — не продукт,
 * семантических ролей у неё нет (у сайдбара нет роли «поверхность карточки»),
 * но значения обязаны быть теми же. Иначе витрина покрасится в свой синий,
 * похожий на наш, и разница будет читаться как дефект системы.
 *
 * Storybook принимает только готовые цвета, не переменные: его оболочка
 * живёт в отдельном документе и наших CSS-переменных не видит.
 */

const shared = {
  brandTitle: 'Дизайн-система «Уралмаш»',
  brandTarget: '_self',
  fontBase: fontFamily.body,
  fontCode: fontFamily.mono,
  appBorderRadius: 4,
} as const;

export const lightTheme = create({
  ...shared,
  base: 'light',

  appBg: palette.neutral[100],
  appContentBg: palette.white,
  appPreviewBg: palette.white,
  appBorderColor: palette.neutral[400],

  textColor: palette.neutral[1000],
  textMutedColor: palette.neutral[900],
  textInverseColor: palette.white,

  /* Синий, а не акцент системы. В новом языке акцент — это вес: почти
     чёрный на светлой теме. Чёрная подсветка выбранной вкладки в оболочке
     витрины неотличима от текста, поэтому здесь работает та роль синего,
     которую он и получил, — сигнал взаимодействия. */
  colorPrimary: palette.blue[700],
  colorSecondary: palette.blue[700],

  barBg: palette.neutral[100],
  barTextColor: palette.neutral[900],
  barSelectedColor: palette.blue[700],
  barHoverColor: palette.blue[700],

  inputBg: palette.white,
  inputBorder: palette.neutral[400],
  inputTextColor: palette.neutral[1000],
  inputBorderRadius: 6,

  booleanBg: palette.neutral[200],
  booleanSelectedBg: palette.white,
});

export const darkTheme = create({
  ...shared,
  base: 'dark',

  /* Тёмная тема берёт ступени из `neutralDark` — той же лестницы, которую
     подставляет `tokens.css` в тёмном режиме. Прежде здесь стояли сырые
     `#17181a` и `#1d1e20`: оболочка витрины красилась мимо примитивов и
     разъезжалась с превью при каждой правке палитры. */
  appBg: palette.black,
  appContentBg: palette.neutralDark[100],
  appPreviewBg: palette.neutralDark[100],
  appBorderColor: palette.neutralDark[400],

  textColor: palette.neutralDark[1000],
  textMutedColor: palette.neutralDark[800],
  textInverseColor: palette.neutralDark[100],

  colorPrimary: palette.blue[600],
  colorSecondary: palette.blue[600],

  barBg: palette.black,
  barTextColor: palette.neutralDark[800],
  barSelectedColor: palette.blue[600],
  barHoverColor: palette.blue[600],

  inputBg: palette.neutralDark[100],
  inputBorder: palette.neutralDark[400],
  inputTextColor: palette.neutralDark[1000],
  inputBorderRadius: 6,

  booleanBg: palette.neutralDark[300],
  booleanSelectedBg: palette.neutralDark[500],
});
