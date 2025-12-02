-- Create authenticator role if it doesn't exist and set password
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticator') THEN
        CREATE ROLE "authenticator" WITH LOGIN PASSWORD 'password' NOINHERIT;
    ELSE
        -- Ensure password is set and login is enabled
        ALTER ROLE "authenticator" WITH LOGIN PASSWORD 'password' NOINHERIT;
    END IF;
END
$$;

