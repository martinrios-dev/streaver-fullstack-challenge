# Streaver Full-Stack Challenge

A Next.js application with Prisma ORM and SQLite database.

## Prerequisites

- Node.js 18+ 
- pnpm (recommended)

## How to Run

1. **Install dependencies**:
   ```bash
   pnpm install
   ```

2. **Run database migrations**:
   ```bash
   pnpm db:migrate
   ```

3. **Seed the database**:
   ```bash
   pnpm db:seed
   ```

4. **Start the development server**:
   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm db:migrate` - Run Prisma migrations
- `pnpm db:seed` - Seed the database
- `pnpm db:studio` - Open Prisma Studio
- `pnpm db:reset` - Reset database and re-run migrations

## Database

This project uses:
- **ORM**: Prisma
- **Database**: SQLite
- **Database file**: `./prisma/dev.db`

The `.env` file is committed for demo purposes (challenge requirement). The database file itself (`*.db`) is gitignored.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite + Prisma ORM
