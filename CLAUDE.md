# CLAUDE.md

Context for any LLM/agent session (Claude Code or otherwise) working on this repo.

This project follows the global rules in `project-rules/PROJECT_RULES.md` (gab-es21's cross-project conventions: git/branching model, CI, testing, security, docs). Follow those in addition to the project-specific notes below.

## What this app is

FollowCheck — lets a user see which Instagram accounts they follow don't follow them back, by diffing Instagram's own official "Download Your Information" data export (ZIP or loose JSON). Entirely client-side, no backend, no login, no scraping, no live API.

This was a deliberate design decision, not a limitation to "fix" later. During planning, existing open-source tools for this problem were surveyed and split into two camps: (a) scripts/apps that diff the official data export (safe), and (b) bookmarklets that run in a logged-in Instagram session against Instagram's internal API, some with batch-unfollow (risks ToS violation and account bans). This project deliberately took approach (a). Closest prior art considered: [zxyandreay/followback-checker](https://github.com/zxyandreay/followback-checker) (same safe approach, plainer UI — this project's explicit goal was the same safety with a better-designed UI) and [agusmoles/instagram-unfollowers](https://github.com/agusmoles/instagram-unfollowers) (the rejected live-scraping approach).

## Tech stack

- Vite + React 19 + TypeScript, npm (not pnpm/yarn).
- oxlint (lint, ships with the current Vite react-ts template in place of eslint) + `tsc` (types) + Vitest + React Testing Library (tests).
- JSZip for in-browser ZIP extraction.
- No backend, no database, no server-rendering — static bundle only.

## Commands

| Task | Command |
|---|---|
| Install | `npm install` |
| Dev server | `npm run dev` |
| Build | `npm run build` |
| Lint | `npm run lint` |
| Type check | `npx tsc -b` |
| Tests | `npm run test` |

## v1 scope

**Built:** upload (ZIP or loose JSON files) → parse → categorize into **Mutual** / **Not Following Back** / **Fans** → search within the active category → export the currently visible (filtered) rows to CSV.

**Explicitly deferred to a future v2 — do not add these without discussing scope first, they were cut on purpose:**
- History tracking across visits (e.g. IndexedDB snapshots showing what changed since the last upload)
- Follow-date sorting/insights in the UI (the export's `timestamp` is parsed and included in CSV export, but intentionally not surfaced as a sort/insight in the list view yet)
- A keep/unfollow triage workflow (mark accounts, persisted checklist)
- Any live Instagram API integration or scraping, including for avatars — the export has no profile pictures, so don't add an "avatar" feature that requires fetching from Instagram

## Things to know before changing behavior

- **No backend, ever, by design.** 100%-client-side processing isn't just an implementation detail, it's the app's core trust/privacy pitch (your follower data never leaves your browser). Don't introduce a server component, analytics beacon, or any network call involving parsed account data without discussing it first.
- **The `followers_*.json` dual-shape handling is unverified against a real Instagram export.** `parseFollowersJson` in `src/lib/parseExport.ts` accepts both a bare top-level array and a `{ relationships_followers: [...] }` wrapper, because Meta has changed this shape historically and no real export was available while building this. All fixtures under `fixtures/` are hand-written, not sampled from a real export. The first time someone runs a real Instagram export through the app, re-verify the shape and update `fixtures/`/tests if reality differs from what's assumed.
- **Username matching is case-insensitive; display is not.** `normalizeUsername()` (trim + lowercase) is a comparison-only key used for Map lookups, search, and de-duping — every place that renders a username or builds a profile link uses the original `Account.username`/`href` from the export, preserving the user's actual casing. Don't normalize a value that gets rendered.
- **CSV export is scoped to the visible list, not the whole category.** `ExportCsvButton` receives the post-search-filtered accounts as a prop, by design — a user searching "john" and clicking export should get only matching rows, not the entire category.
- **Multi-file followers merging de-dupes by normalized username, first-seen-wins.** Both `mergeFollowersFiles` (across `followers_1.json`, `followers_2.json`, etc.) and `computeCategories` (within a single list) use this same pattern via a `Map` — keep it consistent if either changes.
- **Parsing errors must never throw raw.** Anything that can fail (`JSON.parse`, unexpected shape, missing file) is caught and rewrapped as a `ParseError` (`src/lib/errors.ts`) with a message naming the offending filename, surfaced via `ErrorBanner` — never let a parse failure become an unhandled rejection or blank screen. `ErrorBoundary` in `main.tsx` is a last-resort safety net for anything else.
- **MIT-licensed, with CI enforced.** `LICENSE` and `.github/workflows/ci.yml` exist per `project-rules` — don't remove either without being asked.
- **`tsconfig.app.json` has `erasableSyntaxOnly: true` and `verbatimModuleSyntax: true`.** No TS enums with values, no constructor parameter-property shorthand (`constructor(public x: T)`), no namespaces with runtime code — and every type-only import must use `import type { ... }`. This is why `ParseError` assigns `cause` in the constructor body instead of using parameter properties.

## File structure

See `README.md`'s "File Structure" section — it's kept accurate for end users and doubles as the map for this codebase; don't duplicate it here, keep it updated in one place.
