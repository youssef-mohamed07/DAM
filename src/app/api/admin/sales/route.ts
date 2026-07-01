import { NextResponse } from "next/server";
import { createSalesRep, getAllSalesReps, type SalesRepInput } from "@/lib/sales/repository";

export async function GET() {
  const reps = await getAllSalesReps();
  return NextResponse.json(reps);
}

export async function POST(request: Request) {
  const body = (await request.json()) as SalesRepInput;
  if (!body.name || !body.whatsapp) {
    return NextResponse.json({ error: "الاسم ورقم الواتساب مطلوبان" }, { status: 400 });
  }
  const rep = await createSalesRep(body);
  return NextResponse.json(rep, { status: 201 });
}
