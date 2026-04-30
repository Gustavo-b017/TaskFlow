import fs from 'node:fs';
import path from 'node:path';

function walk(dir: string): string[] {
  return fs.readdirSync(dir).flatMap((entry) => {
    const full = path.join(dir, entry);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) return walk(full);
    return full.endsWith('.ts') || full.endsWith('.tsx') ? [full] : [];
  });
}

describe('no explicit any in source', () => {
  it('does not contain explicit any in src files or test files', () => {
    const self = path.resolve(__filename);
    const files = walk(path.join(process.cwd(), 'src')).filter(
      (filePath) =>
        path.resolve(filePath) !== self &&
        !filePath.endsWith('.d.ts')
    );

    const explicitAnyPattern = /\bas any\b|:\s*any\b|<any>/;
    const offenders = files.filter((filePath) =>
      explicitAnyPattern.test(fs.readFileSync(filePath, 'utf8'))
    );

    expect(offenders).toEqual([]);
  });
});
