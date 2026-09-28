"use client"

import { useEffect, useState } from "react"

export default function CommunityPage() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 60)
    return () => clearTimeout(timer)
  }, [])

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07080b] text-white">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&display=swap');

        @keyframes imcCommunityFlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 200% 50%; }
        }

        @keyframes imcCommunityFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }

        @keyframes imcCommunityPulse {
          0%, 100% { opacity: .35; transform: scaleX(1); }
          50% { opacity: 1; transform: scaleX(1.15); }
        }

        .imc-community-font {
          font-family: "Space Grotesk", sans-serif !important;
        }

        .imc-community-flow {
          font-family: "Space Grotesk", sans-serif !important;
          font-weight: 700 !important;
          background-image: linear-gradient(
            90deg,
            #ffffff 0%,
            #ffffff 12%,
            #ef4444 25%,
            #f97316 37%,
            #ec4899 49%,
            #a855f7 61%,
            #22d3ee 74%,
            #ffffff 87%,
            #ffffff 100%
          ) !important;
          background-size: 200% 100% !important;
          background-clip: text !important;
          -webkit-background-clip: text !important;
          color: transparent !important;
          -webkit-text-fill-color: transparent !important;
          animation: imcCommunityFlow 8s linear infinite !important;
        }

        .imc-community-float {
          animation: imcCommunityFloat 5s ease-in-out infinite;
        }

        .imc-community-pulse {
          animation: imcCommunityPulse 3s ease-in-out infinite;
          transform-origin: center;
        }

        @media (prefers-reduced-motion: reduce) {
          .imc-community-flow,
          .imc-community-float,
          .imc-community-pulse {
            animation: none !important;
          }
        }
      `}</style>

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
          className={`absolute inset-0 bg-[#07080b] transition-opacity duration-500 ${
            ready ? "opacity-0" : "opacity-100"
          }`}
        />
      </div>

      <div
        className={`imc-community-font relative transition-all duration-1000 ease-out ${
          ready
            ? "scale-100 opacity-100"
            : "scale-[0.96] opacity-0"
        }`}
      >
        {/* Background */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-[-180px] top-[-160px] h-[600px] w-[600px] rounded-full bg-red-600/[0.08] blur-[150px]" />
          <div className="absolute bottom-[-200px] right-[-160px] h-[600px] w-[600px] rounded-full bg-purple-600/[0.05] blur-[150px]" />

          <div
            className="absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.7) 1px, transparent 1px)",
              backgroundSize: "70px 70px",
              maskImage:
                "linear-gradient(to bottom, black 0%, black 45%, transparent 90%)",
            }}
          />
        </div>

        {/* HERO */}
        <section className="relative mx-auto max-w-7xl px-5 pb-16 pt-28 sm:px-8 md:pb-20 md:pt-36">
          <div className="grid items-end gap-12 lg:grid-cols-[1fr_330px]">
            <div>
              <div className="mb-7 flex items-center gap-3">
                <span className="h-px w-10 bg-red-500" />

                <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-red-400">
                  IMC Community
                </p>

                <span className="h-1.5 w-1.5 rounded-full bg-red-500 shadow-[0_0_12px_rgba(239,68,68,.8)]" />
              </div>

              <h1 className="max-w-4xl text-5xl font-black leading-[0.95] tracking-[-0.04em] sm:text-7xl lg:text-8xl">
                Stay Connected
                <span className="imc-community-flow mt-2 block">
                  with IMC.
                </span>
              </h1>

              <div className="mt-8 max-w-2xl space-y-3 text-sm leading-7 text-zinc-500 sm:text-base">
                <p>
                  Want to stay updated, meet the community, and see what
                  we're working on?
                </p>

                <p>
                  You can find the International Minecraft Community across
                  our official platforms. Join us, stay connected, and be part
                  of IMC.
                </p>
              </div>

              <div className="imc-community-pulse mt-9 h-[2px] w-20 bg-gradient-to-r from-red-500 via-red-400 to-transparent" />
            </div>

            {/* COMMUNITY STATUS */}
            <div className="relative">
              <div className="absolute -inset-5 rounded-[2rem] bg-red-500/[0.035] blur-2xl" />

              <div className="imc-community-float relative overflow-hidden rounded-[1.75rem] border border-white/[0.08] bg-white/[0.025] p-6 backdrop-blur-xl">
                <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-red-500/[0.07] blur-3xl" />

                <div className="relative flex items-center justify-between">
                  <span className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600">
                    Community Status
                  </span>

                  <span className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.2em] text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,.8)]" />
                    Online
                  </span>
                </div>

                <div className="relative mt-9">
                  <p className="text-5xl font-black tracking-[-0.04em]">
                    IMC
                  </p>

                  <p className="mt-3 text-xs leading-6 text-zinc-500">
                    Connect with Minecraft players, discover new content,
                    and follow everything happening across the community.
                  </p>
                </div>

                <div className="mt-7 flex items-center gap-3">
                  <span className="h-px flex-1 bg-white/[0.06]" />
                  <span className="text-[8px] font-bold uppercase tracking-[0.25em] text-zinc-700">
                    Official Platforms
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PLATFORM SECTION */}
        <section className="relative mx-auto max-w-7xl px-5 pb-24 sm:px-8">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-red-400">
                Connect
              </p>

              <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
                Find us online
              </h2>
            </div>

            <span className="hidden text-[9px] font-bold uppercase tracking-[0.25em] text-zinc-700 sm:block">
              02 Platforms
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Discord */}
            <a
              href="https://discord.gg/Wyd6Z3wJeN"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                transitionDelay: ready ? "150ms" : "0ms",
              }}
              className={`group relative overflow-hidden rounded-[1.75rem] border border-white/[0.08] bg-white/[0.02] p-7 backdrop-blur-xl transition-all duration-700 hover:-translate-y-1 hover:border-red-500/30 hover:bg-red-500/[0.035] hover:shadow-[0_25px_80px_rgba(220,38,38,0.12)] sm:p-9 ${
                ready
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }`}
            >
              <div className="absolute right-[-70px] top-[-70px] h-48 w-48 rounded-full bg-red-500/[0.05] blur-3xl transition-all duration-500 group-hover:bg-red-500/[0.10]" />

              <div className="relative flex items-start justify-between">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/[0.08] text-xl text-red-400 shadow-[0_0_30px_rgba(239,68,68,.05)]">
                  ◈
                </div>

                <span className="text-[9px] font-black uppercase tracking-[0.25em] text-zinc-700 transition-colors group-hover:text-red-500/60">
                  01
                </span>
              </div>

              <div className="relative mt-8">
                <h2 className="text-2xl font-black tracking-tight">
                  Discord
                </h2>

                <p className="mt-3 max-w-md text-sm leading-7 text-zinc-500">
                  Join our Discord community, chat with members, and stay up
                  to date with IMC.
                </p>
              </div>

              <div className="relative mt-8 flex items-center justify-between border-t border-white/[0.06] pt-5">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-400">
                  Join Discord
                </span>

                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.08] text-sm text-zinc-500 transition-all duration-300 group-hover:translate-x-1 group-hover:border-red-500/30 group-hover:text-red-400">
                  →
                </span>
              </div>
            </a>

            {/* YouTube */}
            <a
              href="https://youtube.com/@internationalminecrafttierlist?si=zORiipO1RXz-hHYB"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                transitionDelay: ready ? "300ms" : "0ms",
              }}
              className={`group relative overflow-hidden rounded-[1.75rem] border border-white/[0.08] bg-white/[0.02] p-7 backdrop-blur-xl transition-all duration-700 hover:-translate-y-1 hover:border-red-500/30 hover:bg-red-500/[0.035] hover:shadow-[0_25px_80px_rgba(220,38,38,0.12)] sm:p-9 ${
                ready
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }`}
            >
              <div className="absolute right-[-70px] top-[-70px] h-48 w-48 rounded-full bg-red-500/[0.05] blur-3xl transition-all duration-500 group-hover:bg-red-500/[0.10]" />

              <div className="relative flex items-start justify-between">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/[0.08] text-xl text-red-400 shadow-[0_0_30px_rgba(239,68,68,.05)]">
                  ▶
                </div>

                <span className="text-[9px] font-black uppercase tracking-[0.25em] text-zinc-700 transition-colors group-hover:text-red-500/60">
                  02
                </span>
              </div>

              <div className="relative mt-8">
                <h2 className="text-2xl font-black tracking-tight">
                  YouTube
                </h2>

                <p className="mt-3 max-w-md text-sm leading-7 text-zinc-500">
                  Follow our YouTube channel for videos, updates, and
                  Minecraft content.
                </p>
              </div>

              <div className="relative mt-8 flex items-center justify-between border-t border-white/[0.06] pt-5">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-400">
                  Visit YouTube
                </span>

                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.08] text-sm text-zinc-500 transition-all duration-300 group-hover:translate-x-1 group-hover:border-red-500/30 group-hover:text-red-400">
                  →
                </span>
              </div>
            </a>
          </div>
        </section>

        {/* COMMUNITY MESSAGE */}
        <section className="relative border-t border-white/[0.06]">
          <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
            <div className="relative overflow-hidden rounded-[2rem] border border-red-500/[0.10] bg-red-500/[0.025] p-7 sm:p-10">
              <div className="absolute right-[-100px] top-[-100px] h-64 w-64 rounded-full bg-red-500/[0.06] blur-[100px]" />

              <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-red-400">
                    Be part of it
                  </p>

                  <h3 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">
                    The community is what makes IMC.
                  </h3>

                  <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-500">
                    Connect, share, compete, and enjoy Minecraft alongside
                    other members of the community.
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  <span className="h-px w-10 bg-red-500/40" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-700">
                    IMC
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER IDENTITY */}
        <div className="border-t border-white/[0.06]">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <p className="text-xs text-zinc-600">
              International Minecraft Community
            </p>

            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-800">
              IMC
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
