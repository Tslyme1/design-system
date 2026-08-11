import { useState } from 'react';
import { Stack, Box, Text, Surface, Field, Icon } from '@/primitives';
import {
  Button,
  Modal,
  Drawer,
  Popover,
  Input,
  Select,
  Checkbox,
  Radio,
  RadioGroup,
  Tag,
  Chip,
  Card,
  EmptyState,
  AppHeader,
  HeaderButton,
  HeaderDivider,
  HeaderSpacer,
} from '@/components';
import styles from './Playground.module.css';

/**
 * Витрина системы. Не входит в публичный экспорт — это инструмент проверки,
 * а не часть библиотеки.
 *
 * Собрана только из готовых компонентов: если что-то здесь нельзя
 * выразить без обхода системы, это дефект системы, а не витрины.
 */
export function Playground() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [modalOpen, setModalOpen] = useState(false);
  const [wideModalOpen, setWideModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modeOpen, setModeOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [mode, setMode] = useState('engineer');
  const [crusher, setCrusher] = useState<string | string[] | null>(null);
  const [customer, setCustomer] = useState<string | string[] | null>(null);
  const [tags, setTags] = useState<string | string[]>([]);
  const [showDelta, setShowDelta] = useState(true);
  const [angleUnit, setAngleUnit] = useState('deg');

  const crushers = [
    { value: 'kmd-1750', label: 'КМД-1750Т7-Д', description: 'Коркино', group: 'КМД' },
    { value: 'kmd-2200', label: 'КМД-2200Т6-Д', description: 'Качканар', group: 'КМД' },
    { value: 'ksd-2200', label: 'КСД-2200Т', description: 'Михайловский ГОК', group: 'КСД' },
    { value: 'ksd-1750', label: 'КСД-1750Гр', description: 'Стойленский ГОК', group: 'КСД' },
  ];

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
  };

  return (
    <div className={styles.page}>
      <Stack gap="2xl">
        <Stack direction="row" gap="md" align="center" justify="between">
          <Stack gap="2xs">
            <Text variant="headingLg">Дизайн-система «Уралмаш»</Text>
            <Text variant="body" color="textMuted">
              Витрина токенов, примитивов и компонентов. Источник правды — код.
            </Text>
          </Stack>
          <Button variant="secondary" iconStart={theme === 'light' ? 'settings' : 'settings'} onClick={toggleTheme}>
            {theme === 'light' ? 'Тёмная тема' : 'Светлая тема'}
          </Button>
        </Stack>

        {/* ---------- Типографика ---------- */}
        <Section title="Типографика" note="Роль = размер + интерлиньяж + вес. Задавать font-size напрямую нельзя.">
          <Stack gap="sm">
            <Text variant="headingLg">Заголовок страницы — 32</Text>
            <Text variant="headingMd">Заголовок секции — 22</Text>
            <Text variant="headingSm">Заголовок карточки — 16</Text>
            <Text variant="bodyLg">Вводный текст — 15</Text>
            <Text variant="body">Основной текст форм — 13</Text>
            <Text variant="bodySm">Плотные области: таблицы, меню — 12</Text>
            <Text variant="label">Подпись поля — 12/600</Text>
            <Text variant="caption" color="textMuted">
              Служебная подпись, единицы измерения — 11
            </Text>
          </Stack>
        </Section>

        {/* ---------- Кнопки ---------- */}
        <Section title="Кнопки" note="Залитая — только primary, и на экране она одна.">
          <Stack gap="lg">
            <Stack direction="row" gap="sm" align="center" wrap>
              <Button variant="primary">Рассчитать</Button>
              <Button variant="secondary">Отмена</Button>
              <Button variant="ghost">Сбросить</Button>
              <Button variant="danger" iconStart="trash">
                Удалить
              </Button>
              <Button variant="primary" disabled>
                Недоступно
              </Button>
              <Button
                variant="primary"
                loading={loading}
                onClick={() => {
                  setLoading(true);
                  setTimeout(() => setLoading(false), 1600);
                }}
              >
                Сохранить
              </Button>
            </Stack>

            <Stack direction="row" gap="sm" align="center" wrap>
              <Button size="sm" variant="secondary" iconStart="plus">
                Малая — 32
              </Button>
              <Button size="md" variant="secondary" iconStart="plus">
                Средняя — 40
              </Button>
              <Button size="lg" variant="secondary" iconStart="plus">
                Большая — 48
              </Button>
            </Stack>
          </Stack>
        </Section>

        {/* ---------- Поля ---------- */}
        <Section title="Поля" note="Подпись, пояснение и ошибка связаны с контролом программно.">
          <Stack direction="row" gap="lg" wrap align="start">
            <Box>
              <Field label="Название проекта" hint="Отображается в списке проектов">
                {(props) => (
                  <Input
                    {...props}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="КМД-1750Т7-Д"
                    fullWidth
                  />
                )}
              </Field>
            </Box>

            <Box>
              <Field label="Заказчик" error="Поле обязательно для заполнения" required>
                {(props) => <Input {...props} invalid fullWidth />}
              </Field>
            </Box>

            <Box>
              <Field label="Дата расчёта">{(props) => <Input {...props} type="date" fullWidth />}</Field>
            </Box>
          </Stack>
        </Section>

        {/* ---------- Метки ---------- */}
        <Section title="Метки" note="Единственное место, где цвет — пользовательский выбор, а не роль.">
          <Stack direction="row" gap="sm" wrap align="center">
            <Tag color="steel">Рабочий</Tag>
            <Tag color="amber">Черновик</Tag>
            <Tag color="slate">Архив</Tag>
            <Tag color="sage">Согласовано</Tag>
            <Tag color="clay">На доработке</Tag>
            <Tag color="violet" onRemove={() => undefined}>
              Со снятием
            </Tag>
          </Stack>
        </Section>

        {/* ---------- Карточки ---------- */}
        <Section title="Карточки" note="Прямые углы и хайрлайн — чертёжный объект, а не залитый блок.">
          <Stack direction="row" gap="lg" wrap align="start">
            <div className={styles.cardSlot}>
              <Card kicker="Проект" title="КМД-1750Т7-Д">
                <Text variant="bodySm" color="textMuted">
                  Коркино, железистые кварциты
                </Text>
              </Card>
            </div>

            <div className={styles.cardSlot}>
              <Card kicker="Проект" title="КСД-2200Т-Д" blueprint>
                <Text variant="bodySm" color="textMuted">
                  С регистрационными метками по углам
                </Text>
              </Card>
            </div>
          </Stack>
        </Section>

        {/* ---------- Пустое состояние ---------- */}
        <Section title="Пустое состояние" note="Один вид на весь проект — было три.">
          <Surface level="flat" border radius="none" fullWidth>
            <EmptyState
              icon="search"
              title="Ничего не найдено"
              description="Измените условия фильтрации или сбросьте их."
              action={
                <Button variant="secondary" size="sm">
                  Сбросить фильтры
                </Button>
              }
            />
          </Surface>
        </Section>

        {/* ---------- Модалки ---------- */}
        <Section title="Модальные окна" note="Анатомия зашита, содержимое слотов свободно.">
          <Stack direction="row" gap="sm" wrap>
            <Button variant="secondary" onClick={() => setModalOpen(true)}>
              Узкая — 560
            </Button>
            <Button variant="secondary" onClick={() => setWideModalOpen(true)}>
              Широкая — 1100
            </Button>
          </Stack>
        </Section>

        {/* ---------- Шапка сервиса ---------- */}
        <Section
          title="Шапка сервиса"
          note="Отдельная шкала chrome: высота 44, радиус 0, ячейки разделены линиями, а не отступами."
        >
          <Surface level="flat" border radius="none" fullWidth>
            <AppHeader>
              <HeaderButton icon="home" title="Проекты" active />
              <HeaderDivider />
              <HeaderButton icon="plus" title="Новый проект" />
              <HeaderDivider />
              <HeaderButton expandable>КМД-1750Т7-Д — Коркино</HeaderButton>
              <HeaderSpacer />
              <HeaderButton expandable>
                {mode === 'engineer' ? 'Инженерный режим' : 'Упрощённый режим'}
              </HeaderButton>
              <HeaderDivider />
              <HeaderButton icon="help" title="Справка" />
              <HeaderDivider />
              <HeaderButton icon="minimize" title="Свернуть" chrome="minimize" />
              <HeaderButton icon="maximize" title="Развернуть" chrome="maximize" />
              <HeaderButton icon="x" title="Закрыть" chrome="close" />
            </AppHeader>
          </Surface>
        </Section>

        {/* ---------- Плашки ---------- */}
        <Section title="Плашки" note="Показывают выбранный объект и ведут к его замене. Не путать с метками.">
          <Stack direction="row" gap="md" wrap align="center">
            <Chip icon="settings" meta="Коркино" action={{ icon: 'pencil', label: 'Сменить дробилку', onClick: () => undefined }}>
              КМД-1750Т7-Д
            </Chip>
            <Chip icon="folder" meta="проба 3" action={{ icon: 'pencil', label: 'Сменить пробу', onClick: () => undefined }}>
              Железистые кварциты
            </Chip>
            <Chip icon="fileText" active onClick={() => undefined}>
              Активная плашка
            </Chip>
          </Stack>
        </Section>

        {/* ---------- Поповеры ---------- */}
        <Section
          title="Поповеры"
          note="Панель фильтров, выбор режима, действия над диаграммой — одна конструкция вместо трёх."
        >
          <Stack direction="row" gap="md" wrap align="start">
            <Popover
              open={modeOpen}
              onClose={() => setModeOpen(false)}
              placement="bottom-start"
              width="md"
              trigger={
                <Button variant="secondary" iconEnd="chevronDown" onClick={() => setModeOpen((v) => !v)}>
                  Режим работы
                </Button>
              }
            >
              <RadioGroup name="mode" legend="Режим расчёта">
                <Radio
                  value="engineer"
                  checked={mode === 'engineer'}
                  onChange={() => setMode('engineer')}
                  label="Инженерный"
                  description="Ручная настройка всех параметров на каждом этапе."
                />
                <Radio
                  value="simple"
                  checked={mode === 'simple'}
                  onChange={() => setMode('simple')}
                  label="Упрощённый"
                  description="Три коротких шага и готовый отчёт."
                />
              </RadioGroup>
            </Popover>

            <Popover
              open={filtersOpen}
              onClose={() => setFiltersOpen(false)}
              placement="bottom-start"
              width="md"
              title="Фильтры"
              trigger={
                <Button variant="secondary" iconStart="slidersHorizontal" onClick={() => setFiltersOpen((v) => !v)}>
                  Фильтры
                </Button>
              }
              footer={
                <Button variant="ghost" size="sm" fullWidth onClick={() => setFiltersOpen(false)}>
                  Сбросить всё
                </Button>
              }
            >
              <Stack gap="sm">
                <Checkbox label="Показывать изменения" checked={showDelta} onChange={(e) => setShowDelta(e.target.checked)} />
                <Checkbox label="Только мои проекты" />
                <Checkbox label="Включая архив" />
                <Checkbox label="Частично выбрано" indeterminate />
                <Checkbox label="Недоступно" disabled />
              </Stack>
            </Popover>
          </Stack>
        </Section>

        {/* ---------- Флажки и переключатели ---------- */}
        <Section
          title="Флажки и переключатели"
          note="Квадрат — можно выбрать несколько. Круг — один вариант. Форма совпадает со смыслом."
        >
          <Stack direction="row" gap="2xl" wrap align="start">
            <Stack gap="sm">
              <Checkbox label="Учитывать износ футеровки" defaultChecked />
              <Checkbox label="Показывать промежуточные расчёты" />
              <Checkbox label="Выбрано частично" indeterminate />
            </Stack>

            <RadioGroup name="angle" legend="Единицы угла">
              <Radio value="deg" checked={angleUnit === 'deg'} onChange={() => setAngleUnit('deg')} label="Градусы" />
              <Radio value="rad" checked={angleUnit === 'rad'} onChange={() => setAngleUnit('rad')} label="Радианы" />
            </RadioGroup>
          </Stack>
        </Section>

        {/* ---------- Выпадающие списки ---------- */}
        <Section title="Выпадающие списки" note="Одиночный и множественный выбор, поиск, группы, свободный ввод.">
          <Stack direction="row" gap="lg" wrap align="start">
            <div className={styles.cardSlot}>
              <Field label="Дробилка" fullWidth>
                {(props) => (
                  <Select {...props} options={crushers} value={crusher} onChange={setCrusher} searchable fullWidth placeholder="Выберите дробилку" />
                )}
              </Field>
            </div>

            <div className={styles.cardSlot}>
              <Field label="Метки" hint="Можно выбрать несколько" fullWidth>
                {(props) => (
                  <Select
                    {...props}
                    multiple
                    options={[
                      { value: 'work', label: 'Рабочий' },
                      { value: 'draft', label: 'Черновик' },
                      { value: 'archive', label: 'Архив' },
                    ]}
                    value={tags}
                    onChange={setTags}
                    fullWidth
                    placeholder="Не выбрано"
                    footer={
                      <Button variant="ghost" size="sm" iconStart="plus" fullWidth>
                        Добавить метку
                      </Button>
                    }
                  />
                )}
              </Field>
            </div>
          </Stack>
        </Section>

        {/* ---------- Поля с плавающей подписью ---------- */}
        <Section
          title="Поля второго типа"
          note="Подпись лежит в поле и уходит наверх при вводе. Тот же Field, другой вариант."
        >
          <Stack direction="row" gap="lg" wrap align="start">
            <div className={styles.cardSlot}>
              <Field label="Название проекта" variant="floating" fullWidth>
                {(props) => <Input {...props} fullWidth />}
              </Field>
            </div>

            <div className={styles.cardSlot}>
              <Field label="Заказчик" variant="floating" hint="Можно ввести нового" fullWidth>
                {(props) => (
                  <Select
                    {...props}
                    options={[
                      { value: 'korkino', label: 'Коркино' },
                      { value: 'kachkanar', label: 'Качканар' },
                    ]}
                    value={customer}
                    onChange={setCustomer}
                    searchable
                    allowCustom
                    fullWidth
                  />
                )}
              </Field>
            </div>

            <div className={styles.cardSlot}>
              <Field label="Обязательное поле" variant="floating" error="Заполните поле" required fullWidth>
                {(props) => <Input {...props} invalid fullWidth />}
              </Field>
            </div>
          </Stack>
        </Section>

        {/* ---------- Выдвижная панель ---------- */}
        <Section
          title="Выдвижная панель"
          note="Перекрывает рабочую область, но не шапку — в отличие от модалки."
        >
          <div className={styles.drawerHost}>
            <AppHeader>
              <HeaderButton icon="home" title="Проекты" active />
              <HeaderDivider />
              <HeaderButton expandable>КМД-1750Т7-Д</HeaderButton>
              <HeaderSpacer />
              <HeaderButton icon="help" title="Справка" />
            </AppHeader>

            <div className={styles.drawerBody}>
              <Stack gap="md" align="start">
                <Text variant="body" color="textMuted">
                  Шапка остаётся доступной, пока панель открыта.
                </Text>
                <Button variant="primary" iconStart="chevronLeft" onClick={() => setDrawerOpen(true)}>
                  Смотреть результат
                </Button>
              </Stack>
            </div>

            <Drawer
              open={drawerOpen}
              onClose={() => setDrawerOpen(false)}
              title="Геометрия камеры"
              footer={
                <>
                  <Stack direction="row" gap="sm">
                    <Button variant="secondary" size="sm" iconStart="print">
                      Печать
                    </Button>
                    <Button variant="secondary" size="sm" iconStart="download">
                      Экспорт в Excel
                    </Button>
                  </Stack>
                  <Button variant="primary" iconStart="chevronRight" onClick={() => setDrawerOpen(false)}>
                    Свернуть результат
                  </Button>
                </>
              }
            >
              <Stack gap="md">
                <Text variant="body">Содержимое панели приходит снаружи — панель о нём ничего не знает.</Text>
                <Text variant="body" color="textMuted">
                  Прокрутка живёт только здесь, футер с действиями остаётся на виду.
                </Text>
              </Stack>
            </Drawer>
          </div>
        </Section>

        {/* ---------- Иконки ---------- */}
        <Section title="Иконки" note="Lucide, обводка 1.5, размер только из шкалы.">
          <Stack direction="row" gap="lg" wrap align="center">
            {(['home', 'search', 'filter', 'settings', 'plus', 'trash', 'pencil', 'download', 'calendar', 'users'] as const).map(
              (n) => (
                <Stack key={n} gap="2xs" align="center">
                  <Icon name={n} size="lg" />
                  <Text variant="caption" color="textMuted">
                    {n}
                  </Text>
                </Stack>
              )
            )}
          </Stack>
        </Section>
      </Stack>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Удалить метку?"
        footer={
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Отмена
            </Button>
            <Button variant="danger" onClick={() => setModalOpen(false)}>
              Удалить
            </Button>
          </Modal.Footer>
        }
      >
        <Text variant="body" color="textMuted">
          Метка будет снята с 3 проектов. Действие нельзя отменить.
        </Text>
      </Modal>

      <Modal
        open={wideModalOpen}
        onClose={() => setWideModalOpen(false)}
        title="Параметры расчёта"
        size="lg"
        footer={
          <Modal.Footer
            aside={
              <Text variant="bodySm" color="textMuted">
                Изменено 3 параметра
              </Text>
            }
          >
            <Button variant="secondary" onClick={() => setWideModalOpen(false)}>
              Отмена
            </Button>
            <Button variant="primary" onClick={() => setWideModalOpen(false)}>
              Применить
            </Button>
          </Modal.Footer>
        }
      >
        <Stack gap="lg">
          <Text variant="body" color="textMuted">
            Тот же компонент, другой размер и другое содержимое. Модалка не знает, что внутри.
          </Text>
          <Stack direction="row" gap="lg" wrap align="start">
            <Box>
              <Field label="Производительность" hint="т/ч">
                {(props) => <Input {...props} fullWidth />}
              </Field>
            </Box>
            <Box>
              <Field label="Крупность питания" hint="мм">
                {(props) => <Input {...props} fullWidth />}
              </Field>
            </Box>
          </Stack>
        </Stack>
      </Modal>
    </div>
  );
}

function Section({ title, note, children }: { title: string; note: string; children: React.ReactNode }) {
  return (
    <Stack gap="md" as="section">
      <Stack gap="2xs">
        <Text variant="headingMd">{title}</Text>
        <Text variant="bodySm" color="textMuted">
          {note}
        </Text>
      </Stack>
      {children}
    </Stack>
  );
}
