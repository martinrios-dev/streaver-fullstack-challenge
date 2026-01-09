# Assumptions

This document outlines the assumptions made for the Streaver Full-Stack Challenge implementation.

## API Behavior

- **userId filter is optional**: When the `userId` query parameter is not provided in the GET `/api/posts` endpoint, all posts from all users are returned.
- **Sorting**: Posts are returned sorted by `id` in descending order (newest first).
- **Error handling**: API endpoints return proper HTTP status codes (400 for validation errors, 404 for not found, 500 for server errors) with JSON payloads containing an `error` field.
- **Hard delete**: The DELETE `/api/posts/:id` endpoint performs a hard delete from the database (no soft delete/archiving).
- **No authentication required**: The API endpoints are publicly accessible without authentication or authorization checks.

## Development Setup

- **SQLite database location**: The database file is stored at `./prisma/dev.db` relative to the project root.
- **.env is committed**: The `.env` file is committed to the repository intentionally for this challenge/demo project. `.env*.local` files remain gitignored. In a real production environment, all environment files would be gitignored and secrets would be managed securely.
- **Database files are not committed**: The actual SQLite database files (`*.db`, `*.db-journal`) are gitignored to avoid committing binary data.
- **Package manager**: The project uses `pnpm` as the package manager (evidenced by `pnpm-lock.yaml`).
- Next.js was upgraded to a patched 15.1.x version due to security advisories affecting App Router applications.

## Data Seeding

- **Data source**: User and post data is fetched from `https://jsonplaceholder.typicode.com/users` and `https://jsonplaceholder.typicode.com/posts`.
- **Seeding strategy**: The seed script performs a full reset and re-import of data each time it runs, ensuring a consistent starting state.
- **Minimal persistence**: Only the fields required by the UI are persisted in the database (e.g., user address, company details, and other unused fields from the API are omitted).

## UI/UX Design

- **Design system**: Dark theme with minimalist, production-ready aesthetics using TailwindCSS.
- **Color scheme**: Primary color `#005CFF` (blue), base colors from Tailwind's `slate` palette.
- **No external UI libraries**: All components are built using TailwindCSS utilities only (no Shadcn, MUI, etc.).
- **Responsive design**: Mobile-first approach with breakpoints for tablet/desktop layouts.
- **Best-effort accessibility**: Semantic HTML, proper ARIA attributes, keyboard navigation support, and focus states are implemented throughout the application.

## Client-Side Caching

- **Caching strategy**: Posts are cached in `localStorage` with a 5-minute TTL (time-to-live).
- **Stale-while-revalidate**: When cache exists, cached data is shown immediately while a background refresh is triggered. This provides instant UI feedback and reduces perceived loading time.
- **Graceful degradation**: If the background refresh fails (e.g., network error), cached data is retained and the user is notified. This ensures the app remains functional under unstable network conditions.
- **Filter-aware caching**: Separate cache entries are maintained for different `userId` filter values to ensure consistency.
