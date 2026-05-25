import { isAdmin } from "@/lib/admin";
import { redirect } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import { auth } from "@/lib/auth";
import Link from "next/link";

export default async function AdminLayout({ children }) {
  const session = await auth();
  const adminAccess = await isAdmin();

  if (!adminAccess) {
    redirect("/dashboard");
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#0A0A0A]">
      <Sidebar user={session.user} />
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white font-dm-sans">Admin Panel</h1>
              <p className="text-zinc-400 mt-2">Manage users, subscriptions and promo codes.</p>
            </div>
            <div className="flex items-center gap-2">
              <Link 
                href="/admin/users" 
                className="px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-sm font-medium text-white hover:bg-zinc-800 transition-colors"
              >
                Users
              </Link>
              <Link 
                href="/admin/promos" 
                className="px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-sm font-medium text-white hover:bg-zinc-800 transition-colors"
              >
                Promo Codes
              </Link>
            </div>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
