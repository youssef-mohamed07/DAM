import { NextResponse } from "next/server";
import { getLeadStats } from "@/lib/leads/store";

export async function GET() {
  const stats = await getLeadStats();
  return NextResponse.json(stats);
}
