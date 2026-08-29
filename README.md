# Vediq Website

Marketing site for Vediq — an AI-powered command center and point-of-care sidecar for value-based care, supporting Traditional Medicare (ACO REACH, LEAD, MSSP), Medicare Advantage, and Medicaid Managed Care programs.

## Stack

- [Next.js](https://nextjs.org/) 16 (App Router) on [vinext](https://github.com/vitejs/vite-plugin-react) — a beta Vite/React Server Components toolchain
- React 19
- Tailwind CSS 4
- TypeScript
- Deployed via [Cloudflare Workers](https://developers.cloudflare.com/workers/) (`wrangler`)

## Getting started

Requires Node.js 22.13.0 or later.

```bash
npm install
npm run dev
```

The dev server runs at `http://localhost:3001` by default.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the local dev server |
| `npm run build` | Build for production |
| `npm run start` | Run the production build locally |
| `npm run lint` | Run ESLint |

## Project structure

```
app/
  page.tsx              Homepage
  layout.tsx             Root layout
  globals.css             Global styles
  demo/page.tsx           Request-a-demo form (mailto submission)
  contact/page.tsx        Contact page
  components/
    Header.tsx             Site header / nav
    Footer.tsx              Site footer
public/                  Static assets (favicon, OG image)
```

## License

Proprietary — © 2026 Vediq Ltd. All rights reserved.
