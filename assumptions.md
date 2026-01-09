# Assumptions

This document outlines the assumptions made for the Streaver Full-Stack Challenge implementation.

## API Behavior

- **userId filter is optional**: When the `userId` query parameter is not provided in the GET `/api/posts` endpoint, all posts from all users are returned.
- **Hard delete**: The DELETE `/api/posts/:id` endpoint performs a hard delete from the database (no soft delete/archiving).
- **No authentication required**: The API endpoints are publicly accessible without authentication or authorization checks.

## Development Setup

- **SQLite database location**: The database file is stored at `./prisma/dev.db` relative to the project root.
- **.env is committed**: The `.env` file is committed to the repository because this is a challenge/demo project. In a real production environment, this file would be gitignored and secrets would be managed securely.
- **Database files are not committed**: The actual SQLite database files (`*.db`, `*.db-journal`) are gitignored to avoid committing binary data.
- **Package manager**: The project uses `pnpm` as the package manager (evidenced by `pnpm-lock.yaml`).

## Data Seeding

- **Data source**: User and post data is fetched from `https://jsonplaceholder.typicode.com/users` and `https://jsonplaceholder.typicode.com/posts`.
- **Seeding strategy**: The seed script performs a full reset and re-import of data each time it runs, ensuring a consistent starting state.
- **No data transformation**: User and post data is stored as-is from the API, preserving original IDs and structure.

## UI/UX Design

- **Design system**: Dark theme with minimalist, production-ready aesthetics using TailwindCSS.
- **Color scheme**: Primary color `#005CFF` (blue), base colors from Tailwind's `slate` palette.
- **No external UI libraries**: All components are built using TailwindCSS utilities only (no Shadcn, MUI, etc.).
- **Responsive design**: Mobile-first approach with breakpoints for tablet/desktop layouts.
- **Accessibility**: Semantic HTML, proper ARIA labels, keyboard navigation support, and focus states are implemented where applicable.
