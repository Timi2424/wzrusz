/**
 * Angular Enterprise Architecture boundaries for apps/web.
 * @see Angular Enterprise Architecture (Tomas Trajan) — automated validation chapter
 */
import boundaries from 'eslint-plugin-boundaries';

const APP_BASE = 'apps/web/src/app';

/** @type {import('eslint').Linter.Config[]} */
export const webArchitectureBoundaries = [
  {
    files: ['apps/web/src/app/**/*.ts'],
    plugins: {
      boundaries,
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: ['apps/web/tsconfig.json'],
        },
      },
      'boundaries/dependency-nodes': ['import', 'dynamic-import'],
      'boundaries/legacy-templates': false,
      'boundaries/elements': [
        {
          type: 'app',
          mode: 'file',
          pattern: 'app{,.*}.ts',
          basePattern: APP_BASE,
        },
        {
          type: 'feature-routes',
          mode: 'file',
          pattern: 'feature/*/*.routes.ts',
          capture: ['feature'],
          basePattern: APP_BASE,
        },
        {
          type: 'core',
          pattern: 'core/**',
          basePattern: APP_BASE,
        },
        {
          type: 'layout',
          pattern: 'layout/**',
          basePattern: APP_BASE,
        },
        {
          type: 'ui',
          pattern: 'ui/**',
          basePattern: APP_BASE,
        },
        {
          type: 'pattern',
          pattern: 'pattern/**',
          basePattern: APP_BASE,
        },
        {
          type: 'feature',
          pattern: 'feature/*/**',
          capture: ['feature'],
          basePattern: APP_BASE,
        },
      ],
    },
    rules: {
      ...boundaries.configs.strict.rules,
      'boundaries/entry-point': 'off',
      'boundaries/element-types': 'off',
      'boundaries/external': 'off',
      'boundaries/dependencies': [
        'error',
        {
          default: 'disallow',
          rules: [
            {
              from: { type: 'core' },
              allow: { to: { type: 'core' } },
            },
            {
              from: { type: 'ui' },
              allow: { to: { type: 'ui' } },
            },
            {
              from: { type: 'pattern' },
              allow: { to: { type: ['core', 'ui', 'pattern'] } },
            },
            {
              from: { type: 'layout' },
              allow: { to: { type: ['core', 'ui', 'pattern'] } },
            },
            {
              from: { type: 'app' },
              allow: { to: { type: ['app', 'core', 'layout', 'feature-routes'] } },
            },
            {
              from: { type: 'feature-routes' },
              allow: [
                { to: { type: ['core', 'ui', 'pattern'] } },
                {
                  to: {
                    type: 'feature',
                    captured: { feature: '{{ from.captured.feature }}' },
                  },
                },
                {
                  to: {
                    type: 'feature-routes',
                    captured: { feature: '!{{ from.captured.feature }}' },
                  },
                },
              ],
            },
            {
              from: { type: 'feature' },
              allow: [
                { to: { type: ['core', 'ui', 'pattern'] } },
                {
                  to: {
                    type: 'feature',
                    captured: { feature: '{{ from.captured.feature }}' },
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  },
];
