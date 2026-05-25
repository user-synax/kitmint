import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import PromoCode from '@/models/PromoCode';
import { auth } from '@/lib/auth';

export async function POST(req) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { code } = await req.json();
    if (!code) {
      return NextResponse.json({ error: 'Promo code is required' }, { status: 400 });
    }

    await connectDB();

    // 1. Find and Validate Promo Code
    const promo = await PromoCode.findOne({ 
      code: code.toUpperCase(),
      isActive: true,
      expiresAt: { $gt: new Date() }
    });

    if (!promo) {
      return NextResponse.json({ error: 'Invalid or expired promo code' }, { status: 400 });
    }

    if (promo.usedCount >= promo.usageLimit) {
      return NextResponse.json({ error: 'Promo code usage limit reached' }, { status: 400 });
    }

    // 2. Find User and Check if already used this specific code
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.subscription?.usedPromoCodes?.includes(code.toUpperCase())) {
      return NextResponse.json({ error: 'You have already used this promo code' }, { status: 400 });
    }

    // 3. Calculate Subscription End Date
    let durationInDays = 30; // Default Monthly
    if (promo.tier === 'quarterly') durationInDays = 90;
    if (promo.tier === 'yearly') durationInDays = 365;

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + durationInDays);

    // 4. Update User Subscription (Layered Validation)
    // We only update if the user doesn't have an active higher-tier or longer subscription 
    // (Simplified for now: override existing if it's 'none' or 'expired')
    
    user.plan = 'pro';
    user.subscription = {
      status: 'active',
      tier: promo.tier,
      startDate: startDate,
      endDate: endDate,
      usedPromoCodes: [...(user.subscription?.usedPromoCodes || []), code.toUpperCase()]
    };

    await user.save();

    // 5. Increment Promo Usage
    promo.usedCount += 1;
    if (promo.usedCount >= promo.usageLimit) {
      promo.isActive = false;
    }
    await promo.save();

    return NextResponse.json({ 
      message: `Successfully upgraded to Pro (${promo.tier})!`,
      subscription: user.subscription
    });

  } catch (error) {
    console.error('Subscription apply error:', error);
    return NextResponse.json({ error: 'Failed to apply promo code' }, { status: 500 });
  }
}
