# New Chronos Back Office

## Node Version 20.10.0

## Scripts

### First-Time Run
```
pnpm install
pnpm run compile
pnpm start
```

###  Visualize Rollup Bundled File Size
```
pnpm run analyze
```
(must install serve with ```pnpm i -g serve```)


## Packages

### Tremor/React (for Charts and UI)
- [Docs](https://www.tremor.so/)
- [Github](https://github.com/tremorlabs/tremor)

### LingUI/React (for Translations)
- [Docs](https://lingui.dev/)
- [Github](https://github.com/lingui/js-lingui)


### React JVectormap
- [Github](https://github.com/kadoshms/react-jvectormap)

### useSWR
- [Docs](https://swr.vercel.app/)
- [Github](https://github.com/vercel/swr)

## Useful VSCode Extensions
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Tailwindcss-IntelliSence](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)
- [Gettext](https://marketplace.visualstudio.com/items?itemName=mrorz.language-gettext) for PO files


(Additional References)
# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
}
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list
