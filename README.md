# Agency Agent Lookup

Browse every agent from [msitarzewski/agency-agents](https://github.com/msitarzewski/agency-agents) with search, division filters, sorting, and full markdown detail pages.

## Features

- Live data from GitHub (no vendored agent files)
- Search by name, description, vibe, or path
- Filter by division/type
- Sort by name or type
- Click any agent to read the full markdown

## Setup

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Optional: GitHub token

The app works without authentication for public repo access. For higher GitHub API rate limits during index builds, set:

```bash
GITHUB_TOKEN=your_token_here
```

## Scripts

- `pnpm dev` — start dev server
- `pnpm build` — production build
- `pnpm start` — run production server
- `pnpm lint` — ESLint

## Data source

Agent list is built from:

1. `divisions.json` for division labels and colors
2. GitHub Trees API for all `.md` files under division folders
3. Raw GitHub content for frontmatter and markdown bodies

Responses are cached server-side for one hour.
# agencyagentlist
