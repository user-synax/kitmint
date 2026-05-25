import { isAdmin } from "@/lib/admin";
import { redirect } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import { auth } from "@/lib/auth";

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
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-white font-dm-sans">Admin Panel</h1>
            <p className="text-zinc-400 mt-2">Manage users and kit credits.</p>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
