import { NextResponse } from "next/server";
import { getLead, updateLead } from "@/lib/leads/store";
import type { UpdateLeadInput } from "@/types/leads";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const lead = await getLead(id);
  if (!lead) return NextResponse.json({ error: "غير موجود" }, { status: 404 });
  return NextResponse.json(lead);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = (await request.json()) as UpdateLeadInput;
  const lead = await updateLead(id, body);
  if (!lead) return NextResponse.json({ error: "غير موجود" }, { status: 404 });
  return NextResponse.json(lead);
}
