import { NextResponse } from "next/server";
import { db } from "@/db";
import { trekkingPackages } from "@/db/schema";
import { parseArray } from "@/utils/jsonParser";

const normalizePackage = (pkg: any) => ({
  ...pkg,
  galleryImages: parseArray(pkg.galleryImages),
  packageTypes: typeof pkg.packageTypes === 'string' ? JSON.parse(pkg.packageTypes) : pkg.packageTypes,
  thingsToBring: parseArray(pkg.thingsToBring),
  itinerary: parseArray(pkg.itinerary),
  faq: parseArray(pkg.faq),
  relatedPackageIds: parseArray(pkg.relatedPackageIds),
});

export async function GET() {
  try {
    const rawData = await db.select().from(trekkingPackages);
    const data = rawData.map(normalizePackage);
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await db.insert(trekkingPackages).values(body);
    return NextResponse.json({ success: true, data: body });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
