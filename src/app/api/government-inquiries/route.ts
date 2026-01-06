import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            inquiry_type,
            organization_name,
            contact_name,
            contact_email,
            contact_phone,
            position_title,
            message,
        } = body;

        // Validate required fields
        if (!inquiry_type || !organization_name || !contact_name || !contact_email || !message) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Validate inquiry type
        const validTypes = ['policy_maker', 'mdec_ministry', 'glc_company'];
        if (!validTypes.includes(inquiry_type)) {
            return NextResponse.json(
                { error: "Invalid inquiry type" },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(contact_email)) {
            return NextResponse.json(
                { error: "Invalid email format" },
                { status: 400 }
            );
        }

        const supabase = await createClient();

        // Insert inquiry
        const { data, error } = await (supabase
            .from("government_inquiries") as any)
            .insert({
                inquiry_type,
                organization_name,
                contact_name,
                contact_email,
                contact_phone: contact_phone || null,
                position_title: position_title || null,
                message,
                status: 'new',
                priority: 'medium'
            })
            .select()
            .single();

        if (error) {
            console.error("Error creating government inquiry:", error);
            return NextResponse.json(
                { error: "Failed to submit inquiry" },
                { status: 500 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: "Thank you for your inquiry! We'll be in touch soon.",
                data
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error in government inquiry submission:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// GET endpoint for admins to fetch inquiries
export async function GET(request: NextRequest) {
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
            .single<{ role: string }>();

        if (!profile || profile.role !== 'admin') {
            return NextResponse.json(
                { error: "Forbidden - Admin access required" },
                { status: 403 }
            );
        }

        // Get query parameters for filtering
        const searchParams = request.nextUrl.searchParams;
        const status = searchParams.get('status');
        const type = searchParams.get('type');

        let query = (supabase
            .from("government_inquiries") as any)
            .select("*")
            .order("created_at", { ascending: false });

        if (status) {
            query = query.eq("status", status);
        }

        if (type) {
            query = query.eq("inquiry_type", type);
        }

        const { data, error } = await query;

        if (error) {
            console.error("Error fetching government inquiries:", error);
            return NextResponse.json(
                { error: "Failed to fetch inquiries" },
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
