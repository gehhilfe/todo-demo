import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { createRlsDrizzle } from "@/lib/db";
import { organization, permission, role, rolePermission, user, userRole } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function SessionContent() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    const db = createRlsDrizzle({ session });

    const users = await db.transaction(async (tx) => {
        if (session)
            return await tx.select().from(user);
        return [];
    });

    const organizations = await db.transaction(async (tx) => {
        return await tx.select().from(organization);
    });

    const roles = await db.transaction(async (tx) => {
        return await tx.select().from(role);
    });

    const myRoles = await db.transaction(async (tx) => {
        if (!session?.user?.id) {
            return [];
        }
        return await tx.select().from(userRole)
            .where(eq(userRole.userId, session.user.id))
            .innerJoin(role, eq(userRole.roleId, role.id));
    });

    const myPermissions = await db.transaction(async (tx) => {
        if (!session?.user?.id) {
            return [];
        }
        return await tx.selectDistinct({
            slug: permission.slug,
        }).from(userRole)
            .where(eq(userRole.userId, session.user.id))
            .innerJoin(role, eq(userRole.roleId, role.id))
            .innerJoin(rolePermission, eq(role.id, rolePermission.roleId))
            .innerJoin(permission, eq(rolePermission.permissionSlug, permission.slug));
    });

    return (
        <>
            <pre>{JSON.stringify(users, null, 2)}</pre>
            <pre>{JSON.stringify(organizations, null, 2)}</pre>
            <pre>{JSON.stringify(roles, null, 2)}</pre>
            <pre>{JSON.stringify(myRoles, null, 2)}</pre>
            <pre>{JSON.stringify(myPermissions, null, 2)}</pre>
            <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
                <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
                    {session?.user
                        ? `Welcome back, ${session.user.name || "User"}!`
                        : "Welcome to Todo Demo"}
                </h1>
                <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
                    {session?.user
                        ? "You are signed in. Start managing your todos!"
                        : "Sign in or create an account to get started with your todos."}
                </p>
            </div>
            <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
                {session?.user ? (
                    <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900">
                        <h2 className="mb-2 text-lg font-semibold text-black dark:text-zinc-50">
                            User Info
                        </h2>
                        <div className="space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
                            <p>
                                <span className="font-medium">Name:</span> {session.user.name}
                            </p>
                            <p>
                                <span className="font-medium">Email:</span> {session.user.email}
                            </p>
                            {session.user.image && (
                                <p>
                                    <span className="font-medium">Image:</span> {session.user.image}
                                </p>
                            )}
                        </div>
                    </div>
                ) : (
                    <>
                        <Link
                            href="/sign-in"
                            className="flex h-12 w-full items-center justify-center rounded-full bg-black px-5 text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-black dark:hover:bg-zinc-200 md:w-[158px]"
                        >
                            Sign In
                        </Link>
                        <Link
                            href="/sign-up"
                            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
                        >
                            Sign Up
                        </Link>
                    </>
                )}
            </div>
        </>
    );
}

