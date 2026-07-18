import { NextResponse } from "next/server";
import { db } from "@/db";
import { trekkingPackages } from "@/db/schema";
import { eq } from "drizzle-orm";

import { revalidatePath } from "next/cache";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    await db.update(trekkingPackages).set(body).where(eq(trekkingPackages.id, id));
    
    // Revalidate paths so the frontend updates immediately
    revalidatePath(`/packages/${id}`);
    revalidatePath(`/`);
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await db.delete(trekkingPackages).where(eq(trekkingPackages.id, id));
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
