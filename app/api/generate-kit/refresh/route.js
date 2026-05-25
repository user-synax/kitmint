export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Kit from '@/models/Kit';
import groq, { buildRefreshBlockPrompt } from '@/lib/groq';

export async function POST(req) {
  try {
    await connectDB();
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findById(session.user.id);
    if (!user || user.plan !== 'pro') {
      return NextResponse.json({ 
        error: "PRO_REQUIRED", 
        message: "Refreshing individual blocks is a Pro feature." 
      }, { status: 403 });
    }

    const { kitId, blockKey } = await req.json();
    if (!kitId || !blockKey) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const kit = await Kit.findById(kitId);
    if (!kit) {
      return NextResponse.json({ error: "Kit not found" }, { status: 404 });
    }

    // Pass the full context to the refresh prompt
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: buildRefreshBlockPrompt(blockKey, kit),
      temperature: 0.8,
      max_tokens: 1000,
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0].message.content;
    let refreshedData;
    try {
      refreshedData = JSON.parse(content);
    } catch (e) {
      console.error("Failed to parse Groq response:", content);
      return NextResponse.json({ error: "Refresh failed, please try again" }, { status: 500 });
    }

    // Update only the specific block
    const updatePayload = refreshedData[blockKey] ? { [blockKey]: refreshedData[blockKey] } : refreshedData;
    
    // Save to DB
    Object.assign(kit, updatePayload);
    await kit.save();

    return NextResponse.json({ 
      success: true,
      refreshedData: refreshedData[blockKey] || refreshedData
    }, { status: 200 });

  } catch (error) {
    console.error("Block refresh error:", error);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
