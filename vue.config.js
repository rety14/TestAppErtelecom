module.exports = {
	productionSourceMap: false,

	configureWebpack: {
		performance: {
			hints: false
		},
		plugins: []
	},

	pluginOptions: {
		svgSprite: {
			dir: 'src/assets/svg',
			test: /\.(svg)(\?.*)?$/,
			loaderOptions: {
				extract: true,
				spriteFilename: 'img/svg.[hash:6].svg'
			},
			pluginOptions: {
				plainSprite: true
			}
		}
	},

	chainWebpack: config => {
		// Переключение линтера на codeframe
		config.module.rule('eslint').use('eslint-loader').options({
			formatter: require('eslint').CLIEngine.getFormatter('codeframe')
		})

		config.module.rule('svg-sprite').use('svgo-loader').loader('svgo-loader')
	}
}
