import { NextResponse } from "next/server";
import {
  createProperty,
  getAllProperties,
  type PropertyInput,
} from "@/lib/properties/repository";

export async function GET() {
  const properties = await getAllProperties({ publishedOnly: false });
  return NextResponse.json(properties);
}

export async function POST(request: Request) {
  const body = (await request.json()) as PropertyInput;
  if (!body.titleAr || !body.slug) {
    return NextResponse.json({ error: "العنوان والرابط مطلوبان" }, { status: 400 });
  }
  const property = await createProperty(body);
  return NextResponse.json(property, { status: 201 });
}
