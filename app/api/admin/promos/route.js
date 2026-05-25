import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import PromoCode from '@/models/PromoCode';
import { isAdmin, adminError } from '@/lib/admin';
import { auth } from '@/lib/auth';

export async function GET() {
  try {
    if (!(await isAdmin())) return adminError();

    await connectDB();
    const codes = await PromoCode.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json(codes);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch promo codes' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await auth();
    if (!(await isAdmin())) return adminError();

    const { code, tier, usageLimit, expiresAt, discountType, discountValue } = await req.json();

    if (!code || !tier || !expiresAt) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectDB();

    // Check if code already exists
    const existingCode = await PromoCode.findOne({ code: code.toUpperCase() });
    if (existingCode) {
      return NextResponse.json({ error: 'Promo code already exists' }, { status: 400 });
    }

    const newPromo = await PromoCode.create({
      code: code.toUpperCase(),
      tier,
      usageLimit: usageLimit || 1,
      expiresAt: new Date(expiresAt),
      discountType: discountType || 'full_access',
      discountValue: discountValue || 100,
      createdBy: session.user.email
    });

    return NextResponse.json({ message: 'Promo code created successfully', promo: newPromo });
  } catch (error) {
    console.error('Promo creation error:', error);
    return NextResponse.json({ error: 'Failed to create promo code' }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    if (!(await isAdmin())) return adminError();
    const { id } = await req.json();

    await connectDB();
    await PromoCode.findByIdAndDelete(id);

    return NextResponse.json({ message: 'Promo code deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete promo code' }, { status: 500 });
  }
}
