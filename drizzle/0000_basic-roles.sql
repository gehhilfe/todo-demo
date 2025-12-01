CREATE ROLE "anon" noinherit nologin;--> statement-breakpoint
CREATE ROLE "authenticated" noinherit nologin;--> statement-breakpoint
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticator') THEN
        CREATE ROLE "authenticator" noinherit;
    END IF;
END
$$;
GRANT "anon" TO "authenticator";--> statement-breakpoint
GRANT "authenticated" TO "authenticator";--> statement-breakpoint


GRANT USAGE ON SCHEMA public TO "anon";--> statement-breakpoint
GRANT USAGE ON SCHEMA public TO "authenticated";--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO "anon";--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO "authenticated";--> statement-breakpoint
GRANT SELECT, UPDATE ON ALL SEQUENCES IN SCHEMA public TO "anon";--> statement-breakpoint
GRANT SELECT, UPDATE ON ALL SEQUENCES IN SCHEMA public TO "authenticated";--> statement-breakpoint
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO "anon";--> statement-breakpoint
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO "authenticated";--> statement-breakpoint
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, UPDATE ON SEQUENCES TO "anon";--> statement-breakpoint
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, UPDATE ON SEQUENCES TO "authenticated";--> statement-breakpoint

