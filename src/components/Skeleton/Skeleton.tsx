import styles from './Skeleton.module.css';

export type SkeletonProps = {
  /**
   * `text` — строка текста, `block` — прямоугольная область (карточка,
   * график), `control` — заготовка поля или кнопки высотой контрола.
   */
  variant?: 'text' | 'block' | 'control';
  /** Сколько строк рисовать. Только для `text`. */
  lines?: number;
  fullWidth?: boolean;
};

/**
 * Заготовка на время загрузки.
 *
 * Показывает форму будущего содержимого: сколько строк, какой ширины блок.
 * Крутящийся спиннер по центру пустого экрана не сообщает ни объёма,
 * ни прогресса, и любое ожидание кажется одинаково долгим.
 *
 * Не использовать для областей, которые останутся пустыми: пустота —
 * это `EmptyState`, и текст там другой.
 */
export function Skeleton({ variant = 'text', lines = 1, fullWidth = false }: SkeletonProps) {
  const className = [styles.skeleton, styles[variant], fullWidth ? styles.fullWidth : null]
    .filter(Boolean)
    .join(' ');

  if (variant !== 'text') {
    return <span className={className} aria-hidden="true" />;
  }

  return (
    <span className={styles.lines} aria-hidden="true">
      {Array.from({ length: lines }, (_, i) => (
        // Последняя строка короче: так заготовка читается как абзац, а не как блок.
        <span key={i} className={[className, i === lines - 1 && lines > 1 ? styles.lastLine : null].filter(Boolean).join(' ')} />
      ))}
    </span>
  );
}
