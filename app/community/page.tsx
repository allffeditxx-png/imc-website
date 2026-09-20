"use client"

import { useEffect, useState } from "react"

export default function CommunityPage() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 60)
    return () => clearTimeout(timer)
  }, [])

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#080808] px-5 py-24 text-white sm:px-8">

      {/* Community Page Transition */}
      <div
        className={`pointer-events-none fixed inset-0 z-[9999] overflow-hidden transition-opacity duration-700 ${
          ready ? "opacity-0" : "opacity-100"
        }`}
      >
        <div
          className={`absolute left-1/2 top-1/2 h-[20px] w-[20px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500 shadow-[0_0_60px_rgba(239,68,68,0.9)] transition-all duration-[900ms] ease-out ${
            ready ? "scale-[120]" : "scale-100"
          }`}
        />

        <div
          className={`absolute inset-0 bg-[#080808] transition-opacity duration-500 ${
            ready ? "opacity-0" : "opacity-100"
          }`}
        />
      </div>

      <div
        className={`relative mx-auto max-w-5xl transition-all duration-1000 ease-out ${
          ready
            ? "scale-100 opacity-100"
            : "scale-[0.96] opacity-0"
        }`}
      >

        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-red-700/15 blur-[130px]" />
          <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-red-900/10 blur-[130px]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:55px_55px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
        </div>

        <div className="relative">

          <div className="inline-flex items-center rounded-full border border-red-500/20 bg-red-500/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-red-400">
            IMC Community
          </div>

          <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-6xl">
            Stay Connected
            <span className="block bg-gradient-to-r from-white via-red-100 to-red-500 bg-clip-text text-transparent">
              with IMC
            </span>
          </h1>

          <div className="mt-8 max-w-3xl">
            <p className="text-base leading-8 text-gray-300 sm:text-lg">
              Want to stay updated, meet the community, and see what we're
              working on?
            </p>

            <p className="mt-4 text-base leading-8 text-gray-400 sm:text-lg">
              You can find the International Minecraft Community across our
              official platforms. Join us, stay connected, and be part of IMC.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2">

            <a
              href="https://discord.gg/Wyd6Z3wJeN"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                transitionDelay: ready ? "150ms" : "0ms",
              }}
              className={`group rounded-3xl border border-white/10 bg-white/[0.045] p-7 backdrop-blur-xl transition-all duration-700 hover:-translate-y-2 hover:border-red-500/40 hover:bg-red-500/[0.07] hover:shadow-[0_20px_60px_rgba(220,38,38,0.15)] ${
                ready
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }`}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 text-2xl">
                ◈
              </div>

              <h2 className="mt-7 text-2xl font-bold">
                Discord
              </h2>

              <p className="mt-3 leading-6 text-gray-400">
                Join our Discord community, chat with members, and stay up to
                date with IMC.
              </p>

              <div className="mt-7 flex items-center gap-2 text-sm font-semibold text-red-400 transition-all group-hover:gap-4">
                Join Discord
                <span>→</span>
              </div>
            </a>

            <a
              href="https://youtube.com/@internationalminecrafttierlist?si=zORiipO1RXz-hHYB"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                transitionDelay: ready ? "300ms" : "0ms",
              }}
              className={`group rounded-3xl border border-white/10 bg-white/[0.045] p-7 backdrop-blur-xl transition-all duration-700 hover:-translate-y-2 hover:border-red-500/40 hover:bg-red-500/[0.07] hover:shadow-[0_20px_60px_rgba(220,38,38,0.15)] ${
                ready
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }`}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 text-2xl">
                ▶
              </div>

              <h2 className="mt-7 text-2xl font-bold">
                YouTube
              </h2>

              <p className="mt-3 leading-6 text-gray-400">
                Follow our YouTube channel for videos, updates, and Minecraft
                content.
              </p>

              <div className="mt-7 flex items-center gap-2 text-sm font-semibold text-red-400 transition-all group-hover:gap-4">
                Visit YouTube
                <span>→</span>
              </div>
            </a>

          </div>

          <div className="mt-14 flex items-center gap-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />
            <span className="text-xs uppercase tracking-[0.3em] text-gray-600">
              IMC
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />
          </div>

        </div>
      </div>
    </main>
  )
}
