import { auth } from '@/lib/auth';
import connectDB from '@/lib/db';
import Kit from '@/models/Kit';
import User from '@/models/User';
import DashboardClient from '@/components/kit/DashboardClient';

export default async function DashboardPage() {
  const session = await auth();
  await connectDB();

  const kits = await Kit.find({ userId: session.user.id })
    .sort({ createdAt: -1 })
    .lean();

  const user = await User.findById(session.user.id).lean();

  // Serialize for client component
  const serializedKits = JSON.parse(JSON.stringify(kits));
  const serializedUser = JSON.parse(JSON.stringify(user));

  return <DashboardClient kits={serializedKits} user={serializedUser} />;
}
