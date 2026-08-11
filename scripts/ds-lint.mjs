#!/usr/bin/env node
/**
 * ds-lint — проверка кода на обход дизайн-системы.
 *
 * Адаптирован под стек проекта: React + TypeScript + CSS Modules.
 * Правила под Tailwind (произвольные значения в классах, `m-4` между
 * соседями) убраны — их здесь нечему ловить. Взамен добавлено правило
 * под объекты стилей в JSX: именно этот диалект дал в аудите
 * «Проект Уралмаш» 517 значений отступа и 18 кеглей.
 *
 * Запуск: node scripts/ds-lint.mjs src
 */

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, extname, sep } from 'node:path';

const ROOT = process.argv[2] || 'src';
const EXTS = new Set(['.ts', '.tsx', '.js', '.jsx', '.css']);

/**
 * Пути, где сырые значения легальны — это сама система.
 * Примитивы реализуют шкалы, поэтому обязаны обращаться к значениям напрямую.
 */
const ALLOWED = [`${sep}tokens${sep}`, `${sep}primitives${sep}`];

/**
 * `scope` ограничивает правило типом файла: диалекты разные, и правило
 * для объекта стилей в JSX не имеет смысла применять к CSS, где
 * `width: 100%` и `padding: 0` совершенно легальны.
 */
const CSS = new Set(['.css']);
const CODE = new Set(['.ts', '.tsx', '.js', '.jsx']);

const RULES = [
  {
    id: 'raw-color',
    scope: null,
    re: /#[0-9a-fA-F]{3,8}\b|\brgba?\(|\bhsla?\(|\boklch\(/g,
    msg: 'Сырой цвет. Используй семантическую роль из tokens.',
  },
  {
    id: 'raw-px-css',
    scope: CSS,
    re: /(?<!line-)(?:padding|margin|gap|border-radius|font-size|row-gap|column-gap)(?:-(?:top|right|bottom|left|inline|block))?\s*:\s*-?\d+(?:\.\d+)?(?:px|rem|em)/g,
    msg: 'Сырое значение в CSS. Используй var(--space-*) / var(--radius-*) / var(--text-*).',
  },
  {
    id: 'style-object-size',
    scope: CODE,
    re: /\b(?:padding|margin|gap|rowGap|columnGap|fontSize|borderRadius)(?:Top|Right|Bottom|Left|Inline|Block)?\s*:\s*(?:-?\d+(?:\.\d+)?\b|['"`]-?\d)/g,
    msg: 'Число в объекте стилей. Размеры задаются пропами примитивов (Stack gap, Box padding).',
  },
  {
    id: 'style-object-color',
    scope: CODE,
    re: /\b(?:color|background|backgroundColor|borderColor)\s*:\s*['"`](?!var\()/g,
    msg: 'Цвет строкой в объекте стилей. Используй семантическую роль.',
  },
  {
    id: 'primitive-import',
    scope: CODE,
    re: /from\s+['"][^'"]*tokens\/primitives['"]/g,
    msg: 'Прямой импорт примитивов. Импортируй из tokens (семантика).',
  },
  {
    id: 'fixed-height-css',
    scope: CSS,
    re: /(?:^|[;{\s])(?:height|min-height)\s*:\s*\d+(?:\.\d+)?(?:px|rem|em)/g,
    msg: 'Фиксированная высота. Блок с текстом не должен её иметь; для контролов есть var(--control-*).',
  },
  {
    id: 'raw-z-index',
    scope: null,
    re: /z-index\s*:[ \t]*\d+|zIndex\s*:[ \t]*\d+/g,
    msg: 'Сырой z-index. Используй var(--z-*) — иначе слои начнут спорить.',
  },
  {
    id: 'raw-font-family',
    scope: CSS,
    // Проверяется всё объявление целиком: `[ \t]*` иначе откатывается
    // назад и пропускает `font-family: var(...)` как нарушение.
    re: /font-family\s*:(?![^;]*var\()[^;]+;/g,
    msg: 'Гарнитура напрямую. Используй var(--font-heading) / var(--font-body).',
  },
];

function walk(dir, acc = []) {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return acc;
  }
  for (const e of entries) {
    if (e === 'node_modules' || e.startsWith('.')) continue;
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, acc);
    else if (EXTS.has(extname(p))) acc.push(p);
  }
  return acc;
}

const files = walk(ROOT);
const violations = [];

for (const file of files) {
  if (ALLOWED.some((a) => file.includes(a))) continue;
  const ext = extname(file);
  const lines = readFileSync(file, 'utf8').split('\n');
  lines.forEach((line, i) => {
    // Локальное исключение. Каждое такое место стоит обсуждать, а не оставлять молча.
    if (/ds-lint-disable/.test(line)) return;
    for (const rule of RULES) {
      if (rule.scope && !rule.scope.has(ext)) continue;
      rule.re.lastIndex = 0;
      let m;
      while ((m = rule.re.exec(line)) !== null) {
        violations.push({ file, line: i + 1, rule: rule.id, match: m[0].trim(), msg: rule.msg });
      }
    }
  });
}

if (violations.length === 0) {
  console.log(`ds-lint: чисто — ${files.length} файлов проверено.`);
  process.exit(0);
}

const byRule = violations.reduce((acc, v) => {
  (acc[v.rule] ||= []).push(v);
  return acc;
}, {});

console.log(`\nds-lint: найдено ${violations.length} нарушений в ${files.length} файлах.\n`);
for (const [rule, list] of Object.entries(byRule)) {
  console.log(`── ${rule} (${list.length}) — ${list[0].msg}`);
  for (const v of list.slice(0, 20)) {
    console.log(`   ${v.file}:${v.line}  ${v.match}`);
  }
  if (list.length > 20) console.log(`   … ещё ${list.length - 20}`);
  console.log('');
}
process.exit(1);
