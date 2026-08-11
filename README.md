# FollowCheck

**[Open FollowCheck →](https://gab-es21.github.io/insta-followback-checker/)** — runs entirely in your browser, nothing to install.

Find out who you follow on Instagram that doesn't follow you back — without giving any app your login, and without anything ever leaving your browser.

Unlike tools that scrape Instagram's private API through a logged-in session (risking your account getting flagged), FollowCheck works entirely from Instagram's own official data export. You download your data from Instagram, drop it into this app, and everything is parsed and compared locally in your browser. There is no backend, no login, and no network request involving your data at any point.

## Features

- Upload the full Instagram data export ZIP, or just the loose `following.json` / `followers_*.json` files
- Categorizes every account into **Mutual**, **Not Following Back**, and **Fans** (they follow you, you don't follow them)
- Search within the active category
- Export the currently visible list to CSV
- Click through to any profile on Instagram
- Mark accounts as **kept** or **unfollowed** as you go through them — each category gets `Kept`/`Unfollowed` sub-views in the sidebar with live counts, so you can review a batch and pick up where you left off later (useful since Instagram rate-limits how many accounts you can unfollow per day)
- An in-app **"How to export your data"** guide walking through requesting the official export from Instagram
- Optional, off-by-default "remember" toggle to keep your export and triage marks on this browser across sessions — everything stays local either way
- Handles large exports smoothly — the account list only renders visible rows, verified against a synthetic 3,000-account list
- 100% client-side — your follower/following data is never uploaded anywhere

## Getting Started

### Prerequisites

- Node.js 22+ (the test suite's jsdom/undici dependency needs a newer `structuredClone` webidl API than Node 20 ships)
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
- Click the ✓ or ✗ on a row to mark that account as kept or unfollowed — a `Kept`/`Unfollowed` sub-view appears under that category in the sidebar; the category itself always shows what's still unreviewed
- Click **Export CSV** to download the currently visible (filtered) list
- Turn on **"Save my export and choices on this browser"** in the sidebar if you want this to survive a refresh — it's off by default, so nothing is kept unless you opt in
- Click **Reset** in the sidebar to load a different export — this keeps your kept/unfollowed marks, since the point is usually to load a fresher export without losing your progress
- Click **Erase Data** to wipe the loaded export *and* every kept/unfollowed mark, in memory and in storage — this is the one that actually starts you over from nothing (confirmation required, can't be undone)
- Click **How to export your data** in the sidebar for a walkthrough of requesting your export from Instagram

## File Structure

```
src/
  types/instagram.ts   # shared types for the Instagram export shapes, parsed accounts, and triage
  lib/
    parseExport.ts      # ZIP/JSON parsing of the Instagram export
    diff.ts              # mutual / not-following-back / fans categorization
    dataset.ts           # parseExport + diff orchestration
    search.ts            # in-category username search
    csv.ts                # CSV serialization + download
    normalizeUsername.ts # case-insensitive comparison key
    categories.ts         # category display labels/order
    triage.ts             # kept/unfollowed marks: view filtering, counts, localStorage
    persistence.ts        # remember-session preference + persisted dataset (localStorage)
    errors.ts             # ParseError
  state/
    AppContext.tsx       # app state (dataset, active category, search term, triage, how-to)
  components/
    Sidebar.tsx, MainPane.tsx, UploadZone.tsx, SearchBar.tsx,
    FollowList.tsx, FollowListItem.tsx, ExportCsvButton.tsx,
    HowToGuide.tsx, EmptyState.tsx, ErrorBanner.tsx, ErrorBoundary.tsx,
    icons.tsx             # small inline SVG icon set
fixtures/               # sample export JSON used by the test suite
```

## Testing

```bash
npm run test
```

Tests cover the export parser (both known `followers_*.json` shapes, malformed input, multi-file merging/de-duping), the categorization diff (including case-insensitive username matching), CSV export, the triage/persistence logic (including that turning "remember" off actively clears storage, not just stops saving), and the UI components/flows via React Testing Library.

## Contributing

Bug reports, ideas, and PRs are welcome — see [CONTRIBUTING.md](CONTRIBUTING.md) for the branching model, coding conventions, and how to get set up locally.
