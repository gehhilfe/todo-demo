import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins"
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/lib/db";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
    }),
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: false,
    },
    plugins: [
        jwt({
            jwt: {
                definePayload: async ({ user, session }) => {
                    return {
                        sub: user.id,
                        email: user.email,
                        role: "authenticated",
                    };
                },
            }
        }),
    ],
});