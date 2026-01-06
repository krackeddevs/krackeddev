import { db } from "@/lib/db";
import { pageViews } from "@/lib/db/schema";
import { count } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const result = await db.select({ value: count() }).from(pageViews);
    console.log("GET /api/page-views result:", result);
    return NextResponse.json({ count: result[0].value });
  } catch (error) {
    console.error("Error fetching page views:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("POST /api/page-views body:", body);
    const { pagePath, visitorId, userAgent, referrer } = body;
    // ... rest of the function

    await db.insert(pageViews).values({
      pagePath,
      visitorId,
      userAgent,
      referrer,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error tracking page view:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
