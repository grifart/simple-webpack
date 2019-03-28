import {provideConfiguration} from "../../index";
import {WebpackOptions} from "webpack/declarations/WebpackOptions";
import * as path from "path";

export default provideConfiguration({
	entryPoint: './www/src/index.js',
	devServerDistPath: '/www/dist/',
	devServerContentBase: path.resolve(__dirname, 'www'), // must be here due to usage pre projects
	outputDirectory: path.resolve(__dirname+ '/www', 'dist'), // must be here due to usage per projects
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
