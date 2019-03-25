import {provideConfiguration} from "../../index";
import {WebpackOptions} from "webpack/declarations/WebpackOptions";
import * as path from "path";

export default provideConfiguration({
	entry: './www/src/index.js',
	devServer: '/www/dist/',
	distPath: path.resolve(__dirname+ '/www', 'dist'), // must be here due to usage in different projects
	images: {
		enabled: true,
		optimize: true
	},
	scripts: {
		enabled: true
	},
	styles: {
		enabled: true,
		extract: true
	},
})
