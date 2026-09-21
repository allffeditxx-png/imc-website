"use client"

import { useSearchParams } from "next/navigation"
import { Suspense, useState } from "react"

function LoginContent() {
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect") || "/"

  const guestUrl =
    redirect.startsWith("/dashboard") || redirect.startsWith("/admin")
      ? "/"
      : redirect

  const [registerOpen, setRegisterOpen] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const hashPassword = async (value: string) => {
    const encoder = new TextEncoder()
    const data = encoder.encode(value)
    const hashBuffer = await crypto.subtle.digest("SHA-256", data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))

    return hashArray
      .map(byte => byte.toString(16).padStart(2, "0"))
      .join("")
  }

  const register = async () => {
    const cleanUsername = username.trim()

    if (!cleanUsername || !password) {
      setError("Enter a username and password.")
      return
    }

    if (cleanUsername.length < 3) {
      setError("Username must be at least 3 characters.")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.")
      return
    }

    const existing = localStorage.getItem("imc_account")

    if (existing) {
      setError("An account is already registered on this browser.")
      return
    }

    const passwordHash = await hashPassword(password)

    localStorage.setItem(
      "imc_account",
      JSON.stringify({
        username: cleanUsername,
        passwordHash,
      })
    )

    localStorage.setItem(
      "imc_user",
      JSON.stringify({
        username: cleanUsername,
      })
    )

    document.cookie = `imc_username=${encodeURIComponent(cleanUsername)}; path=/; max-age=31536000; samesite=lax`

    window.location.href = redirect
  }

  const login = async () => {
    const cleanUsername = username.trim()

    if (!cleanUsername || !password) {
      setError("Enter your username and password.")
      return
    }

    const stored = localStorage.getItem("imc_account")

    if (!stored) {
      setError("No account is registered on this browser.")
      return
    }

    try {
      const account = JSON.parse(stored)
      const passwordHash = await hashPassword(password)

      if (
        String(account.username).toLowerCase() !== cleanUsername.toLowerCase() ||
        account.passwordHash !== passwordHash
      ) {
        setError("Incorrect username or password.")
        return
      }

      localStorage.setItem(
        "imc_user",
        JSON.stringify({
          username: account.username,
        })
      )

      document.cookie = `imc_username=${encodeURIComponent(account.username)}; path=/; max-age=31536000; samesite=lax`

      window.location.href = redirect
    } catch {
      setError("Unable to log in.")
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-6 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(220,38,38,0.35),transparent_45%),linear-gradient(to_bottom,#160000,#050505_55%,#000)]" />

      <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-600/10 blur-3xl" />

      <div className="relative z-10 w-full max-w-md">
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center shadow-[0_0_50px_rgba(220,38,38,0.12)] backdrop-blur-2xl sm:p-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-red-700 to-red-500 text-xl font-black shadow-[0_0_30px_rgba(220,38,38,0.3)]">
            IMC
          </div>

          <p className="mt-8 text-xs uppercase tracking-[0.35em] text-red-500">
            International Minecraft Community
          </p>

          <h1 className="mt-3 text-3xl font-black">
            Welcome to IMC
          </h1>

          <p className="mt-3 text-sm leading-6 text-gray-500">
            Sign in to continue to the IMC community.
          </p>

          <button
            type="button"
            disabled
            onClick={() => alert("Discord login will be added soon.")}
            className="mt-8 block w-full cursor-not-allowed rounded-xl bg-white/10 px-6 py-3.5 font-semibold text-gray-500"
          >
            Continue with Discord
          </button>

          <button
            type="button"
            onClick={() => {
              setError("")
              setUsername("")
              setPassword("")
              setLoginOpen(true)
            }}
            className="mt-3 block w-full rounded-xl border border-white/10 bg-white/[0.03] px-6 py-3.5 font-semibold text-gray-300 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
          >
            Login
          </button>

          <button
            type="button"
            onClick={() => {
              setError("")
              setUsername("")
              setPassword("")
              setRegisterOpen(true)
            }}
            className="mt-3 block w-full rounded-xl border border-red-500/30 bg-red-500/5 px-6 py-3.5 font-semibold text-red-400 transition-all duration-300 hover:border-red-500/60 hover:bg-red-500/10"
          >
            Register
          </button>

          <a
            href={guestUrl}
            className="mt-3 block rounded-xl border border-white/10 bg-white/[0.03] px-6 py-3.5 font-semibold text-gray-300 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
          >
            Continue as Guest
          </a>

          <p className="mt-6 text-xs text-gray-600">
            By continuing, you agree to use Discord authentication for your IMC account.
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-gray-700">
          © IMC — International Minecraft Community
        </p>
      </div>

      {registerOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 px-6 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0b0b0b] p-8 shadow-[0_0_50px_rgba(220,38,38,0.2)]">
            <h2 className="text-2xl font-black">
              Create your account
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Your account will be stored locally on this browser.
            </p>

            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="mt-6 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-gray-600 focus:border-red-500/50"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="mt-3 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-gray-600 focus:border-red-500/50"
            />

            {error && (
              <p className="mt-3 text-sm text-red-400">
                {error}
              </p>
            )}

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setRegisterOpen(false)
                  setError("")
                }}
                className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-semibold text-gray-400 transition hover:bg-white/10 hover:text-white"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={register}
                className="flex-1 rounded-xl bg-gradient-to-r from-red-700 via-red-600 to-red-500 px-4 py-3 font-semibold"
              >
                Create Account
              </button>
            </div>
          </div>
        </div>
      )}

      {loginOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 px-6 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0b0b0b] p-8 shadow-[0_0_50px_rgba(220,38,38,0.2)]">
            <h2 className="text-2xl font-black">
              Login to your account
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Use the account registered on this browser.
            </p>

            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="mt-6 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-gray-600 focus:border-red-500/50"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="mt-3 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-gray-600 focus:border-red-500/50"
            />

            {error && (
              <p className="mt-3 text-sm text-red-400">
                {error}
              </p>
            )}

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setLoginOpen(false)
                  setError("")
                }}
                className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-semibold text-gray-400 transition hover:bg-white/10 hover:text-white"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={login}
                className="flex-1 rounded-xl bg-gradient-to-r from-red-700 via-red-600 to-red-500 px-4 py-3 font-semibold"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-black" />}>
      <LoginContent />
    </Suspense>
  )
}
