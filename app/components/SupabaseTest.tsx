"use client";

import { authClient } from "@/lib/auth-client";
import { PostgrestClient } from "@supabase/postgrest-js";
import { useEffect } from "react";

async function testDb() {
    const res = await authClient.token();
    if (res.error) {
        console.error(res.error);
        return;
    }
    console.log(res.data);
    const postgrestUrl = process.env.NODE_ENV === 'development'
        ? "http://localhost:3010"
        : "/pgrest/";
    const supabase = new PostgrestClient(postgrestUrl, {
        headers: {
            Authorization: `Bearer ${res.data.token}`,
        },
    });
    const { data, error } = await supabase.from('role').select('*');
    if (error) {
        console.error(error);
        return;
    }
    console.log(data);
}

export function SupabaseTest() {
    useEffect(() => {
        testDb();
    }, []);

    return <div>SupabaseTest</div>;
}