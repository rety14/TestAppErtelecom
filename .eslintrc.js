module.exports = {
	root: true,
	env: {
		node: true
	},
	'extends': [
		'plugin:vue/essential',
		'@vue/standard'
	],
	rules: {
		'no-console': 'off',
		'no-debugger': 'error',
		'indent': ['error', 'tab', {"SwitchCase": 1}],
		'no-tabs': 0,
		'space-before-function-paren': 0,
		'object-curly-spacing': 0
	},
	parserOptions: {
		parser: 'babel-eslint'
	}
}
