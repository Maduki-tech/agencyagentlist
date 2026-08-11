# Agency Agent Lookup

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

A searchable directory for the specialist AI agents in [`msitarzewski/agency-agents`](https://github.com/msitarzewski/agency-agents). Search by name, description, vibe, or path; filter by division; sort the results; and open the complete agent instructions in a readable detail view.

> The directory stays in sync with the upstream repository by fetching its data from GitHub at runtime. Agent markdown files are not copied into this repository.

## Features

- Live agent data from GitHub
- Search across names, descriptions, vibes, paths, and divisions
- Filter agents by division
- Sort by name or division
- Full markdown detail pages for every agent
- Server-side responses cached for one hour to reduce API requests
- Optional GitHub authentication for higher API rate limits

## Tech stack

- [Next.js 16](https://nextjs.org/) with the App Router
- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [Vitest](https://vitest.dev/) for tests

## Requirements

- [Node.js](https://nodejs.org/) 20.9.0 or newer
- [pnpm](https://pnpm.io/) 11 or newer

## Getting started

```bash
git clone https://github.com/Maduki-tech/agencyagentlist.git
cd agencyagentlist
pnpm install
cp .env.example .env.local
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Configuration

The app works without credentials because the upstream repository is public. To use a GitHub token for a higher API rate limit, add it to `.env.local`:

```env
GITHUB_TOKEN=your_token_here
```

A token with no additional scopes is sufficient for public repository access. Never commit `.env.local` or any other secret to the repository.

## Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start the development server |
| `pnpm build` | Create a production build |
| `pnpm start` | Start the production server |
| `pnpm lint` | Run ESLint |
| `pnpm test` | Run the Vitest test suite |

## How the data is loaded

The index is built on the server from the upstream `agency-agents` repository:

1. `divisions.json` provides division labels, icons, and colors.
2. GitHub's recursive Trees API finds markdown files in the configured divisions.
3. Raw GitHub content provides each agent's frontmatter and markdown body.
4. Next.js caches GitHub responses for 3,600 seconds.

The detail route fetches an agent's markdown on demand and renders it with GitHub-flavored Markdown support.

## Project structure

```text
src/
├── app/           Next.js routes and application layout
├── components/    Search controls, agent cards, and markdown rendering
└── lib/           GitHub access, domain types, indexing, and tests
```

## Contributing

Issues and pull requests are welcome. Before opening a pull request:

1. Create a branch for your change.
2. Install dependencies with `pnpm install`.
3. Run `pnpm lint`, `pnpm test`, and `pnpm build`.
4. Describe the change and any relevant upstream-data considerations.

## Attribution

This project is a browser for [Agency Agents](https://github.com/msitarzewski/agency-agents), which remains the source of the agent content. Please consult the upstream repository for the terms that apply to that content.

## License

The application code in this repository is available under the [MIT License](./LICENSE). The license for content fetched from the upstream Agency Agents repository is not changed by this project.
