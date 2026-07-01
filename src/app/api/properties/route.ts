import { NextResponse } from "next/server";
import { getAllProperties } from "@/lib/properties/repository";

export async function GET() {
  const properties = await getAllProperties({ publishedOnly: true });
  return NextResponse.json(properties);
}
