import { NextResponse } from "next/server";
import { createLead, listLeads } from "@/lib/leads/store";
import type { CreateLeadInput } from "@/types/leads";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const leads = await listLeads({
    status: searchParams.get("status") ?? undefined,
    propertyId: searchParams.get("propertyId") ?? undefined,
    assignedSalesId: searchParams.get("assignedSalesId") ?? undefined,
  });
  return NextResponse.json(leads);
}

export async function POST(request: Request) {
  const body = (await request.json()) as CreateLeadInput;
  if (!body.source) {
    return NextResponse.json({ error: "المصدر مطلوب" }, { status: 400 });
  }
  const result = await createLead(body);
  return NextResponse.json(result, { status: 201 });
}
