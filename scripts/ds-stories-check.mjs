#!/usr/bin/env node
/**
 * ds-stories-check — сверка Storybook и INVENTORY.md.
 * Запуск: node scripts/ds-stories-check.mjs [src-директория] [путь к INVENTORY.md]
 *
 * Витрина обязана отражать инвентарь символ в символ. Расхождение — блокер:
 * состояние, которого нельзя открыть в Storybook, обычно не реализовано и в коде.
 */

import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, basename } from 'node:path';

const ROOT = process.argv[2] || 'src';
const INVENTORY = process.argv[3] || 'INVENTORY.md';

/**
 * ШАБЛОН ОПИСАНИЯ. Порядок не декоративный: он ведёт от «что это»
 * к «как устроено» и к «где применять». Порядок экспортов в файле =
 * порядок в сайдбаре, поэтому он проверяется машинно.
 *
 * Расширять набор блоков можно — правкой этого списка, а не явочным
 * порядком в одном файле.
 */
const TEMPLATE = [
  'Overview',
  'Playground',
  'Variants',
  'States',
  'VariantStates',
  'DataStates',
  'Sizes',
  'Content',
  'Overflow',
  'EdgeCases',
  'Anatomy',
  'Usage',
];

/** Блоки, обязательные у всего без исключений. */
const ALWAYS = ['Overview', 'Playground', 'EdgeCases', 'Anatomy', 'Usage'];

/** Блоки, обязательные у компонентов, но не у примитивов. */
const COMPONENT_ONLY = ['Content', 'Overflow'];

const SECTION_BY_LAYER = {
  primitive: 'Primitives',
  component: 'Components',
  pattern: 'Patterns',
  page: 'Pages',
};

const EMPTY = new Set(['', '—', '-', 'нет', 'none']);

// ── Инвентарь ────────────────────────────────────────────────────────────────

if (!existsSync(INVENTORY)) {
  console.log(`ds-stories-check: не найден ${INVENTORY}. Сначала ds-primitives.`);
  process.exit(1);
}

/**
 * Записи компонентов — заголовки третьего уровня. Второй уровень занят
 * разделами инвентаря («Примитивы», «Компоненты»), они записями не являются.
 *
 * Заголовок семейства пишется через слэш («Radio / RadioGroup»), каноничным
 * считается первое имя: именно оно попадает в title истории.
 */
function parseInventory(text) {
  const entries = [];
  let current = null;
  for (const raw of text.split('\n')) {
    const head = raw.match(/^###\s+(.+?)\s*$/);
    if (head) {
      const full = head[1];
      current = { name: full.split('/')[0].trim(), fullName: full, layer: '', variants: '', states: '', props: '', text: '' };
      entries.push(current);
      continue;
    }
    if (!current) continue;
    current.text += `${raw}\n`;
    const field = raw.match(/^\s*[-*]\s*\*{0,2}([^:*]+)\*{0,2}\s*:\s*(.*)$/);
    if (!field) continue;
    const key = field[1].trim().toLowerCase();
    // Закрывающие звёздочки жирного начертания остаются в значении
    // («**Варианты:** —» → «** —»), из-за чего прочерк перестаёт читаться
    // как «вариантов нет» и правило требует историю на пустом месте.
    const value = field[2].trim().replace(/^\*+\s*/, '');
    if (key === 'слой' || key === 'layer') current.layer = value.toLowerCase();
    if (key === 'варианты' || key === 'variants') current.variants = value;
    if (key === 'состояния' || key === 'states') current.states = value;
    // Пропов может быть несколько строк («Пропы Radio», «Пропы RadioGroup»).
    if (key.startsWith('пропы') || key.startsWith('props')) current.props += ` ${value}`;
  }
  return entries;
}

const inventory = parseInventory(readFileSync(INVENTORY, 'utf8'));

// ── Истории ──────────────────────────────────────────────────────────────────

function walk(dir, acc = []) {
  let items;
  try { items = readdirSync(dir); } catch { return acc; }
  for (const item of items) {
    if (item === 'node_modules' || item.startsWith('.')) continue;
    const p = join(dir, item);
    if (statSync(p).isDirectory()) walk(p, acc);
    else if (/\.stories\.(tsx?|jsx?|mdx)$/.test(item)) acc.push(p);
  }
  return acc;
}

const storyFiles = walk(ROOT).map((file) => {
  const src = readFileSync(file, 'utf8');
  /**
   * Заголовок истории — не любой `title` в файле. У таблицы поле `title`
   * есть и у колонок, и первый из них шёл раньше меты, из-за чего файл
   * считался историей компонента «Обозначение». Берём тот, что начинается
   * с раздела навигации: разделы закрыты, и спутать их не с чем.
   */
  const title =
    src.match(/title\s*:\s*['"`]((?:Docs|Foundations|Primitives|Components|Patterns|Pages)\/[^'"`]*)['"`]/)?.[1] ?? '';
  // Порядок важен: exec по порядку вхождения даёт порядок объявления,
  // а он же — порядок в сайдбаре.
  const exports = [...src.matchAll(/export\s+const\s+([A-Z]\w*)/g)].map((m) => m[1]);
  return {
    file,
    title,
    name: title ? title.split('/').pop() : basename(file).replace(/\.stories\.\w+$/, ''),
    exports,
    exportSet: new Set(exports),
    /** Блок можно пропустить, объяснив причину в описании одной строкой. */
    skipped: new Set([...src.matchAll(/Блок\s+`?(\w+)`?\s+неприменим/g)].map((m) => m[1])),
  };
});

// ── Правила ──────────────────────────────────────────────────────────────────

const problems = [];
const add = (rule, where, msg) => problems.push({ rule, where, msg });

const byName = new Map(storyFiles.map((s) => [s.name, s]));
const inventoryNames = new Set(inventory.map((e) => e.name));

/** Какие блоки обязан иметь компонент — выводится из его записи в инвентаре. */
function requiredBlocks(entry) {
  const required = [...ALWAYS];
  const hasVariants = !EMPTY.has(entry.variants.toLowerCase());
  const hasStates = !EMPTY.has(entry.states.toLowerCase());

  if (hasVariants) required.push('Variants');
  if (hasStates) required.push('States');
  if (hasVariants && hasStates) required.push('VariantStates');
  // DataStates — про данные: загрузка и пустота. Ошибка валидации сюда
  // не входит, она принадлежит контролу и живёт в States.
  if (/loading|загруз|empty|пуст/i.test(entry.states)) required.push('DataStates');
  if (/\bsize\b/i.test(entry.props)) required.push('Sizes');
  if (entry.layer === 'component') required.push(...COMPONENT_ONLY);

  return required;
}

/**
 * Ссылки на компоненты внутри записи не должны врать.
 *
 * Секция «Не использовать для» отсылает к соседям пометкой «(не построен)».
 * Когда сосед появляется, пометку забывают снять — и реестр начинает
 * советовать не пользоваться тем, что уже готово. За сутки так разъехалось
 * девять записей из восемнадцати, и заметил это человек, а не машина.
 */
for (const entry of inventory) {
  for (const match of entry.text.matchAll(/`(\w+)`\s*\((?:пока\s+)?не построен/gi)) {
    if (inventoryNames.has(match[1])) {
      add('stale-reference', entry.name, `\`${match[1]}\` помечен «не построен», но запись о нём уже есть.`);
    }
  }
}

for (const entry of inventory) {
  const story = byName.get(entry.name);

  if (!story) {
    add('missing-story', entry.name, 'Есть в инвентаре, нет story-файла.');
    continue;
  }

  const section = SECTION_BY_LAYER[entry.layer];
  const expected = section ? `${section}/${entry.name}` : null;
  if (expected && story.title !== expected && !story.title.startsWith(`${section}/`)) {
    add('wrong-title', story.file, `title="${story.title}", ожидается "${expected}".`);
  }

  for (const block of requiredBlocks(entry)) {
    if (!story.exportSet.has(block) && !story.skipped.has(block)) {
      add('missing-block', story.file, `нет блока ${block}.`);
    }
  }

  const unknown = story.exports.filter((name) => !TEMPLATE.includes(name));
  for (const name of unknown) {
    add('unknown-block', story.file, `${name} — блок вне шаблона. Расширять набор можно только правкой TEMPLATE.`);
  }

  const known = story.exports.filter((name) => TEMPLATE.includes(name));
  const ordered = [...known].sort((a, b) => TEMPLATE.indexOf(a) - TEMPLATE.indexOf(b));
  if (known.join(',') !== ordered.join(',')) {
    add('wrong-order', story.file, `порядок блоков: ${known.join(' → ')}. Ожидается: ${ordered.join(' → ')}.`);
  }
}

for (const story of storyFiles) {
  const section = story.title.split('/')[0];
  if (['Foundations', 'Docs'].includes(section)) continue;
  if (!inventoryNames.has(story.name)) {
    add('missing-inventory', story.file, `"${story.name}" нет в ${INVENTORY}.`);
  }
}

// ── Вывод ────────────────────────────────────────────────────────────────────

const covered = inventory.filter((e) => byName.has(e.name)).length;
console.log(
  `\nds-stories-check: ${covered}/${inventory.length} записей инвентаря покрыто, ` +
  `${storyFiles.length} story-файлов.\n`
);

if (problems.length === 0) {
  console.log('Расхождений нет.');
  process.exit(0);
}

const byRule = problems.reduce((acc, p) => {
  (acc[p.rule] ||= []).push(p);
  return acc;
}, {});

for (const [rule, list] of Object.entries(byRule)) {
  console.log(`── ${rule} (${list.length})`);
  for (const p of list.slice(0, 40)) console.log(`   ${p.where}  ${p.msg}`);
  if (list.length > 40) console.log(`   … ещё ${list.length - 40}`);
  console.log('');
}

console.log(`Всего расхождений: ${problems.length}.`);
process.exit(1);
