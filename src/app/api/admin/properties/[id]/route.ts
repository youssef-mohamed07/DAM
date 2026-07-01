import { NextResponse } from "next/server";
import {
  deleteProperty,
  getPropertyById,
  updateProperty,
  type PropertyInput,
} from "@/lib/properties/repository";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const property = await getPropertyById(id);
  if (!property) return NextResponse.json({ error: "غير موجود" }, { status: 404 });
  return NextResponse.json(property);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = (await request.json()) as Partial<PropertyInput>;
  try {
    const property = await updateProperty(id, body);
    return NextResponse.json(property);
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
    await deleteProperty(id);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "غير موجود" }, { status: 404 });
  }
}
