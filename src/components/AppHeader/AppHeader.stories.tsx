import type { Meta, StoryObj } from '@storybook/react-vite';
import { AppHeader, HeaderButton, HeaderDivider, HeaderLogo, HeaderTab } from './AppHeader';
import { Stack, Text, Surface, Box } from '@/primitives';

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
          'Устроена как две части — `AppHeader.Left` и `AppHeader.Right`. Обе принимают любые ячейки с любыми иконками: разделение здесь про сторону полосы, а не про назначение.',
          'Знак сервиса ставит `HeaderLogo` — он неинтерактивен. Переход на главную — обычная ячейка рядом со знаком: логотип, который выглядит нажимаемым и ничего не делает, обманывает.',
          '`HeaderSpacer` устарел, замена — `AppHeader.Right`.',
          'Не использовать для: действий внутри содержимого — там `Button`. У ячейки шапки нет собственной высоты и отступов, она заполняет полосу целиком и отделяется хайрлайном, а не отступом.',
        ].join('\n\n'),
      },
    },
  },
} satisfies Meta<typeof AppHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Знак сервиса система не хранит: бренд приходит снаружи, иначе библиотека
 * не переносится между сервисами. Здесь он нарисован в самой истории —
 * ровно так же, как его передаст приложение. Обводка `currentColor`
 * и толщина 1.5 — чтобы знак стоял в одном ряду с иконками ячеек,
 * а не выглядел вставкой из другой системы.
 */
function Mark() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 20 12 4l8 16Z" />
      <path d="M9 20l3-6 3 6" />
    </svg>
  );
}

export const Playground: Story = {
  args: {
    children: (
      <>
        <AppHeader.Left>
          <HeaderLogo label="Уралмаш" onClick={() => undefined}>
            <Mark />
          </HeaderLogo>
          <HeaderDivider />
          <HeaderButton icon="placeholder" title="Label" active />
          <HeaderDivider />
          <HeaderButton icon="placeholder" expandable>
            Label
          </HeaderButton>
        </AppHeader.Left>

        <AppHeader.Right>
          <HeaderButton icon="placeholder" expandable>
            Label
          </HeaderButton>
          <HeaderButton icon="placeholder" title="Label" />
          <HeaderDivider />
          <HeaderButton chrome="minimize" title="Свернуть" />
          <HeaderButton chrome="maximize" title="Развернуть" />
          <HeaderButton chrome="close" title="Закрыть" />
        </AppHeader.Right>
      </>
    ),
  },
  render: (args) => (
    <Surface level="flat" border radius="none" fullWidth>
      <AppHeader {...args} />
    </Surface>
  ),
};

/**
 * Части полосы и формы ячейки. Разделяются линией, а не расстоянием.
 *
 * Иконка здесь — заглушка: блок показывает форму ячейки, а не конкретное
 * действие. Настоящие иконки — в блоке `Usage`.
 */
export const Variants: Story = {
  args: { children: null },
  render: () => (
    <Stack gap="xl">
      <Stack gap="xs">
        <Text variant="label">Две части — любые ячейки слева и справа</Text>
        <Surface level="flat" border radius="none" fullWidth>
          <AppHeader>
            <AppHeader.Left>
              <HeaderButton icon="placeholder" title="Label 1" />
              <HeaderButton icon="placeholder" title="Label 2" />
            </AppHeader.Left>
            <AppHeader.Right>
              <HeaderButton icon="placeholder" title="Label 3" />
              <HeaderButton icon="placeholder" title="Label 4" />
            </AppHeader.Right>
          </AppHeader>
        </Surface>
      </Stack>

      <Stack gap="xs">
        <Text variant="label">
          Вкладка открытой сущности — подпись и действия над ней в одной ячейке. Действия проявляются при
          наведении, но место занимают всегда
        </Text>
        <Surface level="flat" border radius="none" fullWidth>
          <AppHeader>
            <AppHeader.Left>
              <HeaderTab
                active
                onClick={() => undefined}
                actions={
                  <>
                    <HeaderButton icon="chevronDown" title="Label" />
                    <HeaderButton chrome="close" title="Закрыть" />
                  </>
                }
              >
                Label
              </HeaderTab>
              <HeaderButton icon="placeholder" title="Label" />
            </AppHeader.Left>
          </AppHeader>
        </Surface>
      </Stack>

      <Stack gap="xs">
        <Text variant="label">Только правая часть — прижата к краю без левой</Text>
        <Surface level="flat" border radius="none" fullWidth>
          <AppHeader>
            <AppHeader.Right>
              <HeaderButton chrome="minimize" title="Свернуть" />
              <HeaderButton chrome="maximize" title="Развернуть" />
              <HeaderButton chrome="close" title="Закрыть" />
            </AppHeader.Right>
          </AppHeader>
        </Surface>
      </Stack>

      <Stack gap="xs">
        <Text variant="label">Знак сервиса — ячейка, ведущая на главную</Text>
        <Surface level="flat" border radius="none" fullWidth>
          <AppHeader>
            <AppHeader.Left>
              <HeaderLogo label="Уралмаш" onClick={() => undefined}>
                <Mark />
              </HeaderLogo>
              <HeaderDivider />
              <HeaderButton icon="placeholder" title="Label" />
            </AppHeader.Left>
          </AppHeader>
        </Surface>
      </Stack>

      <Stack gap="xs">
        <Text variant="label">Ячейка: только иконка — 44×44</Text>
        <Surface level="flat" border radius="none" fullWidth>
          <AppHeader>
            <AppHeader.Left>
              <HeaderButton icon="placeholder" title="Label 1" />
              <HeaderButton icon="placeholder" title="Label 2" />
              <HeaderButton icon="placeholder" title="Label 3" />
            </AppHeader.Left>
          </AppHeader>
        </Surface>
      </Stack>

      <Stack gap="xs">
        <Text variant="label">С подписью и раскрытием</Text>
        <Surface level="flat" border radius="none" fullWidth>
          <AppHeader>
            <AppHeader.Left>
              <HeaderButton icon="placeholder" expandable>
                Label 1
              </HeaderButton>
              <HeaderDivider />
              <HeaderButton icon="placeholder" expandable>
                Label 2
              </HeaderButton>
            </AppHeader.Left>
          </AppHeader>
        </Surface>
      </Stack>

      <Stack gap="xs">
        <Text variant="label">Активная вкладка</Text>
        <Surface level="flat" border radius="none" fullWidth>
          <AppHeader>
            <AppHeader.Left>
              <HeaderButton icon="placeholder" title="Label 1" active />
              <HeaderButton icon="placeholder" title="Label 2" />
            </AppHeader.Left>
          </AppHeader>
        </Surface>
      </Stack>

      <Stack gap="xs">
        <Text variant="label">Управление окном — иконку подставляет роль</Text>
        <Surface level="flat" border radius="none" fullWidth>
          <AppHeader>
            <AppHeader.Right>
              <HeaderButton chrome="minimize" title="Свернуть" />
              <HeaderButton chrome="maximize" title="Развернуть" />
              <HeaderButton chrome="close" title="Закрыть" />
            </AppHeader.Right>
          </AppHeader>
        </Surface>
        <Text variant="caption" color="textMuted">
          Единственные ячейки, у которых иконка не называется в месте употребления: свернуть, развернуть и закрыть —
          закрытый набор, и пара «`chrome="close"` с иконкой галочки» сообщала бы обратное действие.
        </Text>
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
          <AppHeader.Left>
            <HeaderLogo label="Уралмаш" onClick={() => undefined}>
              <Mark />
            </HeaderLogo>
            <HeaderDivider />
            <HeaderButton icon="placeholder" title="Обычная" />
            <HeaderButton icon="placeholder" title="Активная" active />
            <HeaderButton icon="placeholder" title="Недоступная" disabled />
          </AppHeader.Left>
          <AppHeader.Right>
            <HeaderButton chrome="close" title="Закрыть" />
          </AppHeader.Right>
        </AppHeader>
      </Surface>
      <Text variant="caption" color="textMuted">
        Наведи на каждую и пройди табом. Красный отдан только закрытию: это единственное действие шапки, теряющее
        несохранённую работу. Знак слева состояний не имеет — он не интерактивен и фокус не получает.
      </Text>
    </Stack>
  ),
};

/**
 * Примеры использования: шапка целиком, как она стоит в приложении.
 * Иконки здесь конкретные — в шапке иконка часто единственная подпись
 * ячейки, и заглушка на её месте не сообщала бы ничего.
 */
export const Usage: Story = {
  args: { children: null },
  render: () => (
    <Surface level="flat" border radius="none" fullWidth>
      <AppHeader>
        <AppHeader.Left>
          <HeaderLogo label="Уралмаш" onClick={() => undefined}>
            <Mark />
          </HeaderLogo>
          <HeaderDivider />
          <HeaderButton icon="home" title="Домой" active />
          <HeaderDivider />
          <HeaderButton icon="fileText" expandable>
            КМД-1750Т7-Д
          </HeaderButton>
        </AppHeader.Left>

        <AppHeader.Right>
          <HeaderButton icon="user" expandable>
            Иванов И. И.
          </HeaderButton>
          <HeaderButton icon="help" title="Справка" />
          <HeaderDivider />
          <HeaderButton chrome="minimize" title="Свернуть" />
          <HeaderButton chrome="maximize" title="Развернуть" />
          <HeaderButton chrome="close" title="Закрыть" />
        </AppHeader.Right>
      </AppHeader>

      {/* Рабочая область под шапкой: без неё не видно главного в активном
          пункте — того, что он сливается с областью, в которую ведёт. */}
      <Box background="surface" padding="lg" fullWidth>
        <Text variant="bodySm" color="textMuted">
          Активный пункт перекрывает нижнюю границу полосы и переходит в рабочую область без линии между ними.
          Остальные пункты остаются отделёнными от неё.
        </Text>
      </Box>
    </Surface>
  ),
};
