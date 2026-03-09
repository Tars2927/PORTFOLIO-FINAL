# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

## Secure deployment checklist

1. Copy `.env.example` to `.env` and set real values.
2. Set `NODE_ENV=production` in production.
3. Set `CONTACT_ALLOWED_ORIGINS` to your deployed frontend origin(s), comma-separated.
4. Keep `.env` out of git (already covered by `.gitignore`).
5. Rotate SMTP credentials if they were ever committed.
6. Deploy the API behind HTTPS and reverse proxy.

## Blog via GitHub

1. In your GitHub repo, create a JSON file for posts (example schema: `content/blog-posts.sample.json`).
2. For private repos, configure server-side env vars in `.env`:
   - `BLOG_GITHUB_OWNER`
   - `BLOG_GITHUB_REPO`
   - `BLOG_GITHUB_BRANCH`
   - `BLOG_GITHUB_PATH`
   - `BLOG_GITHUB_TOKEN` (fine-grained token with repository contents read access)
3. Set `VITE_BLOG_SOURCE=api` so the frontend reads posts from `/api/blog`.
4. The server fetches GitHub content securely and caches it in memory.
5. If remote fetch fails, the frontend automatically falls back to local posts in `src/data/blogPosts.ts`.
6. Each post can use either:
   - `markdown` (string, recommended), or
   - `content` (string array or newline-separated string, legacy format).

Public repo option:
- Set `VITE_BLOG_SOURCE=github` and fill `VITE_BLOG_GITHUB_*` values to fetch directly from GitHub raw content.
