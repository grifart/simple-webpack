import {provideConfiguration} from "../../index";

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
		enabled: true,
		pattern: /.(txt|pdf|csv)$/
	},
	paths: {
		applicationEntryPointFile: "sources/index.ts",
		distributionDirectory: "www/dist",
		publicContentRoot: "www"
	}
}, __dirname)
