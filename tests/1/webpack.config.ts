import {provideConfiguration, SimpleWebPackConfig_v1_Paths_DEFAULT} from "../../index";
import {WebpackOptions} from "webpack/declarations/WebpackOptions";
import * as path from "path";

export default provideConfiguration({

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
	paths: SimpleWebPackConfig_v1_Paths_DEFAULT
}, __dirname)
