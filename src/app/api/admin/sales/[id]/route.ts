import { NextResponse } from "next/server";
import { deleteSalesRep, updateSalesRep, type SalesRepInput } from "@/lib/sales/repository";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = (await request.json()) as Partial<SalesRepInput>;
  try {
    const rep = await updateSalesRep(id, body);
    return NextResponse.json(rep);
  } catch {
    return NextResponse.json({ error: "غير موجود" }, { status: 404 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    await deleteSalesRep(id);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "غير موجود" }, { status: 404 });
  }
}
