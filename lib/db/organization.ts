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
]).enableRLS();

export const rolePermission = pgTable("role_permission", {
    roleId: text("role_id").references(() => role.id),
    permissionSlug: text("permission_slug").references(() => permission.slug),
}, (t) => [
    primaryKey({ columns: [t.roleId, t.permissionSlug] }),
    pgPolicy("Allow all to postgres", {
        for: "all",
        to: postgresRole,
        withCheck: sql`true`,
    }),
]).enableRLS();

export const userRole = pgTable("user_role", {
    userId: text("user_id").references(() => user.id),
    roleId: text("role_id").references(() => role.id),
}, (t) => [
    primaryKey({ columns: [t.userId, t.roleId] }),
    pgPolicy("Allow all to postgres", {
        for: "all",
        to: postgresRole,
        withCheck: sql`true`,
    }),
]).enableRLS();