import { SignJWT, jwtVerify } from "jose"

const secret = new TextEncoder().encode(process.env.SESSION_SECRET!)

export async function createSession(user: {
  id: string
  username: string
  global_name?: string | null
  avatar?: string | null
}) {
  return await new SignJWT({
    id: user.id,
    username: user.username,
    global_name: user.global_name ?? null,
    avatar: user.avatar ?? null,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret)
}

export async function getSession(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret)
    return payload
  } catch {
    return null
  }
}
