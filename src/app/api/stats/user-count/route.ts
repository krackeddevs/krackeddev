import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
    try {
        const supabase = await createClient();

        // Count total registered users
        const { count, error } = await supabase
            .from("profiles")
            .select("*", { count: "exact", head: true });

        if (error) {
            console.error("Error fetching user count:", error);
            return NextResponse.json(
                { error: "Failed to fetch user count" },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { count: count || 0 },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error in user count fetch:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
