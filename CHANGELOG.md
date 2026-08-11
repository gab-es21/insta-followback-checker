# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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

### Fixed

- `following.json` entries from a real Instagram export have no `value` on `string_list_data` — the username is on the entry's `title` instead. `flattenEntries` now falls back to `title` when `value` is absent, fixing every following-list account showing up as `undefined`.
