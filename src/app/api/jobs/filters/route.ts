import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { jobs } from "@/lib/db/schema";
import { isNotNull } from "drizzle-orm";

export async function GET() {
  try {
    // parallel fetch
    const [locations, types] = await Promise.all([
      db
        .selectDistinct({ location: jobs.location })
        .from(jobs)
        .where(isNotNull(jobs.location)),
      db
        .selectDistinct({ type: jobs.employmentType })
        .from(jobs)
        .where(isNotNull(jobs.employmentType)),
    ]);

    const distinctLocations = locations
      .map((l) => l.location)
      .filter(Boolean)
      .sort();

    // Deduplicate locations if raw data is messy (optional, but good practice)
    // For now assuming distinct is enough, but "Kuala Lumpur" vs "kuala lumpur" might exist.
    // Drizzle distinct handles exact matches.

    const distinctTypes = types
      .map((t) => t.type)
      .filter(Boolean)
      .sort();

    return NextResponse.json({
      locations: distinctLocations,
      types: distinctTypes,
    });
  } catch (error) {
    console.error("Error fetching job filters:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
