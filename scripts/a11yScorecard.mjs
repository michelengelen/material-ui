/* eslint-disable no-console */
/**
 * Aggregates the per-component conformance reports into a library-level scorecard.
 *
 * Each `packages/mui-material/src/<Component>/accessibility.md` opens with a
 * count table rating the component against WCAG 2.2 Level A and AA. This script
 * parses those tables and rewrites two generated blocks:
 *
 * - the `Reports` table in `packages/mui-material/src/accessibility.md`
 * - `docs/data/material/getting-started/accessibility/scorecard.json`, which the
 *   public conformance page renders.
 *
 * Run with `pnpm a11y:scorecard`; `--check` exits non-zero when either output is
 * stale, so CI can guard against a report landing without its rollup.
 */
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import * as prettier from 'prettier';

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const rootDirectory = path.resolve(currentDirectory, '..');
const componentsDirectory = path.join(rootDirectory, 'packages/mui-material/src');
const indexPath = path.join(componentsDirectory, 'accessibility.md');
const scorecardPath = path.join(
  rootDirectory,
  'docs/data/material/getting-started/accessibility/scorecard.json',
);

const START_MARKER = '<!-- scorecard:start -->';
const END_MARKER = '<!-- scorecard:end -->';

/**
 * Rows are `| <label> | <count> |`. The label carries the symbol, so match on
 * the symbol rather than the wording, which varies ("Inherited (see Radio)").
 */
const COUNT_ROW_REGEX = /^\|\s*(.+?)\s*\|\s*([\d]+(?:\/\d+)?)\s*\|$/;

const FIELDS = [
  ['✅', 'supports'],
  ['⚠️', 'partiallySupports'],
  ['❌', 'doesNotSupport'],
  ['➖', 'notApplicable'],
  ['↗', 'inherited'],
  ['🚩', 'flagged'],
];

/** `#### 1.4.3 Contrast (Minimum) · AA` */
const CRITERION_HEADING_REGEX = /^#### (\d+\.\d+\.\d+) (.+?) · (A|AA)\s*$/;

const CONFORMANCE_BY_SYMBOL = {
  '✅': 'Supports',
  '⚠️': 'Partially Supports',
  '❌': 'Does Not Support',
  '➖': 'Not Applicable',
};

/** Worst-first: the library-level rating for a criterion is the worst any component scores. */
const CONFORMANCE_SEVERITY = [
  'Does Not Support',
  'Partially Supports',
  'Supports',
  'Not Applicable',
];

/**
 * Each criterion heading is followed by a status line of backticked tokens:
 * an optional `🚩` evidence flag, the conformance rating, then who is
 * responsible for meeting it.
 */
function parseCriteria(markdown) {
  const lines = markdown.split('\n');
  const criteria = [];

  lines.forEach((line, index) => {
    const heading = line.match(CRITERION_HEADING_REGEX);
    if (!heading) {
      return;
    }
    const [, number, name, level] = heading;
    const statusLine =
      lines.slice(index + 1, index + 4).find((candidate) => candidate.trim()) ?? '';
    const tokens = [...statusLine.matchAll(/`([^`]+)`/g)].map((match) => match[1]);

    const flagged = tokens.some((token) => token.includes('🚩'));
    const conformanceToken = tokens.find((token) =>
      Object.keys(CONFORMANCE_BY_SYMBOL).some((symbol) => token.startsWith(symbol)),
    );
    const symbol = Object.keys(CONFORMANCE_BY_SYMBOL).find((candidate) =>
      conformanceToken?.startsWith(candidate),
    );
    const responsibilityToken = tokens.find((token) => /^[●◐○]/.test(token));

    criteria.push({
      number,
      name,
      level,
      conformance: symbol ? CONFORMANCE_BY_SYMBOL[symbol] : null,
      responsibility: responsibilityToken?.replace(/^[●◐○]\s*/, '') ?? null,
      flagged,
    });
  });

  return criteria;
}

/** Collapses the per-component criteria into one row per success criterion. */
function rollUpCriteria(reports) {
  const byNumber = new Map();

  for (const report of reports) {
    for (const criterion of report.criteria) {
      const existing = byNumber.get(criterion.number);
      if (!existing) {
        byNumber.set(criterion.number, {
          number: criterion.number,
          name: criterion.name,
          level: criterion.level,
          conformance: criterion.conformance,
          flagged: criterion.flagged,
          affected: criterion.conformance === 'Partially Supports' ? [report.component] : [],
        });
        continue;
      }

      if (criterion.conformance === 'Partially Supports') {
        existing.affected.push(report.component);
      }
      existing.flagged = existing.flagged || criterion.flagged;

      const currentRank = CONFORMANCE_SEVERITY.indexOf(existing.conformance);
      const incomingRank = CONFORMANCE_SEVERITY.indexOf(criterion.conformance);
      if (incomingRank !== -1 && (currentRank === -1 || incomingRank < currentRank)) {
        existing.conformance = criterion.conformance;
      }
    }
  }

  return [...byNumber.values()].sort((a, b) =>
    a.number.localeCompare(b.number, undefined, { numeric: true }),
  );
}

function parseReport(markdown) {
  const counts = {};
  for (const line of markdown.split('\n')) {
    const match = line.match(COUNT_ROW_REGEX);
    if (!match) {
      continue;
    }
    const [, label, value] = match;
    const field = FIELDS.find(([symbol]) => label.startsWith(symbol));
    if (field) {
      counts[field[1]] = value;
    }
  }

  // "## Known gaps" runs until the next heading. Bullets that open with a
  // conformance symbol are the gaps; prose ("No group-level gaps.") is not.
  const gapsSection = markdown.match(/^## Known gaps\n([\s\S]*?)(?=\n## )/m);
  const gaps = (gapsSection?.[1] ?? '')
    .split('\n')
    .filter((line) => /^- (⚠️|❌|Inherits:)/.test(line.trim()))
    .map((line) => line.trim().replace(/^- /, ''));

  return { counts, gaps, criteria: parseCriteria(markdown) };
}

function toNumber(value) {
  if (value === undefined) {
    return 0;
  }
  // Flagged is reported as "12/27"; only the numerator is a count.
  return Number.parseInt(String(value).split('/')[0], 10);
}

async function collectReports() {
  const entries = await fs.readdir(componentsDirectory, { withFileTypes: true });

  const reports = await Promise.all(
    entries
      .filter((entry) => entry.isDirectory())
      .map(async (entry) => {
        const reportPath = path.join(componentsDirectory, entry.name, 'accessibility.md');
        try {
          const markdown = await fs.readFile(reportPath, 'utf8');
          return { component: entry.name, ...parseReport(markdown) };
        } catch (error) {
          if (error.code !== 'ENOENT') {
            throw error;
          }
          // A component without a report simply has not been assessed yet.
          return null;
        }
      }),
  );

  return reports.filter(Boolean).sort((a, b) => a.component.localeCompare(b.component));
}

function renderTable(reports) {
  const header = [
    '| Component | ✅ Supports | ⚠️ Partially Supports | ❌ Does Not Support | ➖ Not Applicable | 🚩 Flagged |',
    '| :-------- | :---------- | :-------------------- | :------------------ | :---------------- | :--------- |',
  ];

  const rows = reports.map((report) => {
    const link = `[${report.component}](./${report.component}/accessibility.md)`;
    const cell = (key) => report.counts[key] ?? '—';
    return `| ${link} | ${cell('supports')} | ${cell('partiallySupports')} | ${cell('doesNotSupport')} | ${cell('notApplicable')} | ${cell('flagged')} |`;
  });

  const totals = FIELDS.reduce((accumulator, [, field]) => {
    accumulator[field] = reports.reduce((sum, report) => sum + toNumber(report.counts[field]), 0);
    return accumulator;
  }, {});

  const totalRow = `| **${reports.length} components** | **${totals.supports}** | **${totals.partiallySupports}** | **${totals.doesNotSupport}** | **${totals.notApplicable}** | **${totals.flagged}** |`;

  return { table: [...header, ...rows, totalRow].join('\n'), totals };
}

/** Formats generated output the way Prettier would, so `test_static` stays green. */
async function format(source, filepath) {
  const config = await prettier.resolveConfig(filepath);
  return prettier.format(source, { ...config, filepath });
}

function replaceBlock(source, replacement) {
  const start = source.indexOf(START_MARKER);
  const end = source.indexOf(END_MARKER);
  if (start === -1 || end === -1) {
    throw new Error(
      `Missing ${START_MARKER} / ${END_MARKER} markers in packages/mui-material/src/accessibility.md`,
    );
  }
  return `${source.slice(0, start + START_MARKER.length)}\n\n${replacement}\n\n${source.slice(end)}`;
}

async function run(argv) {
  const check = argv.includes('--check');
  const reports = await collectReports();

  if (reports.length === 0) {
    throw new Error('No accessibility.md reports found under packages/mui-material/src');
  }

  const { table, totals } = renderTable(reports);

  const currentIndex = await fs.readFile(indexPath, 'utf8');

  const scorecard = {
    // Regenerated by scripts/a11yScorecard.mjs — do not edit by hand.
    standard: 'WCAG 2.2 Level A and AA',
    componentCount: reports.length,
    totals,
    criteria: rollUpCriteria(reports),
    components: reports,
  };

  // Both outputs are committed, so they have to match what Prettier would
  // produce — otherwise `test_static` fails on a file nobody edited by hand.
  const nextIndex = await format(replaceBlock(currentIndex, table), indexPath);
  const nextScorecard = await format(JSON.stringify(scorecard, null, 2), scorecardPath);

  let currentScorecard = null;
  try {
    currentScorecard = await fs.readFile(scorecardPath, 'utf8');
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }

  const stale = nextIndex !== currentIndex || nextScorecard !== currentScorecard;

  if (check) {
    if (stale) {
      console.error(
        'Accessibility scorecard is out of date. Run `pnpm a11y:scorecard` and commit the result.',
      );
      process.exit(1);
    }
    console.log(`Accessibility scorecard is up to date (${reports.length} components).`);
    return;
  }

  await fs.writeFile(indexPath, nextIndex);
  await fs.mkdir(path.dirname(scorecardPath), { recursive: true });
  await fs.writeFile(scorecardPath, nextScorecard);

  console.log(`Scorecard updated for ${reports.length} components:`);
  console.log(
    `  ✅ ${totals.supports}  ⚠️ ${totals.partiallySupports}  ❌ ${totals.doesNotSupport}  ➖ ${totals.notApplicable}  🚩 ${totals.flagged}`,
  );
}

run(process.argv.slice(2)).catch((error) => {
  console.error(error);
  process.exit(1);
});
