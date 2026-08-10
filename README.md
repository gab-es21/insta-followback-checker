# FollowCheck

Find out who you follow on Instagram that doesn't follow you back — without giving any app your login, and without anything ever leaving your browser.

Unlike tools that scrape Instagram's private API through a logged-in session (risking your account getting flagged), FollowCheck works entirely from Instagram's own official data export. You download your data from Instagram, drop it into this app, and everything is parsed and compared locally in your browser. There is no backend, no login, and no network request involving your data at any point.

## Features

- Upload the full Instagram data export ZIP, or just the loose `following.json` / `followers_*.json` files
- Categorizes every account into **Mutual**, **Not Following Back**, and **Fans** (they follow you, you don't follow them)
- Search within the active category
- Export the currently visible list to CSV
- Click through to any profile on Instagram
- 100% client-side — your follower/following data is never uploaded anywhere

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Installation

```bash
npm install
npm run dev
```

Then open the printed local URL in your browser.

### Getting your Instagram data export

1. In the Instagram app or on instagram.com: **Settings → Your Activity → Download Your Information**
2. Choose **Some of your information → Followers and following**
3. Select **JSON** as the format
4. Wait for Instagram to email you the export, then download it
5. Drop the ZIP (or the loose JSON files from `connections/followers_and_following/`) onto FollowCheck

## Usage

- Once your export is loaded, use the sidebar to switch between **Not Following Back**, **Mutual**, and **Fans**
- Use the search bar to filter the current category by username
- Click **Export CSV** to download the currently visible (filtered) list
- Click **Upload New** in the sidebar to load a different export

## File Structure

```
src/
  types/instagram.ts   # shared types for the Instagram export shapes and parsed accounts
  lib/
    parseExport.ts      # ZIP/JSON parsing of the Instagram export
    diff.ts              # mutual / not-following-back / fans categorization
    dataset.ts           # parseExport + diff orchestration
    search.ts            # in-category username search
    csv.ts                # CSV serialization + download
    normalizeUsername.ts # case-insensitive comparison key
    errors.ts             # ParseError
  state/
    AppContext.tsx       # app state (loaded dataset, active category, search term)
  components/
    Sidebar.tsx, MainPane.tsx, UploadZone.tsx, SearchBar.tsx,
    FollowList.tsx, FollowListItem.tsx, ExportCsvButton.tsx,
    EmptyState.tsx, ErrorBanner.tsx, ErrorBoundary.tsx
fixtures/               # sample export JSON used by the test suite
```

## Testing

```bash
npm run test
```

Unit tests cover the export parser (both known `followers_*.json` shapes, malformed input, multi-file merging/de-duping), the categorization diff (including case-insensitive username matching), and CSV export.
