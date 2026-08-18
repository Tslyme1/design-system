/**
 * Публичный вход в токены.
 *
 * Наружу отдаётся ТОЛЬКО семантика. Примитивы намеренно не реэкспортируются:
 * компонент, которому понадобился `palette.accent[500]`, обходит систему,
 * и это должно быть видно как ошибка импорта, а не как деталь стиля.
 *
 * Если роли не хватает — она добавляется в semantic.ts, а не берётся из примитивов.
 */

export {
  color,
  spacing,
  cornerRadius,
  textVariant,
  control,
  appChrome,
  modal,
  elevation,
  stroke,
  motionDuration,
  motionCycle,
  motionEasing,
  layer,
  spaceVar,
  radiusVar,
} from './semantic';

export type {
  SpaceToken,
  RadiusToken,
  ColorToken,
  TextVariantToken,
  ControlSizeToken,
  ElevationToken,
  ModalWidthToken,
  TagColorToken,
  TextColorToken,
  SurfaceColorToken,
} from './semantic';
