import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function SessionInfo() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    async function handleSignOut() {
        "use server";
        await auth.api.signOut({
            headers: await headers()
        });
        revalidatePath("/");
    }

    return (
        <div className="flex items-center gap-4">
            {session?.user ? (
                <>
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">
                        Welcome, {session.user.name || session.user.email}
                    </span>
                    <button
                        className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-700"
                        onClick={handleSignOut}
                    >
                        Sign Out
                    </button>
                </>
            ) : (
                <div className="flex gap-2">
                    <Link
                        href="/sign-in"
                        className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-700"
                    >
                        Sign In
                    </Link>
                    <Link
                        href="/sign-up"
                        className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-black dark:hover:bg-zinc-200"
                    >
                        Sign Up
                    </Link>
                </div>
            )}
        </div>
    );
}

