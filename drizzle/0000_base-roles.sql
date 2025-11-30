CREATE ROLE "anon";--> statement-breakpoint
CREATE ROLE "authenticated";--> statement-breakpoint
GRANT ALL ON SCHEMA public TO "anon";--> statement-breakpoint
GRANT ALL ON SCHEMA public TO "authenticated";--> statement-breakpoint
GRANT ALL ON ALL TABLES IN SCHEMA public TO "anon";--> statement-breakpoint
GRANT ALL ON ALL TABLES IN SCHEMA public TO "authenticated";--> statement-breakpoint
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO "anon";--> statement-breakpoint
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO "authenticated";--> statement-breakpoint
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO "anon";--> statement-breakpoint
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO "authenticated";--> statement-breakpoint
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO "anon";--> statement-breakpoint
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO "authenticated";--> statement-breakpoint
CREATE OR REPLACE FUNCTION current_user_id() RETURNS text AS $$
BEGIN
    RETURN current_setting('app.request.user_id', true);
END;
$$ LANGUAGE plpgsql;--> statement-breakpoint