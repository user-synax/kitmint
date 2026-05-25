export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/db';
import Kit from '@/models/Kit';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const search = searchParams.get('search') || '';

    await connectDB();

    const query = { isPublic: true };
    if (search) {
      query.$or = [
        { ideaPrompt: { $regex: search, $options: 'i' } },
        { tagline: { $regex: search, $options: 'i' } },
        { 'brandNames.name': { $regex: search, $options: 'i' } }
      ];
    }

    const kits = await Kit.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const totalCount = await Kit.countDocuments(query);

    return NextResponse.json({
      kits,
      totalCount,
      page,
      totalPages: Math.ceil(totalCount / limit)
    });
  } catch (error) {
    console.error("Gallery fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch kits" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug, action } = await req.json();

    if (action === 'publish') {
      const kit = await Kit.findOne({ slug });

      if (!kit) {
        return NextResponse.json({ error: "Kit not found" }, { status: 404 });
      }

      // Verify ownership
      if (kit.userId?.toString() !== session.user.id) {
        return NextResponse.json({ error: "Only the owner can publish this kit" }, { status: 403 });
      }

      kit.isPublic = true;
      await kit.save();

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Publish kit error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
