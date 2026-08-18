import type { ReactNode } from 'react';
import { createContext, useContext } from 'react';

/**
 * Узел, в который всплывающие слои рисуют себя вместо `body`.
 *
 * Поповер и подсказка уходят в портал — иначе их режет любой предок
 * с прокруткой. Но портал в конец документа выносит панель из стека
 * того, что её породило: у модалки `z-index: var(--z-modal)`, у панели
 * `var(--z-overlay)`, и список `Select`, открытый в модалке, честно
 * уходил под неё.
 *
 * Поднимать панель выше модалки числом нельзя: тогда она перекроет и ту
 * модалку, из которой её не открывали, — а вложенность бывает любой.
 * Поэтому слой не спорит за число, а въезжает внутрь: модалка и панель
 * отдают свой узел, и поповер попадает в их стек, где сравнивать не с чем.
 *
 * `null` — обычный случай: рисовать в `body`.
 */
const LayerRootContext = createContext<HTMLElement | null>(null);

export function LayerRootProvider({ node, children }: { node: HTMLElement | null; children: ReactNode }) {
  return <LayerRootContext.Provider value={node}>{children}</LayerRootContext.Provider>;
}

/** Узел для портала или `null`, если слой рисуется в `body`. */
export function useLayerRoot() {
  return useContext(LayerRootContext);
}
