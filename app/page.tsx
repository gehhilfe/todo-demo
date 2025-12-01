import Image from "next/image";
import { Suspense } from "react";
import { SessionInfo } from "./components/SessionInfo";
import { SessionContent } from "./components/SessionContent";
import { SupabaseTest } from "./components/SupabaseTest";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div className="flex w-full items-center justify-between">
          <Image
            className="dark:invert"
            src="/next.svg"
            alt="Next.js logo"
            width={100}
            height={20}
            priority
          />
          <Suspense
            fallback={
              <div className="flex items-center gap-4">
                <div className="h-8 w-24 animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800" />
              </div>
            }
          >
            <SessionInfo />
          </Suspense>
        </div>
        <Suspense>
          <SessionContent />
        </Suspense>
        <Suspense>
          <SupabaseTest />
        </Suspense>
      </main>
    </div>
  );
}
