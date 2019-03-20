import {provideConfiguration} from "../../index";
import {WebpackOptions} from "webpack/declarations/WebpackOptions";

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
	}
})
