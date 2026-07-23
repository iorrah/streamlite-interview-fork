# StreamLite

A tiny streaming home page shared by two brands, **Paramount+** and **Pluto TV**. Brand behavior (name, theme, which rows appear) is driven by the config in [src/config.ts](src/config.ts) — components never hardcode brand checks.

## Getting started

```bash
npm install
npm run dev          # open http://localhost:5173 (add ?brand=ptv to switch brand)
npm test             # run the unit tests
```

## Project structure

```
src/
├── App.tsx              # home page — renders content rows based on brand config
├── ContentRow.tsx       # a titled, horizontally scrolling row of shows
├── ContentRow.test.tsx
├── api.ts               # show catalog + fetchContinueWatching()
├── config.ts            # per-brand config ("blueprints") + getBrand/getConfig helpers
└── styles.css
```

## Your task: add a "Continue Watching" row

Signed-in users should see the shows they're partway through at the top of the home page.

1. Add a **Continue Watching** row above the other rows, using `fetchContinueWatching()` from [src/api.ts](src/api.ts) as the data source.
2. The row must only appear for brands where the `features.continueWatching` config flag is enabled (it's on for Paramount+, off for Pluto TV). Don't hardcode brand names in components — use the config.
3. Handle the time before the data arrives sensibly.

Follow the existing patterns in the codebase, and don't add new dependencies.

**Stretch goals** (only if you have time left):

- Show how far along each item is (`progress` is a 0–1 fraction).
- Anything else you'd improve — walk us through it.
