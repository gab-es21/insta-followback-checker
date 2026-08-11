# Contributing to FollowCheck

Thanks for taking a look — this is a small, solo-maintained project, but contributions, bug reports, and ideas are welcome.

## Before you start

FollowCheck's whole trust pitch is **100% client-side, no backend, ever**. Your follower data never leaves your browser, and there's no live Instagram API integration (that's the risky "scrape a logged-in session" approach this project deliberately avoids — see the README). Please keep that constraint in mind for any change you propose; PRs that introduce a server component, analytics, or a live Instagram network call will be declined.

If you're planning something bigger than a small fix — a new feature, a UI overhaul, a new dependency — **open an issue first** to discuss scope before writing code. Smaller fixes (typos, bugs, test gaps) can just go straight to a PR.

## Getting set up

```bash
git clone https://github.com/gab-es21/insta-followback-checker.git
cd insta-followback-checker
npm install
npm run dev
```

Requires Node.js 22+ (see the README for why).

## Workflow

- `main` is stable/releasable only — never commit directly to it.
- `alpha` is the integration branch. All feature branches target `alpha` via PR.
- Branch names: `feature/<short-name>` or `fix/<short-name>`, cut from `alpha`.
- Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `docs:`, `test:`, `refactor:`, `chore:`, `ci:`).
- A PR is mergeable when: code works, tests pass, coverage stays at or above 80%, and docs (README/CHANGELOG) are updated in the same PR — not left for later.

## Before opening a PR

```bash
npm run lint        # oxlint
npx tsc -b          # type check
npm run test:coverage  # tests + coverage gate
npm run build        # production build
```

All four should be clean. CI runs the same checks on every PR.

## Tests

- New behavior needs tests in the same PR — a PR without tests for what it adds won't be merged.
- Tests live next to the code they cover (`Component.test.tsx`, `module.test.ts`).
- The coverage gate is enforced in `vitest.config.ts` — don't lower it to make a PR pass.

## Code conventions

- TypeScript, `import type { ... }` for type-only imports (`verbatimModuleSyntax` is on).
- No TS enums with values, no constructor parameter-property shorthand (`erasableSyntaxOnly` is on).
- oxlint enforces style — don't hand-roll formatting rules in review.
- See [`CLAUDE.md`](CLAUDE.md) for the non-obvious "things to know before changing behavior" (export parsing quirks, the triage/persistence model, etc.) — it's written for AI agents but is equally useful context for human contributors.

## Reporting bugs / requesting features

Open a GitHub issue. For bugs, include your browser, and if it's export-parsing related, a description of the export shape if you can share it (please don't attach real personal data).
