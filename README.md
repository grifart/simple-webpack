# Simple WebPack

TypeScript, Babel, WebPack, SASS, Imagemin, hot-reload and more. They speed up development, but they take time to configure. Not anymore. 

There should be a simple WebPack configuration for simple website.

## Setup

Init yarn and add simple webpack.

```bash
yarn init
yarn add --dev https://github.com/grifart/simple-webpack.git
```

Add scripts to your package.json, so you can then use `yarn run build` and `yarn run dev`

`package.json`
```json
{
	"scripts": {
		"build": "webpack --mode production",
		"dev": "webpack-dev-server --mode development --open"
	}
}
```

Configure TypeScript if you want to use it. There are `base` and `strict` presets available:

`tsconfig.json`
```json
{
	"extends": "./node_modules/@grifart/simple-webpack/typescript/tsconfig.base.json"
}
```

`webpack.config.ts`
```typescript
import {provideConfiguration} from '@grifart/simple-webpack';

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
		enabled: false,
	},
	paths: {
		applicationEntryPointFile: "js/main.js",
		distributionDirectory: "dist",
		publicContentRoot: "."
	}
}, __dirname)

```

## Examples

Examples are in [`tests/`](tests/) folder. Each of these examples are checked on every push, so we make sure that project is as-backward-compatible as possible. And if not, there is always simple way how to [migrate to newer version](https://github.com/grifart/simple-webpack/commit/66350728d62c4a03c9d4c675a5025fc780a2a634#diff-04c6e90faac2675aa89e2176d2eec7d8).

