import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './db/schema';
import { auth } from './auth';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';

export const db = drizzle(process.env.DATABASE_URL!, { schema: { ...schema }, logger: true });

type Session = Awaited<ReturnType<typeof auth.api.getSession>>;

export function createRlsDrizzle({ session }: { session: Session }) {
    const userId = session?.user?.id || null;
    return new Proxy<typeof db>(db, {
        get(target, prop, receiver) {
            if (prop === "transaction") {
                return async (
                    first: (tx: Parameters<Parameters<typeof target.transaction>[0]>[0]) => Promise<any>,
                    ...rest: any[]
                ) => {
                    return target.transaction(
                        async (tx) => {
                            if (userId) {
                                // Set the role to authenticated and user ID as a session variable for RLS
                                await tx.execute(`SET LOCAL ROLE authenticated`);
                                await tx.execute(`SET LOCAL app.request.user_id = '${userId}'`);
                            } else {
                                // Set the role to anonymous when no user is authenticated
                                await tx.execute(`SET LOCAL ROLE anon`);
                            }
                            const result = await first(tx);
                            // Reset the role and session variable after the transaction
                            await tx.execute(`RESET ROLE`);
                            await tx.execute(`RESET app.request.user_id`);
                            return result;
                        },
                        ...rest,
                    );
                };
            }
            return Reflect.get(target, prop, receiver);
        },
    });
}