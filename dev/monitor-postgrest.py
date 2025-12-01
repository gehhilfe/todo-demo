#!/usr/bin/env python3
"""
Monitor PostgreSQL for changes to auth.jwks table and reload postgREST configuration.
"""
import os
import time
import psycopg2
import docker
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Configuration
DB_HOST = os.getenv('DB_HOST', 'db')
DB_PORT = os.getenv('DB_PORT', '5432')
DB_NAME = os.getenv('DB_NAME', 'postgres')
DB_USER = os.getenv('DB_USER', 'postgres')
DB_PASSWORD = os.getenv('DB_PASSWORD', 'password')
POSTGREST_CONTAINER_NAME = os.getenv('POSTGREST_CONTAINER_NAME', 'dev-postgREST-1')
POLL_INTERVAL = int(os.getenv('POLL_INTERVAL', '5'))  # seconds

def get_db_connection():
    """Create a database connection."""
    return psycopg2.connect(
        host=DB_HOST,
        port=DB_PORT,
        database=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD
    )

def get_jwks_hash(conn):
    """Get a hash of the current jwks state to detect changes."""
    with conn.cursor() as cur:
        cur.execute("""
            SELECT 
                COUNT(*) as count,
                MAX(created_at) as max_created_at,
                COALESCE(SUM(hashtext(id::text)), 0) as hash_sum
            FROM auth.jwks
        """)
        result = cur.fetchone()
        return result

def reload_postgrest():
    """Send SIGUSR2 signal to postgREST container."""
    try:
        client = docker.from_env()
        # Try exact name first
        try:
            container = client.containers.get(POSTGREST_CONTAINER_NAME)
        except docker.errors.NotFound:
            # Fallback: search for containers with postgrest in the name
            containers = client.containers.list(filters={'name': 'postgrest'})
            if containers:
                container = containers[0]
            else:
                # Try with postgREST (capital R)
                containers = client.containers.list(filters={'name': 'postgREST'})
                if containers:
                    container = containers[0]
                else:
                    raise docker.errors.NotFound(f"Could not find postgREST container")
        
        container.kill(signal='SIGUSR2')
        logger.info(f"Sent SIGUSR2 to {container.name}")
        return True
    except docker.errors.NotFound as e:
        logger.error(f"Container not found: {e}")
        return False
    except Exception as e:
        logger.error(f"Error sending signal: {e}")
        return False

def main():
    logger.info("Starting postgREST configuration monitor...")
    logger.info(f"Monitoring auth.jwks table, polling every {POLL_INTERVAL} seconds")
    logger.info(f"Target container: {POSTGREST_CONTAINER_NAME}")
    
    last_state = None
    
    while True:
        try:
            conn = get_db_connection()
            current_state = get_jwks_hash(conn)
            conn.close()
            
            if last_state is not None and current_state != last_state:
                logger.info("Detected change in auth.jwks table")
                logger.info(f"Previous: {last_state}, Current: {current_state}")
                reload_postgrest()
            
            last_state = current_state
            time.sleep(POLL_INTERVAL)
            
        except psycopg2.OperationalError as e:
            logger.error(f"Database connection error: {e}")
            logger.info("Retrying in 5 seconds...")
            time.sleep(5)
        except Exception as e:
            logger.error(f"Unexpected error: {e}")
            time.sleep(POLL_INTERVAL)

if __name__ == '__main__':
    main()

