import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("imc_session")?.value;

  if (!token) {
    return NextResponse.json({ authenticated: false });
  }

  const session = await getSession(token);

  if (!session?.id) {
    return NextResponse.json({ authenticated: false });
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      id: String(session.id),
      username: session.username ?? null,
      global_name: session.global_name ?? null,
      avatar: session.avatar ?? null,
    },
  });
}
