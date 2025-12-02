# Todo Demo

A Next.js application demonstrating authentication and database integration using Better Auth, Drizzle ORM, and PostgREST.

## Prerequisites

- **Node.js** (v18 or higher)
- **pnpm** - Package manager (install via `npm install -g pnpm`)
- **just** - Command runner (install via `cargo install just` or your system package manager)
- **Docker** and **Docker Compose** - For running PostgreSQL and PostgREST

## Installation

1. Clone the repository
2. Install dependencies using pnpm:
   ```bash
   pnpm install
   ```

## Development

To start development:

```bash
just dev
```

This will:
1. Start the PostgreSQL database
2. Run migrations
3. Seed the database
4. Fetch JWKS from the auth endpoint
5. Start PostgREST

Then run the Next.js dev server separately:

```bash
pnpm dev
```

### Database Management

To reset the database (drops volumes and recreates everything):

```bash
just reset
```

This is useful when you need to start fresh with a clean database state.

