import {provideConfiguration, SimpleWebPackConfig_v1_Paths_DEFAULT} from "../../index";

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
	copy: {
		enabled: false
	},
	paths: SimpleWebPackConfig_v1_Paths_DEFAULT
}, __dirname)
