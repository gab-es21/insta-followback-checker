# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0] - 2026-08-11

### Added

- Upload an Instagram "Download Your Information" export (ZIP or loose JSON files) and parse it entirely client-side.
- Categorize accounts into **Mutual**, **Not Following Back**, and **Fans**.
- Search within the active category by username.
- Export the currently visible (filtered) rows to CSV.
- Click-through links to each account's Instagram profile.
- Project scaffolding: repository, branching model, CI, license, and contributor docs per the `project-rules` conventions.
- Redesigned UI: gradient brand mark/wordmark, per-category accent colors, letter avatars, and inline icons throughout, in a cleaner Instagram-inspired visual style (light/dark).
- A persistent sidebar footer with the privacy note and drop-file instructions, always visible regardless of app state.
- An in-app "How to export your data" guide, opened from the sidebar, walking through requesting the official Instagram data export.
- Deployed to GitHub Pages so the app is usable directly from a link, with no install required; link added to the top of the README.
- Virtualized the account list (`@tanstack/react-virtual`) so it only renders visible rows — verified smooth scrolling through a synthetic 3,000-account list with just 20-30 DOM rows mounted at a time.
- A keep/unfollow triage workflow on each account row: ✓ marks an account as kept, ✗ marks it as unfollowed (i.e. you handled it manually on Instagram — this app never unfollows anything itself). Each category gets `Kept`/`Unfollowed` sub-views in the sidebar with live counts, so you can review a batch, close the tab, and pick up where you left off instead of re-scrolling past decisions you've already made.
- An opt-in "Save my export and choices on this browser" toggle, off by default. When on, both the parsed export and your triage marks survive a refresh (no re-upload needed); when off, nothing is written to `localStorage` and anything previously stored is actively cleared the moment you turn it off — not just left stale.
- An "Erase Data" button in the sidebar, below Reset: clears the loaded export *and* every kept/unfollowed mark (in memory and in storage), behind a confirmation prompt. Distinct from Reset, which deliberately keeps triage marks so you can re-upload a fresher export without losing your progress.

### Changed

- Renamed the sidebar's "Upload New" button to "Reset" — it clears back to the empty state rather than opening a file picker directly, which "Reset" signals more accurately.

### Fixed

- `following.json` entries from a real Instagram export have no `value` on `string_list_data` — the username is on the entry's `title` instead. `flattenEntries` now falls back to `title` when `value` is absent, fixing every following-list account showing up as `undefined`.
- Turning the "remember" toggle off wasn't clearing the in-memory triage marks (only the `localStorage` copy) — old marks from earlier in the same session could resurface after a Reset and re-upload even with the toggle off.
