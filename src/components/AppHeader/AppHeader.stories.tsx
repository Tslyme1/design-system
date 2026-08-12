import type { Meta, StoryObj } from '@storybook/react-vite';
import { AppHeader, HeaderButton, HeaderDivider, HeaderSpacer } from './AppHeader';
import { Stack, Text, Surface } from '@/primitives';

const meta = {
  title: 'Components/AppHeader',
  component: AppHeader,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'Роль: оболочка приложения — полоса шапки и её ячейки. Отдельная шкала `chrome`: полоса 44, ячейка 44, радиус 0.',
          'Не использовать для: действий внутри содержимого — там `Button`. У ячейки шапки нет собственной высоты и отступов, она заполняет полосу целиком и отделяется хайрлайном, а не отступом.',
          'Попытка выразить обе сущности одним компонентом даёт проп `variant="header"`, отменяющий половину остальных.',
        ].join('\n\n'),
      },
    },
  },
} satisfies Meta<typeof AppHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    children: (
      <>
        <HeaderButton icon="home" title="Проекты" active />
        <HeaderButton icon="folder" title="Библиотека" />
        <HeaderDivider />
        <HeaderButton icon="user">Иванов И. И.</HeaderButton>
        <HeaderSpacer />
        <HeaderButton icon="help" title="Справка" />
        <HeaderButton chrome="minimize" title="Свернуть" />
        <HeaderButton chrome="maximize" title="Развернуть" />
        <HeaderButton chrome="close" title="Закрыть" />
      </>
    ),
  },
  render: (args) => (
    <Surface level="flat" border radius="none" fullWidth>
      <AppHeader {...args} />
    </Surface>
  ),
};

/** Четыре формы ячейки. Разделяются линией, а не расстоянием. */
export const Variants: Story = {
  args: { children: null },
  render: () => (
    <Stack gap="xl">
      <Stack gap="xs">
        <Text variant="label">Только иконка — 44×44</Text>
        <Surface level="flat" border radius="none" fullWidth>
          <AppHeader>
            <HeaderButton icon="home" title="Проекты" />
            <HeaderButton icon="folder" title="Библиотека" />
            <HeaderButton icon="settings" title="Настройки" />
          </AppHeader>
        </Surface>
      </Stack>

      <Stack gap="xs">
        <Text variant="label">С подписью и раскрытием</Text>
        <Surface level="flat" border radius="none" fullWidth>
          <AppHeader>
            <HeaderButton icon="user" expandable>
              Иванов И. И.
            </HeaderButton>
            <HeaderDivider />
            <HeaderButton icon="fileText" expandable>
              КМД-1750Т7-Д
            </HeaderButton>
          </AppHeader>
        </Surface>
      </Stack>

      <Stack gap="xs">
        <Text variant="label">Активная вкладка</Text>
        <Surface level="flat" border radius="none" fullWidth>
          <AppHeader>
            <HeaderButton icon="home" title="Проекты" active />
            <HeaderButton icon="folder" title="Библиотека" />
          </AppHeader>
        </Surface>
      </Stack>

      <Stack gap="xs">
        <Text variant="label">Управление окном</Text>
        <Surface level="flat" border radius="none" fullWidth>
          <AppHeader>
            <HeaderSpacer />
            <HeaderButton chrome="minimize" title="Свернуть" />
            <HeaderButton chrome="maximize" title="Развернуть" />
            <HeaderButton chrome="close" title="Закрыть" />
          </AppHeader>
        </Surface>
      </Stack>
    </Stack>
  ),
};

/** `chrome="close"` — единственная ячейка, краснеющая при наведении. */
export const States: Story = {
  args: { children: null },
  render: () => (
    <Stack gap="md">
      <Surface level="flat" border radius="none" fullWidth>
        <AppHeader>
          <HeaderButton icon="home" title="Обычная" />
          <HeaderButton icon="folder" title="Активная" active />
          <HeaderButton icon="settings" title="Недоступная" disabled />
          <HeaderSpacer />
          <HeaderButton chrome="close" title="Закрыть" />
        </AppHeader>
      </Surface>
      <Text variant="caption" color="textMuted">
        Наведи на каждую и пройди табом. Красный отдан только закрытию: это единственное действие шапки, теряющее
        несохранённую работу.
      </Text>
    </Stack>
  ),
};

/** Шапка целиком — так она стоит в приложении. */
export const InContext: Story = {
  args: { children: null },
  render: () => (
    <Surface level="flat" border radius="none" fullWidth>
      <AppHeader>
        <HeaderButton icon="home" title="Проекты" active />
        <HeaderButton icon="folder" title="Библиотека" />
        <HeaderDivider />
        <HeaderButton icon="fileText" expandable>
          КМД-1750Т7-Д
        </HeaderButton>
        <HeaderSpacer />
        <HeaderButton icon="user" expandable>
          Иванов И. И.
        </HeaderButton>
        <HeaderButton icon="help" title="Справка" />
        <HeaderDivider />
        <HeaderButton chrome="minimize" title="Свернуть" />
        <HeaderButton chrome="maximize" title="Развернуть" />
        <HeaderButton chrome="close" title="Закрыть" />
      </AppHeader>
    </Surface>
  ),
};
