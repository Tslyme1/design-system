import type { ReactNode, ButtonHTMLAttributes } from 'react';
import { Icon, Text } from '../../primitives';
import type { IconName } from '../../primitives';
import styles from './AppHeader.module.css';

export type AppHeaderProps = {
  children: ReactNode;
};

export type HeaderSideProps = {
  children: ReactNode;
};

/**
 * Левая часть полосы. Прижата к левому краю.
 *
 * Содержимое произвольное: знак, любые ячейки, хайрлайны между ними.
 * Часть — это сторона полосы, а не роль: система не решает за экран,
 * что именно стоит слева.
 */
function HeaderLeft({ children }: HeaderSideProps) {
  return <div className={`${styles.side} ${styles.left}`}>{children}</div>;
}

/** Правая часть полосы. Прижата к правому краю. */
function HeaderRight({ children }: HeaderSideProps) {
  return <div className={`${styles.side} ${styles.right}`}>{children}</div>;
}

/**
 * Полоса шапки сервиса.
 *
 * Живёт на собственной шкале `chrome` (высота 44), а не на шкале контролов:
 * её элементы тянутся на всю высоту полосы, имеют нулевой радиус
 * и разделяются хайрлайнами, а не отступами. Мерить их как кнопки формы
 * нельзя — это разные сущности.
 *
 * Устроена как две части — `AppHeader.Left` и `AppHeader.Right`. Обе принимают
 * любые ячейки: разделение здесь про сторону полосы, а не про назначение.
 * Раньше правая часть держалась на `HeaderSpacer` — распорке посреди плоского
 * списка детей. Из такой записи не видно, где кончается одна группа
 * и начинается другая: забытая распорка сваливала управление окном к центру,
 * а вторая случайно разбивала правую группу пополам. Явные части нельзя
 * забыть и нельзя поставить дважды.
 */
export function AppHeader({ children }: AppHeaderProps) {
  return <header className={styles.header}>{children}</header>;
}

AppHeader.Left = HeaderLeft;
AppHeader.Right = HeaderRight;

export type HeaderLogoProps = {
  /**
   * Знак: строка-логотип, `svg` или `img`. Строка выводится ролью `label`.
   * Сам знак система не хранит — бренд приходит снаружи, иначе библиотека
   * станет непереносимой между сервисами.
   */
  children: ReactNode;
  /** Название для читалки экрана. Обязательно, когда знак графический. */
  label?: string;
};

/**
 * Знак сервиса в шапке. Неинтерактивен намеренно.
 *
 * Это не кнопка и не ссылка: у него нет ни `hover`, ни фокуса, ни курсора-руки —
 * нажимать не на что. Логотип, который выглядит нажимаемым и ничего не делает,
 * обманывает; если из шапки нужен переход на главную, для этого стоит отдельная
 * ячейка `HeaderButton icon="home"` с подписью.
 */
export function HeaderLogo({ children, label }: HeaderLogoProps) {
  return (
    <span className={styles.logo} role={label ? 'img' : undefined} aria-label={label}>
      {typeof children === 'string' ? <Text variant="label">{children}</Text> : children}
    </span>
  );
}

type NativeButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'style' | 'children'>;

export type HeaderButtonProps = NativeButtonProps & {
  /** Иконка. Для кнопки без подписи — единственное содержимое. */
  icon?: IconName;
  /** Подпись. Без неё кнопка становится квадратной ячейкой 44×44. */
  children?: ReactNode;
  /**
   * Активная вкладка. Ячейка сливается с содержимым под шапкой:
   * заливается цветом поверхности и перекрывает нижнюю границу полосы.
   */
  active?: boolean;
  /** Раскрывающая кнопка — добавляет шеврон справа. */
  expandable?: boolean;
  /**
   * Кнопки управления окном: свернуть, развернуть, закрыть.
   * Иконку подставляет сама роль — называть её в месте употребления не нужно.
   * `close` дополнительно краснеет при наведении.
   */
  chrome?: ChromeAction;
};

type ChromeAction = 'minimize' | 'maximize' | 'close';

/**
 * Иконка кнопки управления окном выводится из роли, а не называется на месте.
 *
 * Раньше `chrome` задавал только оформление, а иконку писали рядом руками —
 * и ячейки оставались пустыми везде, где про это забыли: три квадрата 44×44
 * без содержимого в правом углу шапки. Заодно ничто не мешало написать
 * `chrome="close"` с иконкой `check`: из цвета и формы читатель верит форме,
 * поэтому такая пара сообщала бы обратное действие. Набор закрыт здесь.
 */
const chromeIcons: Record<ChromeAction, IconName> = {
  minimize: 'minimize',
  maximize: 'maximize',
  close: 'x',
};

/**
 * Кнопка в шапке сервиса.
 *
 * Отличается от `Button` не оформлением, а природой: у неё нет
 * собственной высоты и отступов — она заполняет полосу целиком.
 * Поэтому это отдельный компонент, а не вариант кнопки: попытка
 * выразить их одним компонентом даёт проп вроде `variant="header"`,
 * который отменяет половину остальных пропов.
 */
export function HeaderButton({ icon, children, active = false, expandable = false, chrome, ...rest }: HeaderButtonProps) {
  const hasLabel = children !== undefined;
  const resolvedIcon = icon ?? (chrome ? chromeIcons[chrome] : undefined);

  const className = [
    styles.cell,
    hasLabel ? styles.withLabel : styles.iconOnly,
    active ? styles.active : null,
    chrome === 'close' ? styles.close : null,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button {...rest} type="button" className={className} aria-current={active ? 'page' : undefined}>
      {resolvedIcon ? <Icon name={resolvedIcon} size="md" /> : null}
      {hasLabel ? <span className={styles.label}>{children}</span> : null}
      {expandable ? <Icon name="chevronDown" size="sm" /> : null}
    </button>
  );
}

/** Вертикальный хайрлайн между ячейками шапки. */
export function HeaderDivider() {
  return <span className={styles.divider} aria-hidden="true" />;
}

/**
 * Распорка, отжимающая последующие ячейки к правому краю.
 *
 * @deprecated Замена — `AppHeader.Right`. Распорка выражает границу групп
 * пустотой посреди плоского списка: её можно забыть и можно поставить дважды,
 * и в обоих случаях шапка разъезжается молча. Части полосы заданы явно.
 */
export function HeaderSpacer() {
  return <span className={styles.spacer} />;
}
