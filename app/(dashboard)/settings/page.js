import { auth } from '@/lib/auth';
import connectDB from '@/lib/db';
import User from '@/models/User';
import SettingsClient from '@/components/settings/SettingsClient';

export default async function SettingsPage() {
  const session = await auth();
  await connectDB();

  const user = await User.findById(session.user.id).lean();
  const serializedUser = JSON.parse(JSON.stringify(user));

  return <SettingsClient user={serializedUser} />;
}
