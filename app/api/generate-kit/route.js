export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Kit from '@/models/Kit';
import groq, { buildKitPrompt } from '@/lib/groq';
import { nanoid } from 'nanoid';
import { cookies } from 'next/headers';

export async function POST(req) {
  try {
    await connectDB();
    const session = await auth();
    const cookieStore = await cookies();
    
    // 1. GUEST RATE LIMIT CHECK
    const guestKitsUsed = cookieStore.get('guest_kits_used')?.value;
    if (!session && guestKitsUsed && parseInt(guestKitsUsed) >= 1) {
      return NextResponse.json({ 
        error: "GUEST_LIMIT_REACHED", 
        message: "Create a free account to generate more kits" 
      }, { status: 429 });
    }

    // 2. AUTHENTICATED USER RATE LIMIT CHECK
    let user = null;
    if (session) {
      user = await User.findById(session.user.id);
      
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      if (user.plan === 'free') {
        const now = new Date();
        const resetDate = new Date(user.monthResetDate);
        
        // Reset if it's a new month
        if (now.getMonth() !== resetDate.getMonth() || now.getFullYear() !== resetDate.getFullYear()) {
          user.kitsGeneratedThisMonth = 0;
          user.monthResetDate = now;
          await user.save();
        }

        if (user.kitsGeneratedThisMonth >= 3) {
          return NextResponse.json({ 
            error: "FREE_LIMIT_REACHED", 
            message: "Upgrade to Pro for unlimited kits" 
          }, { status: 429 });
        }
      }
    }

    // 3. VALIDATE INPUT
    const { idea } = await req.json();
    if (!idea || idea.trim().length < 10) {
      return NextResponse.json({ error: "Idea must be at least 10 characters" }, { status: 400 });
    }
    if (idea.length > 280) {
      return NextResponse.json({ error: "Idea must be under 280 characters" }, { status: 400 });
    }

    // 4. GENERATE WITH GROQ
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: buildKitPrompt(idea),
      temperature: 0.8,
      max_tokens: 2000,
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0].message.content;
    let parsedKit;
    try {
      parsedKit = JSON.parse(content);
    } catch (e) {
      console.error("Failed to parse Groq response:", content);
      return NextResponse.json({ error: "Generation failed, please try again" }, { status: 500 });
    }

    // 5. SAVE TO DB
    const slug = nanoid(10);
    const newKit = new Kit({
      slug,
      userId: session?.user?.id || null,
      isPublic: false,
      ideaPrompt: idea,
      ...parsedKit
    });
    await newKit.save();

    // 6. UPDATE COUNTERS
    let updatedKitsCount = 0;
    if (session && user) {
      user.kitsGeneratedThisMonth += 1;
      await user.save();
      updatedKitsCount = user.kitsGeneratedThisMonth;
    } else {
      cookieStore.set('guest_kits_used', '1', { 
        maxAge: 60 * 60 * 24 * 30, // 30 days
        httpOnly: true,
        path: '/'
      });
    }

    // 7. RETURN
    return NextResponse.json({ 
      slug, 
      kit: parsedKit,
      updatedKitsCount // Return this so the frontend can update session
    }, { status: 201 });

  } catch (error) {
    console.error("Kit generation error:", error);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
