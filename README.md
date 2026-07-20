# Vile Diesin — portable static site

This is a standalone React/Vite version of the Vile Diesin website. It has no OpenAI Sites, Vinext, Cloudflare Worker, database, or authentication dependency.

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

The deployable static site is generated in `dist/`.

## Hosting

Use these settings on most static hosts:

- Build command: `npm run build`
- Publish/output directory: `dist`
- Node.js: 20 or newer

Compatible targets include Netlify, Vercel, Cloudflare Pages, GitHub Pages, Render Static Sites, AWS S3/CloudFront, and ordinary web servers.

For GitHub Pages under a repository subpath, set Vite's `base` option in `vite.config.ts` to the repository name, such as `base: "/my-repository/"`.

## Main editing files

- `src/App.tsx` — content and interactions
- `src/styles.css` — design and responsive layout
- `public/` — fonts and images

