import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const token = request.cookies.get("imc_session")?.value;
  const localUsername = request.cookies.get("imc_username")?.value;

  // Local browser accounts are authenticated through imc_username.
  // Admin authorization is handled separately by the admin layout.
  if (localUsername) {
    return NextResponse.next();
  }

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set(
      "redirect",
      request.nextUrl.pathname + request.nextUrl.search
    );
    return NextResponse.redirect(loginUrl);
  }

  const session = await getSession(token);

  if (!session?.id) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("imc_session");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
  ],
};
