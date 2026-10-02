# More Likely

A fast browser game about making decisions under uncertainty.

More Likely gives the player a small amount of information, asks them to choose which of two outcomes is more likely, and then decide how much of their bankroll to risk.

The core idea is simple:

> A good decision can have a bad outcome, and a bad decision can have a good outcome.

The game should build intuition for probability and risk without feeling like a math exercise.

## Core loop

> Read → choose A or B → choose a stake → reveal → continue

The experience should be fast, clear, responsive, and enjoyable on both mobile and desktop.

## Current stage

The project starts with a very small playable version containing only a few carefully designed rounds.

The immediate goal is to validate the core game feel before expanding content or mechanics.

See:

- [SPEC.md](SPEC.md) — current product definition and boundaries
- [AGENTS.md](AGENTS.md) — how to work in this repository

## Direction

The game is intended to:

- run entirely in the browser;
- work well on mobile and desktop;
- be deployable as a static site on GitHub Pages;
- use Polish as the default player language, with English added later;
- keep code and developer documentation in English.

## Development

Node.js 24 is required.

```bash
npm install
npm run dev
```

| Script | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server. |
| `npm run build` | Production build to `dist/`. |
| `npm run test` | Run the tests once with Vitest. |
| `npm run typecheck` | Type-check the project with TypeScript. |
| `npm run lint` | Check code and formatting with Biome. |
| `npm run format` | Format code with Biome. |
| `npm run verify` | Quality gate: lint, typecheck, test, build. |

## License

MIT
