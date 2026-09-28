import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { missingEnv } from "@/lib/env";

export const dynamic = "force-dynamic";

export async function GET() {
  const missing = missingEnv();
  if (missing.length > 0) {
    return NextResponse.json(
      { status: "error", database: "unknown", missingEnv: missing },
      { status: 503 },
    );
  }

  try {
    await db().execute(sql`select 1`);
    return NextResponse.json({ status: "ok", database: "ok", missingEnv: [] });
  } catch {
    return NextResponse.json(
      { status: "error", database: "unreachable", missingEnv: [] },
      { status: 503 },
    );
  }
}
