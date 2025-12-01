# Development environment commands

# Start the development environment (database)
dev:
    @just db-start
    @just db-migrate
    @echo "Development environment ready!"

# Start the database
db-start:
    @docker compose -f dev/docker-compose.yaml up -d
    @just db-wait

# Wait for database to be ready
db-wait:
    @echo "Waiting for database to be ready..."
    @until docker compose -f dev/docker-compose.yaml exec -T db pg_isready -U postgres > /dev/null 2>&1; do \
        echo "Database is not ready yet, waiting..."; \
        sleep 1; \
    done
    @echo "Database is ready!"

# Stop the database
db-stop:
    @docker compose -f dev/docker-compose.yaml down

# Run database migrations using Drizzle
db-migrate:
    @echo "Running database migrations..."
    @pnpm db:migrate
    @echo "Migrations complete!"

# Seed the database
db-seed:
    @echo "Seeding database..."
    @docker compose -f dev/docker-compose.yaml exec -T db psql -U postgres -d postgres < drizzle/seed/seed.sql
    @echo "Database seeded!"

# Reset the database (drop volumes and recreate)
db-reset:
    @echo "Resetting database..."
    @docker compose -f dev/docker-compose.yaml down -v
    @just db-start
    @just db-migrate
    @just db-seed
    @echo "Database reset complete!"

# View database logs
db-logs:
    @docker compose -f dev/docker-compose.yaml logs -f db

# Generate new migration files
db-generate:
    @pnpm db:generate

