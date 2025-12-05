import eslint from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.strict,
  eslintConfigPrettier,
  {
    ignores: [
      '.pnpm-store',
      '**/vitest.*.ts',
      '**/*.mjs',
      '**/dist/*',
      '**/node_modules/*',
      '**/vitest.config.ts',
      'prettier.config.js',
    ],
  },
  {
    languageOptions: {
      parserOptions: {
        sourceType: 'module',
      },
    },
  },
  {
    rules: { '@typescript-eslint/explicit-function-return-type': 'off' },
    files: ['./packages/core/**/*.ts'],
  },
  {
    rules: {
      '@typescript-eslint/restrict-template-expressions': 'off',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-empty-object-type': 'off',
    },
  },
  {
    rules: {
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
    files: ['**/*.test.ts'],
  },
  {
    rules: {
      'no-console': '0',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
    },
  },
)
