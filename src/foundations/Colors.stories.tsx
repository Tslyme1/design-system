import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useRef, useState } from 'react';
import { Stack, Text, Box } from '@/primitives';
import { color } from '@/tokens';
import type { ColorToken } from '@/tokens';
import styles from './Foundations.module.css';

/**
 * Страница рендерится из самих токенов: захардкоженная таблица цветов
 * расходится с кодом в первую же неделю. Контраст считается в браузере
 * по фактически применённому значению, поэтому цифры верны в обеих темах.
 */
const meta: Meta = {
  title: 'Foundations/Colors',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'Только семантические роли. Лестницы 100–900 живут в примитивах и компонентам недоступны.',
          'Роль отвечает на вопрос «зачем», а не «как выглядит»: `textMuted` — можно, `gray-light` — нельзя, при смене темы такое имя начнёт врать.',
        ].join('\n\n'),
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/** Когда применять роль. Текст один в один из tokens/README.md. */
const PURPOSE: Partial<Record<ColorToken, string>> = {
  bg: 'Фон страницы, самый нижний слой',
  surface: 'Карточка, поле, панель — на слой выше фона',
  surfaceRaised: 'Меню поверх карточки, модалка',
  surfaceSunken: 'Заголовок таблицы, полоса шапки, фон disabled',
  text: 'Основной текст',
  textMuted: 'Подписи, единицы, прочерк «—»',
  textDisabled: 'Потерявшее активность. Не для второстепенного',
  textOnAccent: 'Текст на акцентной заливке',
  border: 'Хайрлайн: рамки, разделители, границы полей',
  borderHover: 'Граница при наведении',
  borderStrong: 'Активный или сфокусированный контрол',
  accent: 'Основное действие, активное состояние, фокус',
  accentSubtle: 'Выделенная строка, активный сегмент',
  accentText: 'Акцентный текст на светлом фоне',
  danger: 'Потеря данных или ошибка',
  dangerText: 'Текст ошибки',
  success: 'Успешное завершение',
  warning: 'Предупреждение',
  overlay: 'Затемнение под модалкой',
  focusRing: 'Кольцо фокуса. Одно на весь проект',
};

/** Роли, которые применяются как цвет текста, — для них считается контраст. */
const TEXT_ROLES: ColorToken[] = ['text', 'textMuted', 'textDisabled', 'accentText', 'dangerText', 'successText', 'warningText'];

function channels(value: string): [number, number, number] {
  const nums = value.match(/[\d.]+/g);
  if (!nums || nums.length < 3) return [0, 0, 0];
  return [Number(nums[0]), Number(nums[1]), Number(nums[2])];
}

function luminance([r, g, b]: [number, number, number]) {
  const srgb = [r, g, b].map((c) => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
}

function contrast(a: string, b: string) {
  const [l1, l2] = [luminance(channels(a)), luminance(channels(b))];
  const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
}

/** Строка таблицы: образец, имя роли, назначение, значение и контраст. */
function ColorRow({ token }: { token: ColorToken }) {
  const ref = useRef<HTMLDivElement>(null);
  const [ratio, setRatio] = useState<number | null>(null);

  useEffect(() => {
    if (!ref.current || !TEXT_ROLES.includes(token)) return;
    const own = getComputedStyle(ref.current).backgroundColor;
    const page = getComputedStyle(document.body).backgroundColor;
    setRatio(contrast(own, page));
  }, [token]);

  return (
    <>
      {/* Значение приходит из токена: страница не знает, какой это цвет. */}
      <div ref={ref} className={styles.swatch} style={{ ['--sample' as string]: color[token] }} />
      <Stack gap="2xs">
        <Text variant="label">{token}</Text>
        <Text variant="caption" color="textMuted">
          {PURPOSE[token] ?? '—'}
        </Text>
      </Stack>
      <Text variant="caption" color="textMuted">
        <span className={styles.mono}>
          {ratio === null ? color[token] : `${ratio.toFixed(1)}:1 к фону`}
        </span>
      </Text>
    </>
  );
}

const GROUPS: { title: string; note: string; tokens: ColorToken[] }[] = [
  {
    title: 'Поверхности',
    note: 'Снизу вверх: фон страницы → карточка → то, что лежит поверх карточки.',
    tokens: ['bg', 'surface', 'surfaceRaised', 'surfaceSunken'],
  },
  {
    title: 'Текст',
    note: 'Контраст считается к фону страницы в текущей теме. Минимум для текста — 4.5:1.',
    tokens: ['text', 'textMuted', 'textDisabled', 'textOnAccent'],
  },
  {
    title: 'Границы',
    note: 'Хайрлайн — основной язык системы: линия вместо тени и заливки.',
    tokens: ['border', 'borderHover', 'borderStrong'],
  },
  {
    title: 'Акцент',
    note: 'accent к фону даёт около 3:1 — этого хватает иконкам и контролам, но не тексту. Для текста есть accentText.',
    tokens: ['accent', 'accentHover', 'accentActive', 'accentSubtle', 'accentText'],
  },
  {
    title: 'Статусы',
    note: 'Красный означает потерю данных или ошибку. Декоративное применение обесценивает сигнал.',
    tokens: ['danger', 'dangerHover', 'dangerSubtle', 'dangerText', 'success', 'successSubtle', 'successText', 'warning', 'warningSubtle', 'warningText'],
  },
  {
    title: 'Служебные',
    note: 'Затемнение и кольцо фокуса. Кольцо одно на весь проект — по нему видно, где фокус, не глядя на компонент.',
    tokens: ['overlay', 'focusRing'],
  },
];

export const Playground: Story = {
  render: () => (
    <Stack gap="2xl">
      {GROUPS.map((group) => (
        <Stack key={group.title} gap="md">
          <Text variant="headingSm">{group.title}</Text>
          <Text variant="bodySm" color="textMuted">
            {group.note}
          </Text>
          <div className={styles.tokenGrid}>
            {group.tokens.map((token) => (
              <ColorRow key={token} token={token} />
            ))}
          </div>
        </Stack>
      ))}
    </Stack>
  ),
};

/**
 * Примитивы показаны отдельно и помечены явно: лестницы 100–900
 * существуют, но в компонентах недоступны — импорт из них ловит линтер.
 */
export const Primitives: Story = {
  render: () => (
    <Box padding="lg" border background="warningSubtle">
      <Stack gap="sm">
        <Text variant="headingSm">Лестницы 100–900 — не для применения</Text>
        <Text variant="bodySm">
          Они живут в <span className={styles.mono}>tokens/primitives.ts</span> и построены в OKLCH на общей шкале
          светлоты. Компонент, которому понадобилась ступень лестницы, обходит систему: у него нет роли, есть только
          нужный оттенок. Прямой импорт примитивов ловит <span className={styles.mono}>ds:lint</span>.
        </Text>
        <Text variant="bodySm" color="textMuted">
          Если роли не хватает — она добавляется в semantic.ts, а не берётся из примитивов.
        </Text>
      </Stack>
    </Box>
  ),
};
