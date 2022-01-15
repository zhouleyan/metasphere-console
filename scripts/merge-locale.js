const glob = require('glob');
const fs = require('fs');
const { resolve, basename, join } = require('path');
const { safeParseJSON } = require('../server/libs/utils');
const root = (path) => resolve(__dirname, `../${path}`);

const files = glob.sync(`${root('src')}/**/intl/*.json`);

const locales = new Set(['zh-CN', 'en-US']);

const outputPath = `${root('src')}/assets/locales`;

if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath);
}

locales.forEach((locale) => {
  const content = files.filter((file) => locale === basename(file, '.json'))
      .reduce(
        (prev, cur) => ({
          ...prev,
          ...safeParseJSON(fs.readFileSync(cur, 'utf8'), {})
        }),
        {}
      );
  fs.writeFileSync(
    join(outputPath, `locale-${locale}.json`),
    JSON.stringify(content)
  );
});
