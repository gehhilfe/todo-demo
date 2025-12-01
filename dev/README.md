# postgREST Configuration Monitor

This directory contains a monitoring service that watches for changes to the `auth.jwks` table and automatically reloads postgREST configuration.

## How it works

1. The `postgrest-monitor` service polls the PostgreSQL database every 5 seconds
2. It detects changes to the `auth.jwks` table by comparing state hashes
3. When changes are detected, it sends a `SIGUSR2` signal to the postgREST container
4. postgREST reloads its configuration by re-executing the `postgrest.pre_config()` function

## Usage

Start all services:
```bash
docker-compose up -d
```

The monitor will automatically start and begin watching for changes.

## Configuration

Environment variables for the monitor service:
- `DB_HOST`: PostgreSQL host (default: `db`)
- `DB_PORT`: PostgreSQL port (default: `5432`)
- `DB_NAME`: Database name (default: `postgres`)
- `DB_USER`: Database user (default: `postgres`)
- `DB_PASSWORD`: Database password (default: `password`)
- `POSTGREST_CONTAINER_NAME`: Name of the postgREST container (auto-detected)
- `POLL_INTERVAL`: Polling interval in seconds (default: `5`)

