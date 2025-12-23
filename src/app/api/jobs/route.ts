import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { jobs } from "@/lib/db/schema";
import { and, desc, eq, gte, ilike, lte, or, sql } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Pagination
    const limit = parseInt(searchParams.get("limit") || "10");
    const cursor = searchParams.get("cursor"); // Using offset for simplicity or ID-based cursor?
    // Infinite scroll with "next cursor" is usually ID or timestamp.
    // For simplicity with diverse sorting, offset-based is easier but slower on large datasets.
    // Let's use numeric offset (skip) if cursor is treated as page/offset.
    const offset = parseInt(cursor || "0");

    // Filters
    const search = searchParams.get("search");
    const location = searchParams.get("location");
    const type = searchParams.get("type");
    const salaryMin = searchParams.get("salary_min");
    const salaryMax = searchParams.get("salary_max");

    const conditions = [eq(jobs.isActive, true)];

    if (search) {
      const searchLower = `%${search.toLowerCase()}%`;
      conditions.push(
        or(ilike(jobs.title, searchLower), ilike(jobs.company, searchLower))!,
      );
    }

    if (location) {
      // Assuming exact match or partial match. Let's do partial for flexibility.
      conditions.push(ilike(jobs.location, `%${location}%`));
    }

    if (type) {
      // Handle multiple types if comma separated?
      // Basic implementation first.
      conditions.push(eq(jobs.employmentType, type));
    }

    if (salaryMin) {
      conditions.push(gte(jobs.salaryMin, parseInt(salaryMin)));
    }

    // Logic: If user filters for max salary 5000, show jobs where salaryMax <= 5000?
    // Or jobs that are affordable within that range?
    // Usually "Salary Range" filter means "Jobs that pay at least X".
    // Let's assume the user selects a range and wants jobs falling into it.
    // If user provides salary_min, we want jobs that pay AT LEAST that.

    // Let's stick to simple "salary_min" filter for now as "Minimum Salary".

    // Construct Query
    const data = await db
      .select()
      .from(jobs)
      .where(and(...conditions))
      .limit(limit)
      .offset(offset)
      .orderBy(desc(jobs.postedAt));

    // Get total count for metadata (optional but useful)
    // const totalCount = await db
    //   .select({ count: sql<number>`count(*)` })
    //   .from(jobs)
    //   .where(and(...conditions));

    const nextCursor = data.length === limit ? offset + limit : null;

    return NextResponse.json({
      data,
      nextCursor,
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
