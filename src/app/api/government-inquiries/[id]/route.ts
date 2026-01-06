import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const supabase = await createClient();

        // Check if user is admin
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single();

        if (!profile || profile.role !== 'admin') {
            return NextResponse.json(
                { error: "Forbidden - Admin access required" },
                { status: 403 }
            );
        }

        const body = await request.json();
        const { status, priority, notes, assigned_to } = body;

        // Build update object
        const updateData: any = {};
        if (status) updateData.status = status;
        if (priority) updateData.priority = priority;
        if (notes !== undefined) updateData.notes = notes;
        if (assigned_to !== undefined) updateData.assigned_to = assigned_to;

        // Update inquiry
        const { data, error } = await supabase
            .from("government_inquiries")
            .update(updateData)
            .eq("id", params.id)
            .select()
            .single();

        if (error) {
            console.error("Error updating government inquiry:", error);
            return NextResponse.json(
                { error: "Failed to update inquiry" },
                { status: 500 }
            );
        }

        return NextResponse.json({ data }, { status: 200 });
    } catch (error) {
        console.error("Error in government inquiry update:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const supabase = await createClient();

        // Check if user is admin
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single();

        if (!profile || profile.role !== 'admin') {
            return NextResponse.json(
                { error: "Forbidden - Admin access required" },
                { status: 403 }
            );
        }

        // Get single inquiry
        const { data, error } = await supabase
            .from("government_inquiries")
            .select("*")
            .eq("id", params.id)
            .single();

        if (error) {
            console.error("Error fetching government inquiry:", error);
            return NextResponse.json(
                { error: "Failed to fetch inquiry" },
                { status: 500 }
            );
        }

        return NextResponse.json({ data }, { status: 200 });
    } catch (error) {
        console.error("Error in government inquiry fetch:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
