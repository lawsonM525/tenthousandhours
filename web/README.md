## 10,000hours.com Web Experience

This package contains the marketing and product overview site for [10,000hours.com](https://tenthousandhours.com) built with the Next.js App Router and Tailwind CSS. It translates the product planning documents into a responsive dark UI that mirrors the timer, insights, timeline, and category management flows captured in the design references.

### Features

- Hero section with mastery-focused messaging and a live timer showcase
- Interactive focus command palette, session review, and AI insights highlights
- Timeline, analytics, and category management previews that reflect the core product pillars
- Tailwind-driven dark theme following the design tokens from the planning docs

### Local development

```bash
npm install
npm run dev
```

The site will be available at [http://localhost:3000](http://localhost:3000). Edits in `src/app` and `src/components` will hot-reload automatically.

### Linting

```bash
npm run lint
```

ESLint is configured with the Next.js defaults to keep the UI consistent and accessible.

### Deployment

Deploy the `web` app to any platform that supports Next.js 14+ (Vercel, Netlify, Fly.io, etc.). Be sure to set the build command to `npm run build` and the output directory to `.next`.
