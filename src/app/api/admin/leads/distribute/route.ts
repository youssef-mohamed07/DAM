import { NextResponse } from "next/server";
import { distributeLeads, assignLeadsToRep } from "@/lib/leads/store";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    mode?: "auto" | "rep";
    leadIds?: string[];
    salesRepId?: string;
  };

  if (body.mode === "rep" && body.salesRepId && body.leadIds?.length) {
    const updated = await assignLeadsToRep(body.leadIds, body.salesRepId);
    return NextResponse.json({ updated, count: updated.length });
  }

  if (body.mode === "auto") {
    const result = await distributeLeads(body.leadIds);
    return NextResponse.json(result);
  }

  return NextResponse.json({ error: "طلب غير صالح" }, { status: 400 });
}
