import { NextResponse } from "next/server";
import { db } from "@/db";
import { blogPosts } from "@/db/schema";
import { parseArray } from "@/utils/jsonParser";

const normalizeBlog = (blog: any) => ({
  ...blog,
  tags: parseArray(blog.tags),
});

export async function GET() {
  try {
    const rawData = await db.select().from(blogPosts);
    const data = rawData.map(normalizeBlog);
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await db.insert(blogPosts).values(body);
    return NextResponse.json({ success: true, data: body });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
