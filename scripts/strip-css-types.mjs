/**
 * Убирает импорты стилей из деклараций пакета.
 *
 * `src/index.ts` подключает `tokens.css` — для разработки это правильно. Но tsc
 * переносит побочный импорт в `index.d.ts` как есть, а рядом с декларациями
 * такого файла нет: стили в пакете лежат одним собранным `styles.css`.
 * Потребитель получал бы ошибку разрешения модуля на пустом месте.
 *
 * Запускается после `tsc -p tsconfig.build.json`.
 */
import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const dist = join(process.cwd(), 'dist');

const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) return walk(full);
    return full.endsWith('.d.ts') ? [full] : [];
  });

let stripped = 0;

for (const file of walk(dist)) {
  const before = readFileSync(file, 'utf8');
  const after = before.replace(/^import\s+['"][^'"]+\.css['"];\s*$\n?/gm, '');

  if (after !== before) {
    writeFileSync(file, after);
    stripped += 1;
  }
}

console.log(`strip-css-types: очищено файлов — ${stripped}`);
