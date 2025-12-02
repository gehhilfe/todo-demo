# Development environment commands
set unstable := true
# Set the shell to bash and enable error handling
set shell := ["bash", "-c"]

# Start the development environment (database)
dev:
    @just start-db
    @just migrate
    @just seed
    @just get-jwks
    @just start-postgrest
    @echo "Development environment ready!"

[script("bash")]
get-jwks:
    set -euo pipefail
    APP_PID=""
    INTERRUPTED=false

    interrupt() {
        echo ""
        echo "==> Interrupted..."
        INTERRUPTED=true
        cleanup
        exit 1
    }
    trap interrupt INT

    cleanup() {
        echo ""
        echo "==> Cleanup initiated..."

        # Only kill if started
        if [[ -n "${APP_PID}" ]] && ps -p "${APP_PID}" >/dev/null 2>&1; then
            echo "   Stopping dev server (PID $APP_PID)..."
            kill -TERM -"${APP_PID}" 2>/dev/null || true
            wait "${APP_PID}" 2>/dev/null || true
            echo "   Dev server stopped."
        else
            echo "   Dev server was not running."
        fi

        echo "==> Cleanup complete."
    }
    trap cleanup EXIT ERR

    setsid pnpm dev &
    APP_PID=$!

    # Wait for the server to be ready
    until curl -s http://localhost:3000/api/auth/jwks > /dev/null 2>&1; do
          $INTERRUPTED && exit 1
          echo "   JWK not available yet..."; \
          sleep 1; \
    done

# Start the database
start-db:
    @docker compose -f dev/docker-compose.yaml up -d db
    @just wait-db

start-postgrest:
    @docker compose -f dev/docker-compose.yaml up -d postgREST
    @echo "PostgREST started!"

# Wait for database to be ready
wait-db:
    @echo "Waiting for database to be ready..."
    @until docker compose -f dev/docker-compose.yaml exec -T db pg_isready -U postgres > /dev/null 2>&1; do \
        echo "Database is not ready yet, waiting..."; \
        sleep 1; \
    done
    @echo "Database is ready!"

# Stop the database
stop:
    @docker compose -f dev/docker-compose.yaml down

# Run database migrations using Drizzle
migrate:
    @echo "Running database migrations..."
    @pnpm db:migrate
    @echo "Migrations complete!"

# Seed the database
seed:
    @echo "Seeding database..."
    @docker compose -f dev/docker-compose.yaml exec -T db psql -U postgres -d postgres < drizzle/seed/seed.sql
    @echo "Database seeded!"

# Reset the database (drop volumes and recreate)
reset:
    @echo "Resetting database..."
    @docker compose -f dev/docker-compose.yaml down -v --remove-orphans

# View database logs
logs:
    @docker compose -f dev/docker-compose.yaml logs -f db

# Generate new migration files
generate:
    @pnpm db:generate

