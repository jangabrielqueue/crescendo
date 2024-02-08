module.exports = {
	root: true,
	env: { browser: true, es2020: true },
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:react/recommended',
		'plugin:react/jsx-runtime',
		'plugin:react-hooks/recommended',
	],
	ignorePatterns: ['dist', '.eslintrc.cjs'],
	parser: '@typescript-eslint/parser',
	plugins: ['react-refresh'],
	rules: {
		'react-refresh/only-export-components': [
			'warn',
			{ allowConstantExport: true },
		],
		// indent: [2, 'tab'],
		// 'no-tabs': 0,
		quotes: ['error', 'single'],
		'space-infix-ops': ['error', { 'int32Hint': false }],
		'block-spacing': ['error', 'always'],
		'key-spacing': ['error', { 'beforeColon': false }],
		semi: ['error', 'never']
	},
	settings: {
		react: {
			version: 'detect'
		}
	}
}
