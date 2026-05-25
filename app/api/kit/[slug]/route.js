export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/db';
import Kit from '@/models/Kit';

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { slug } = await params;

    // Find and increment views atomically
    const kit = await Kit.findOneAndUpdate(
      { slug },
      { $inc: { views: 1 } },
      { returnDocument: 'after' }
    ).lean();

    if (!kit) {
      return NextResponse.json({ error: "Kit not found" }, { status: 404 });
    }

    return NextResponse.json(kit);
  } catch (error) {
    console.error("Fetch kit error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug } = await params;
    await connectDB();

    const kit = await Kit.findOne({ slug });

    if (!kit) {
      return NextResponse.json({ error: "Kit not found" }, { status: 404 });
    }

    // Verify ownership
    if (kit.userId?.toString() !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await Kit.findOneAndDelete({ slug });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete kit error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
