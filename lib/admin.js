import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function isAdmin() {
  const session = await auth();
  
  if (!session || !session.user) {
    return false;
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  // Note: We're not checking password here because the user is already authenticated via NextAuth.
  // The user must be logged in with the email that matches the ADMIN_EMAIL env variable.
  // If you want a separate password, we would need a different flow, 
  // but usually, email-based admin check is standard for NextAuth.
  
  return session.user.email === adminEmail;
}

export function adminError() {
  return NextResponse.json({ error: "Unauthorized. Admin access only." }, { status: 401 });
}
