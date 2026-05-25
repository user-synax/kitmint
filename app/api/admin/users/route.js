export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { isAdmin, adminError } from '@/lib/admin';

export async function GET() {
  try {
    if (!(await isAdmin())) return adminError();

    await connectDB();
    const users = await User.find({}).sort({ createdAt: -1 }).lean();

    // Map users to include left credits calculation
    const usersWithCredits = users.map(user => {
      const limit = user.plan === 'pro' ? Infinity : 3;
      const used = user.kitsGeneratedThisMonth || 0;
      const left = user.plan === 'pro' ? 'Unlimited' : Math.max(0, limit - used);

      return {
        ...user,
        _id: user._id.toString(),
        totalCredits: user.plan === 'pro' ? 'Unlimited' : 3,
        usedCredits: used,
        leftCredits: left
      };
    });

    return NextResponse.json(usersWithCredits);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    if (!(await isAdmin())) return adminError();

    const { userId, kitsGeneratedThisMonth, plan } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    await connectDB();
    const updateData = {};
    if (kitsGeneratedThisMonth !== undefined) updateData.kitsGeneratedThisMonth = kitsGeneratedThisMonth;
    if (plan !== undefined) updateData.plan = plan;

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    ).lean();

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      message: 'User updated successfully',
      user: {
        ...user,
        _id: user._id.toString()
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}
