import { pgPolicy, pgTable, primaryKey, text, timestamp } from "drizzle-orm/pg-core";
import { authenticatedRole, postgresRole, user } from "./schema";
import { sql } from "drizzle-orm";

export const organization = pgTable("organization", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => /* @__PURE__ */ new Date())
        .notNull(),
}, (t) => [
    pgPolicy("Allow all to postgres", {
        for: "all",
        to: postgresRole,
        withCheck: sql`true`,
    }),
    pgPolicy("Allow user to read with organization.view permission", {
        for: "select",
        to: authenticatedRole,
        using: sql`has_permission(id, 'organization.view')`,
    }),
]).enableRLS();

export const permission = pgTable("permission", {
    slug: text("slug").primaryKey(),
    name: text("name").notNull(),
    description: text("description"),
}, (t) => [
    pgPolicy("Allow all to postgres", {
        for: "all",
        to: postgresRole,
        withCheck: sql`true`,
    }),
    pgPolicy("Allow authenticated to read permissions", {
        for: "select",
        to: authenticatedRole,
        using: sql`true`,
    }),
]).enableRLS();

export const role = pgTable("role", {
    id: text("id").primaryKey(),
    organizationId: text("organization_id").references(() => organization.id),
    name: text("name").notNull(),
    description: text("description"),
}, (t) => [
    pgPolicy("Allow all to postgres", {
        for: "all",
        to: postgresRole,
        withCheck: sql`true`,
    }),
    pgPolicy("Allow authenticated to read roles without organization id", {
        for: "select",
        to: authenticatedRole,
        using: sql`organization_id IS NULL`,
    }),
    pgPolicy("Allow user to read with organization.view permission", {
        for: "select",
        to: authenticatedRole,
        using: sql`has_permission(organization_id, 'organization.view')`,
    }),
]).enableRLS();

export const rolePermission = pgTable("role_permission", {
    roleId: text("role_id").notNull().references(() => role.id),
    permissionSlug: text("permission_slug").notNull().references(() => permission.slug),
}, (t) => [
    primaryKey({ columns: [t.roleId, t.permissionSlug] }),
    pgPolicy("Allow all to postgres", {
        for: "all",
        to: postgresRole,
        withCheck: sql`true`,
    }),
    pgPolicy("Allow user to read role permissions for their assigned roles", {
        for: "select",
        to: authenticatedRole,
        using: sql`role_id IN (SELECT role_id FROM user_role WHERE user_id = auth.uid())`,
    }),
]).enableRLS();

export const userRole = pgTable("user_role", {
    userId: text("user_id").notNull().references(() => user.id),
    roleId: text("role_id").notNull().references(() => role.id),
    organizationId: text("organization_id").notNull().references(() => organization.id),
}, (t) => [
    primaryKey({ columns: [t.userId, t.roleId, t.organizationId] }),
    pgPolicy("Allow all to postgres", {
        for: "all",
        to: postgresRole,
        withCheck: sql`true`,
    }),
    pgPolicy("Allow users to read their own roles", {
        for: "select",
        to: authenticatedRole,
        using: sql`user_id = auth.uid()`,
    }),
]).enableRLS();