"use client"

import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

function LoginContent() {
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect") || "/"

  const loginUrl = `/api/auth/discord?redirect=${encodeURIComponent(redirect)}`
  const guestUrl =
    redirect.startsWith("/dashboard") || redirect.startsWith("/admin")
      ? "/"
      : redirect

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

          <a
            href={loginUrl}
            className="group relative mt-8 block overflow-hidden rounded-xl bg-gradient-to-r from-red-700 via-red-600 to-red-500 px-6 py-3.5 font-semibold shadow-[0_0_30px_rgba(220,38,38,0.25)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(220,38,38,0.5)]"
          >
            <span className="relative z-10">
              Continue with Discord
            </span>

            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          </a>

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
