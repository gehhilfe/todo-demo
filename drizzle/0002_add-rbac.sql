CREATE TABLE "organization" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "organization" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "permission" (
	"slug" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text
);
--> statement-breakpoint
ALTER TABLE "permission" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "role" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text,
	"name" text NOT NULL,
	"description" text
);
--> statement-breakpoint
ALTER TABLE "role" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "role_permission" (
	"role_id" text NOT NULL,
	"permission_slug" text NOT NULL,
	CONSTRAINT "role_permission_role_id_permission_slug_pk" PRIMARY KEY("role_id","permission_slug")
);
--> statement-breakpoint
ALTER TABLE "role_permission" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "user_role" (
	"user_id" text NOT NULL,
	"role_id" text NOT NULL,
	"organization_id" text NOT NULL,
	CONSTRAINT "user_role_user_id_role_id_organization_id_pk" PRIMARY KEY("user_id","role_id","organization_id")
);
--> statement-breakpoint
ALTER TABLE "user_role" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "role" ADD CONSTRAINT "role_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_permission" ADD CONSTRAINT "role_permission_role_id_role_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."role"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_permission" ADD CONSTRAINT "role_permission_permission_slug_permission_slug_fk" FOREIGN KEY ("permission_slug") REFERENCES "public"."permission"("slug") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_role" ADD CONSTRAINT "user_role_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_role" ADD CONSTRAINT "user_role_role_id_role_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."role"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_role" ADD CONSTRAINT "user_role_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE POLICY "Allow all to postgres" ON "organization" AS PERMISSIVE FOR ALL TO "postgres" WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "Allow all to postgres" ON "permission" AS PERMISSIVE FOR ALL TO "postgres" WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "Allow all to postgres" ON "role" AS PERMISSIVE FOR ALL TO "postgres" WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "Allow authenticated to read roles without organization id" ON "role" AS PERMISSIVE FOR SELECT TO "authenticated" USING (organization_id IS NULL);--> statement-breakpoint
CREATE POLICY "Allow all to postgres" ON "role_permission" AS PERMISSIVE FOR ALL TO "postgres" WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "Allow all to postgres" ON "user_role" AS PERMISSIVE FOR ALL TO "postgres" WITH CHECK (true);