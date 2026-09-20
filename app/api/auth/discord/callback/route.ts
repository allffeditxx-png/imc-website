import { NextResponse } from "next/server"
import { createSession } from "@/lib/auth"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get("code")
  const state = url.searchParams.get("state") || "/"

  const redirectPath =
    state.startsWith("/") && !state.startsWith("//")
      ? state
      : "/"

  if (!code) {
    return NextResponse.json(
      { error: "Missing authorization code" },
      { status: 400 }
    )
  }

  const tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: process.env.DISCORD_CLIENT_ID!,
      client_secret: process.env.DISCORD_CLIENT_SECRET!,
      grant_type: "authorization_code",
      code,
      redirect_uri: process.env.DISCORD_REDIRECT_URI!,
    }),
  })

  const tokenData = await tokenResponse.json()

  if (!tokenResponse.ok) {
    return NextResponse.json(
      { error: "Failed to exchange Discord code" },
      { status: 400 }
    )
  }

  const userResponse = await fetch("https://discord.com/api/users/@me", {
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
    },
  })

  const user = await userResponse.json()

  if (!userResponse.ok) {
    return NextResponse.json(
      { error: "Failed to fetch Discord user" },
      { status: 400 }
    )
  }

  const session = await createSession(user)

  const response = NextResponse.redirect(
    new URL(redirectPath, request.url)
  )

  response.cookies.set("imc_session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  })

  return response
}
