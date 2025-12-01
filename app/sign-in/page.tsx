"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth-client";
import Link from "next/link";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn.email({
        email,
        password,
      });

      if (result.error) {
        setError(result.error.message || "Failed to sign in");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (email: string, password: string) => {
    setError("");
    setLoading(true);

    try {
      const result = await signIn.email({
        email,
        password,
      });

      if (result.error) {
        setError(result.error.message || "Failed to sign in");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <div className="w-full max-w-md rounded-lg border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h1 className="mb-6 text-2xl font-semibold text-black dark:text-zinc-50">
          Sign In
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-400">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-black shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50 dark:focus:border-zinc-400 dark:focus:ring-zinc-400"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-black shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50 dark:focus:border-zinc-400 dark:focus:ring-zinc-400"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-50 dark:text-black dark:hover:bg-zinc-200"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
          Don't have an account?{" "}
          <Link
            href="/sign-up"
            className="font-medium text-black hover:underline dark:text-zinc-50"
          >
            Sign up
          </Link>
        </p>
        {process.env.NODE_ENV === "development" && (
          <div className="mt-6 border-t border-zinc-200 pt-6 dark:border-zinc-800">
            <p className="mb-3 text-center text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Development Quick Login
            </p>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleQuickLogin("user@test.com", "testtest")}
                disabled={loading}
                className="w-full rounded-md border border-zinc-300 bg-zinc-50 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
              >
                Login as Test User
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin("admin@test.com", "testtest")}
                disabled={loading}
                className="w-full rounded-md border border-zinc-300 bg-zinc-50 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
              >
                Login as Test Admin
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

