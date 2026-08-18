import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stack, Text, Icon } from '@/primitives';
import type { IconName } from '@/primitives';
import { icons } from '@/primitives/icons';
import styles from './Foundations.module.css';

const meta: Meta = {
  title: 'Foundations/Iconography',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'Lucide, обводка 1.5, сетка 24×24. Набор **закрыт**: добавление иконки — такое же расширение системы, как добавление токена, и требует согласия.',
          'Иконка наследует `currentColor` от родителя и не имеет собственного цвета. Иконка без текстовой подписи обязана получить `label` — иначе она не существует для скринридера.',
        ].join('\n\n'),
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const NAMES = Object.keys(icons) as IconName[];

export const Playground: Story = {
  render: () => (
    <Stack gap="lg">
      <Text variant="bodySm" color="textMuted">
        {NAMES.length} иконок. Взяты те, что реально используются в приложении. Последняя, `placeholder`, — служебная:
        она стоит в примерах витрины там, где иконка показывает возможность компонента, а не конкретное действие.
        В приложении её быть не должно.
      </Text>
      <div className={styles.iconGrid}>
        {NAMES.map((name) => (
          <div key={name} className={styles.iconTile}>
            <Icon name={name} size="md" />
            <span className={styles.mono}>{name}</span>
          </div>
        ))}
      </div>
    </Stack>
  ),
};

/** Три размера. Больше не нужно: иконка живёт рядом с текстом или в контроле. */
export const Sizes: Story = {
  render: () => (
    <Stack direction="row" gap="xl" align="center">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Stack key={size} gap="2xs" align="center">
          <Icon name="placeholder" size={size} />
          <span className={styles.mono}>{size}</span>
        </Stack>
      ))}
    </Stack>
  ),
};
