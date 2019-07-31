# simple-webpack

A simple webpack configration for simple websites


## Setup

```bash
yarn init
yarn add https://github.com/grifart/simple-webpack.git
```

Add scripts to your package.json

`package.json`
```json
{
	"scripts": {
		"build": "webpack --mode production",
		"dev": "webpack-dev-server --mode development --open"
	}
}
```

Configure TypeScript, there are `base` and `strict` pre-configrations available:

`tsconfig.json`
```json
{
	"extends": "node_modules/@grifart/simple-webpack/typescript/tsconfig.strict.json"
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
	paths: {
		applicationEntryPointFile: "js/main.js",
		distributionDirectory: "dist",
		publicContentRoot: "."
	}
}, __dirname)

```
