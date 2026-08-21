import type { ReactNode } from 'react';
import {
  useFloating,
  useDismiss,
  useInteractions,
  autoUpdate,
  offset,
  flip,
  shift,
  limitShift,
  size,
  FloatingPortal,
  FloatingFocusManager,
  FloatingTree,
  FloatingNode,
  useFloatingNodeId,
  useFloatingParentNodeId,
} from '@floating-ui/react';
import { motionDuration, spacing } from '../../tokens';
import { usePresence } from '../usePresence';
import { useLayerRoot } from '../LayerRoot';
import styles from './Popover.module.css';

export type PopoverPlacement = 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';

export type PopoverProps = {
  open: boolean;
  onClose: () => void;
  /**
   * Элемент, у которого раскрывается панель. Рендерится всегда,
   * панель позиционируется относительно него.
   */
  trigger: ReactNode;
  children: ReactNode;
  placement?: PopoverPlacement;
  /** Ширина панели. `auto` — по содержимому, но не уже триггера. */
  width?: 'auto' | 'trigger' | 'sm' | 'md';
  /** Заголовок панели с разделителем под ним. */
  title?: string;
  /** Закреплённая нижняя строка: «+ Добавить», «Сбросить». */
  footer?: ReactNode;
  /**
   * Обёртка занимает всю ширину родителя. Нужна, когда триггер обязан
   * растянуться — например, поле формы: обёртка по умолчанию `inline-flex`
   * и сжимается по содержимому, а `width: 100%` на самом триггере считается
   * от этой сжатой ширины и ничего не даёт.
   */
  fullWidth?: boolean;
};

const widthClass = {
  auto: undefined,
  trigger: 'widthTrigger',
  sm: 'widthSm',
  md: 'widthMd',
} as const;

/** Зазор между триггером и панелью. Значение приходит из шкалы, а не из головы. */
const GAP = Number.parseFloat(spacing.xs);
/** Зазор между панелью и кромкой окна: вплотную к краю панель читается как обрезанная. */
const EDGE = Number.parseFloat(spacing.sm);

/**
 * Всплывающая панель у элемента.
 *
 * Закрывает три случая, которые в аудите были написаны отдельно каждый раз:
 * панель фильтров, выбор режима работы и меню действий над диаграммой.
 * Везде повторялась одна и та же конструкция — `card elev-md` в абсолютной
 * позиции плюс невидимая подложка на весь экран для перехвата клика,
 * причём `z-index` подбирался вручную: 240, 250, 251, 255, 256.
 *
 * Закрытие по Esc и клику снаружи, возврат фокуса на триггер — здесь,
 * а не в вызывающем коде.
 *
 * Размещение считает floating-ui: панель переворачивается, сдвигается и
 * подрезается так, чтобы остаться в видимой области. Панель рисуется в
 * портале и позиционируется от вьюпорта — иначе её режет любой предок
 * с прокруткой задолго до кромки окна.
 *
 * Не использовать для модальных решений: поповер не блокирует интерфейс
 * и закрывается случайным кликом. Если ответ обязателен — это `Modal`.
 *
 * Поповеры складываются в дерево слоёв. Панель лежит в портале, то есть вне
 * DOM-поддерева своего поповера, и без дерева нажатие внутри вложенной панели
 * читается внешним поповером как «клик снаружи»: открываешь выбор цвета
 * внутри меню — и меню закрывается вместе с ним. Корневой поповер заводит
 * дерево, вложенный подключается к уже готовому, и `useDismiss` перестаёт
 * считать своих детей чужими.
 */
export function Popover(props: PopoverProps) {
  const parentId = useFloatingParentNodeId();

  if (parentId === null) {
    return (
      <FloatingTree>
        <PopoverLayer {...props} />
      </FloatingTree>
    );
  }

  return <PopoverLayer {...props} />;
}

function PopoverLayer({
  open,
  onClose,
  trigger,
  children,
  placement = 'bottom-start',
  width = 'auto',
  title,
  footer,
  fullWidth = false,
}: PopoverProps) {
  /** Место поповера в дереве слоёв: по нему `useDismiss` отличает своих детей от чужих. */
  const nodeId = useFloatingNodeId();

  // Панель схлопывается к триггеру, а не исчезает в кадре: у поповера
  // закрытие происходит чаще открытия — по клику снаружи, по Esc, по выбору
  // пункта, — и именно оно определяет, аккуратен слой или нет.
  const { mounted, exiting } = usePresence(open, motionDuration.fast);

  /**
   * Корень портала. По умолчанию `body`, но внутри модалки или выдвижной
   * панели — их собственный узел: иначе панель уходит из их стека и
   * рисуется под ними. См. `LayerRoot`.
   */
  const layerRoot = useLayerRoot();

  const {
    refs,
    floatingStyles,
    context,
    placement: actualPlacement,
  } = useFloating({
    nodeId,
    open,
    onOpenChange: (next) => {
      if (!next) onClose();
    },
    placement,
    /**
     * `fixed`, а не `absolute`: панель обязана считаться от вьюпорта.
     * При `absolute` её координаты зависели бы от ближайшего позиционированного
     * предка, а он у прокручиваемой колонки как раз и есть.
     */
    strategy: 'fixed',
    /**
     * Позиционирование через `top`/`left`, а не через `transform`: `transform`
     * занят анимацией появления и ухода, и одно затирало бы другое.
     */
    transform: false,
    middleware: [
      offset(GAP),
      // Переворот. Если не помещается ни сверху, ни снизу, floating-ui сам
      // берёт сторону с бо́льшим запасом (`fallbackStrategy: 'bestFit'`).
      flip({ padding: EDGE }),
      // Сдвиг вдоль оси. `limitShift` не даёт панели оторваться от триггера
      // и повиснуть рядом с ним, когда сдвигать уже нечего.
      shift({ padding: EDGE, limiter: limitShift() }),
      size({
        padding: EDGE,
        apply({ availableHeight, rects, elements }) {
          // Потолок высоты и ширина триггера уезжают в CSS переменными:
          // вторая половина правила — `min(320px, …)` и `min-width` — живёт там.
          elements.floating.style.setProperty('--layer-max-height', `${availableHeight}px`);
          elements.floating.style.setProperty('--layer-trigger-width', `${rects.reference.width}px`);
        },
      }),
    ],
    // Пересчёт на прокрутке предков, ресайзе окна и изменении размеров
    // панели или триггера. Панель прибита к вьюпорту и сама за содержимым
    // не поедет — без этого она отстала бы от триггера на первой прокрутке.
    whileElementsMounted: autoUpdate,
  });

  // pointerdown, а не click: иначе панель успевает закрыться раньше,
  // чем сработает обработчик внутри неё.
  const dismiss = useDismiss(context, { outsidePressEvent: 'pointerdown' });
  /**
   * `useRole` не подключён намеренно: он вешает `aria-haspopup` и
   * `aria-expanded` на опорный элемент, а опорный здесь — обёртка-div, которая
   * ничего не нажимает. Роль объявляет сама панель, а `aria-haspopup` ставит
   * триггер — так, как это делает `Select`.
   */
  const { getReferenceProps, getFloatingProps } = useInteractions([dismiss]);

  const cls = widthClass[width];

  return (
    <div
      className={[styles.wrapper, fullWidth ? styles.fullWidth : null].filter(Boolean).join(' ')}
      /* Опорный элемент — обёртка, а не сам триггер: `trigger` приходит как
         `ReactNode`, ref в него не воткнуть, не потребовав от каждого
         вызывающего пробрасывать ref. Обёртка обтягивает триггер,
         поэтому геометрия та же. */
      ref={refs.setReference}
      {...getReferenceProps()}
    >
      {trigger}

      {mounted ? (
        <FloatingNode id={nodeId}>
          <FloatingPortal root={layerRoot ?? undefined}>
            {/*
              Панель лежит в портале, то есть в конце документа, а обход по Tab
              идёт по порядку в DOM. Менеджер фокуса ставит вокруг панели
              метки-ловушки и возвращает обход на место: Tab с триггера ведёт
              в панель, а не в конец страницы.

              `modal={false}` — поповер не блокирует интерфейс, фокус в нём
              не запирается. `initialFocus={-1}` — фокус не переносится в панель
              сам: у `Select` внутрь ведёт поле поиска, у меню — первый пункт,
              и решать это должен вызывающий, а не слой.
            */}
            <FloatingFocusManager context={context} modal={false} initialFocus={-1}>
              <div
                ref={refs.setFloating}
                className={[
                  styles.panel,
                  // Класс только для стороны «вверх»: он нужен ровно затем,
                  // чтобы развернуть анимацию ухода. Пустого парного класса
                  // в CSS нет, поэтому и обращения к нему нет.
                  actualPlacement.startsWith('top') ? styles.sideTop : null,
                  cls ? styles[cls] : null,
                  exiting ? styles.exiting : null,
                ]
                  .filter(Boolean)
                  .join(' ')}
                style={floatingStyles}
                role="dialog"
                {...getFloatingProps()}
              >
                {title ? <div className={styles.title}>{title}</div> : null}
                <div className={styles.content}>{children}</div>
                {footer ? <div className={styles.footer}>{footer}</div> : null}
              </div>
            </FloatingFocusManager>
          </FloatingPortal>
        </FloatingNode>
      ) : null}
    </div>
  );
}
