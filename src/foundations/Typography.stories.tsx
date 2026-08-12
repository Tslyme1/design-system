import type { Meta, StoryObj } from '@storybook/react-vite';
import { Fragment } from 'react';
import { Stack, Text, Box } from '@/primitives';
import { textVariant } from '@/tokens';
import type { TextVariantToken } from '@/tokens';
import { longText } from '@fixtures';
import styles from './Foundations.module.css';

const meta: Meta = {
  title: 'Foundations/Typography',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'Роль = тройка «размер + интерлиньяж + насыщенность». Отдельных шкал кегля и интерлиньяжа нет намеренно: в аудите они собирались заново в каждом месте и дали 18 кеглей и 8 интерлиньяжей.',
          'Роль выбирается по смыслу, а не по размеру. «Тут нужно покрупнее» — это вопрос к шкале, а не к месту применения.',
        ].join('\n\n'),
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/** Назначение роли. Именно оно, а не «24px bold», определяет выбор. */
const PURPOSE: Record<TextVariantToken, string> = {
  headingLg: 'Заголовок страницы. Не больше одного на экран',
  headingMd: 'Заголовок секции',
  headingSm: 'Заголовок карточки, заголовок модалки',
  bodyLg: 'Вводный текст, описания в модалках',
  body: 'Основной текст форм',
  bodySm: 'Плотные области: таблицы, меню, теги',
  label: 'Подпись поля, заголовок группы в меню',
  caption: 'Служебная подпись, единицы измерения',
};

const ORDER: TextVariantToken[] = ['headingLg', 'headingMd', 'headingSm', 'bodyLg', 'body', 'bodySm', 'label', 'caption'];

export const Playground: Story = {
  render: () => (
    <Stack gap="xl">
      <div className={styles.tokenGrid}>
        {ORDER.map((token) => (
          <Fragment key={token}>
            <span className={styles.mono}>{token}</span>
            <Text variant={token}>{PURPOSE[token]}</Text>
            <span className={styles.mono}>
              {textVariant[token].fontSize} / {textVariant[token].lineHeight} / {textVariant[token].fontWeight}
            </span>
          </Fragment>
        ))}
      </div>

      <Box padding="lg" border background="surfaceSunken">
        <Stack gap="sm">
          <Text variant="label">Две роли на одном значении</Text>
          <Text variant="bodySm">
            <span className={styles.mono}>caption</span> и <span className={styles.mono}>bodySm</span> совпадают: 12 /
            1.4 / 400. Это решение автора — размер один, начертания оставляем. В коде обе роли ссылаются на одну
            тройку, поэтому разойтись не могут: правка размера меняет обе сразу.
          </Text>
          <Text variant="bodySm" color="textMuted">
            То же по кеглю у bodyLg и headingSm (оба 16), но там различие настоящее: Barlow 400 против Barlow
            Condensed 600.
          </Text>
        </Stack>
      </Box>
    </Stack>
  ),
};

/** Все роли на реальном тексте: короткая строка не показывает интерлиньяж. */
export const Variants: Story = {
  render: () => (
    <Stack gap="lg">
      {ORDER.map((token) => (
        <Stack key={token} gap="2xs">
          <span className={styles.mono}>{token}</span>
          <Text variant={token}>{longText}</Text>
        </Stack>
      ))}
    </Stack>
  ),
};

/** Гарнитуры переключаются ролью, а не `font-family` вручную. */
export const Families: Story = {
  render: () => (
    <Stack gap="lg">
      <Stack gap="2xs">
        <Text variant="caption" color="textMuted">
          Barlow Condensed — заголовки
        </Text>
        <Text variant="headingMd">Расчёт дробилки КМД-1750Т7-Д</Text>
      </Stack>
      <Stack gap="2xs">
        <Text variant="caption" color="textMuted">
          Barlow — текст
        </Text>
        <Text variant="body">Расчёт дробилки КМД-1750Т7-Д</Text>
      </Stack>
    </Stack>
  ),
};

/** Обрезка длинной строки — единственный разрешённый способ её укоротить. */
export const Content: Story = {
  render: () => (
    <Stack gap="lg">
      <Box padding="md" border>
        <Text variant="body" truncate>
          {longText}
        </Text>
      </Box>
      <Text variant="bodySm" color="textMuted">
        Обрезка уместна там, где строка обязана быть одной: ячейка таблицы, пункт меню. В остальных местах текст
        переносится — фиксированная высота блоку с текстом запрещена.
      </Text>
    </Stack>
  ),
};
