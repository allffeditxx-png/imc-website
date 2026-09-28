"use client"

import { useEffect, useState } from "react"

export default function AboutPage() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 60)
    return () => clearTimeout(timer)
  }, [])

  return (
    <main className="min-h-screen bg-[#07080b] text-white">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&display=swap');

        @keyframes imcAboutFlow {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 200% 50%;
          }
        }

        @keyframes imcAboutFloat {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-4px);
          }
        }

        @keyframes imcAboutPulse {
          0%, 100% {
            opacity: .35;
            transform: scaleX(1);
          }
          50% {
            opacity: 1;
            transform: scaleX(1.15);
          }
        }

        @keyframes imcAboutGlow {
          0%, 100% {
            opacity: .18;
          }
          50% {
            opacity: .35;
          }
        }

        .imc-about-flow {
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
          background-position: 0% 50%;
          background-clip: text !important;
          -webkit-background-clip: text !important;
          color: transparent !important;
          -webkit-text-fill-color: transparent !important;
          animation: imcAboutFlow 8s linear infinite !important;
        }

        .imc-about-font {
          font-family: "Space Grotesk", sans-serif !important;
        }

        .imc-about-float {
          animation: imcAboutFloat 5s ease-in-out infinite;
        }

        .imc-about-pulse {
          animation: imcAboutPulse 3s ease-in-out infinite;
          transform-origin: center;
        }

        .imc-about-glow {
          animation: imcAboutGlow 5s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .imc-about-flow,
          .imc-about-float,
          .imc-about-pulse,
          .imc-about-glow {
            animation: none !important;
          }
        }
      `}</style>

      {/* About Page Transition */}
      <div
        className={`pointer-events-none fixed inset-0 z-[9999] ${
          ready ? "opacity-0" : "opacity-100"
        } transition-opacity duration-500`}
      >
        <div
          className={`absolute inset-y-0 left-0 w-[2px] bg-red-500 shadow-[0_0_30px_rgba(239,68,68,0.9)] transition-all duration-[900ms] ease-out ${
            ready ? "left-full opacity-0" : "left-1/2 opacity-100"
          }`}
        />
        <div
          className={`absolute inset-0 bg-[#07080b] transition-opacity duration-700 ${
            ready ? "opacity-0" : "opacity-100"
          }`}
        />
        <div
          className={`absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-600/20 blur-[80px] transition-all duration-700 ${
            ready ? "scale-[2.5] opacity-0" : "scale-100 opacity-100"
          }`}
        />
      </div>

      <div
        className={`imc-about-font transition-all duration-1000 ease-out ${
          ready
            ? "translate-y-0 opacity-100 blur-0"
            : "translate-y-8 opacity-0 blur-sm"
        }`}
      >
        {/* HERO */}
        <section className="relative overflow-hidden border-b border-white/[0.06]">
          <div className="absolute inset-0 overflow-hidden">
            <div className="imc-about-glow absolute left-1/2 top-[-180px] h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-red-600/[0.10] blur-[150px]" />
            <div className="absolute right-[-160px] top-[120px] h-[300px] w-[300px] rounded-full bg-purple-600/[0.05] blur-[120px]" />

            <div
              className="absolute inset-0 opacity-[0.035]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.7) 1px, transparent 1px)",
                backgroundSize: "70px 70px",
              }}
            />
          </div>

          <div className="relative mx-auto max-w-7xl px-5 pb-24 pt-28 sm:px-8 md:pb-32 md:pt-36">
            <div className="grid items-end gap-12 lg:grid-cols-[1fr_360px]">
              <div>
                <div className="mb-7 flex items-center gap-3">
                  <span className="h-px w-10 bg-red-500" />
                  <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-red-400">
                    About IMC
                  </p>
                </div>

                <h1 className="max-w-4xl text-5xl font-black leading-[0.95] tracking-[-0.04em] sm:text-7xl lg:text-8xl">
                  More than
                  <span className="imc-about-flow mt-2 block">
                    Minecraft.
                  </span>
                </h1>

                <p className="mt-8 max-w-2xl text-sm leading-7 text-zinc-500 sm:text-base">
                  International Minecraft Community
                </p>

                <div className="imc-about-pulse mt-8 h-[2px] w-20 bg-gradient-to-r from-red-500 via-red-400 to-transparent" />
              </div>

              <div className="relative">
                <div className="absolute -inset-4 rounded-[2rem] bg-red-500/[0.04] blur-2xl" />

                <div className="relative overflow-hidden rounded-[1.75rem] border border-white/[0.08] bg-white/[0.025] p-6 backdrop-blur-xl">
                  <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-red-500/[0.08] blur-3xl" />

                  <div className="relative flex items-center justify-between">
                    <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-zinc-600">
                      Community
                    </span>
                    <span className="h-2 w-2 rounded-full bg-red-500 shadow-[0_0_12px_rgba(239,68,68,.8)]" />
                  </div>

                  <div className="relative mt-8">
                    <p className="text-4xl font-black tracking-tight">IMC</p>
                    <p className="mt-2 text-xs leading-5 text-zinc-500">
                      Built around Minecraft and the people who make the game
                      more enjoyable, competitive, and creative.
                    </p>
                  </div>

                  <div className="mt-7 flex items-center gap-2">
                    <span className="h-px flex-1 bg-white/[0.06]" />
                    <span className="text-[8px] font-bold uppercase tracking-[0.25em] text-zinc-700">
                      International Minecraft Community
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* IDENTITY STRIP */}
        <section className="mx-auto max-w-7xl px-5 pt-10 sm:px-8">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="group rounded-2xl border border-white/[0.07] bg-white/[0.018] p-5 transition-all duration-300 hover:border-red-500/20 hover:bg-white/[0.03]">
              <p className="text-[9px] font-black uppercase tracking-[0.28em] text-red-400">
                01
              </p>
              <p className="mt-3 text-sm font-bold text-white">Community</p>
              <p className="mt-1 text-xs leading-5 text-zinc-600">
                A place for Minecraft players to connect.
              </p>
            </div>

            <div className="group rounded-2xl border border-white/[0.07] bg-white/[0.018] p-5 transition-all duration-300 hover:border-red-500/20 hover:bg-white/[0.03]">
              <p className="text-[9px] font-black uppercase tracking-[0.28em] text-red-400">
                02
              </p>
              <p className="mt-3 text-sm font-bold text-white">Competition</p>
              <p className="mt-1 text-xs leading-5 text-zinc-600">
                Built for players who enjoy competitive Minecraft.
              </p>
            </div>

            <div className="group rounded-2xl border border-white/[0.07] bg-white/[0.018] p-5 transition-all duration-300 hover:border-red-500/20 hover:bg-white/[0.03]">
              <p className="text-[9px] font-black uppercase tracking-[0.28em] text-red-400">
                03
              </p>
              <p className="mt-3 text-sm font-bold text-white">Creativity</p>
              <p className="mt-1 text-xs leading-5 text-zinc-600">
                A community for ideas, projects, and content.
              </p>
            </div>
          </div>
        </section>

        {/* STORY */}
        <section className="mx-auto max-w-7xl px-5 pb-24 pt-16 sm:px-8 md:pt-24">
          <div className="grid gap-12 lg:grid-cols-[220px_1fr] lg:gap-20">
            <div className="lg:pt-2">
              <div className="sticky top-24">
                <div className="flex items-center gap-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">
                    Our Story
                  </p>
                </div>

                <div className="mt-5 hidden h-px w-20 bg-gradient-to-r from-red-500 to-transparent lg:block" />

                <p className="mt-5 hidden max-w-[160px] text-xs leading-6 text-zinc-700 lg:block">
                  A community built by players, for players.
                </p>
              </div>
            </div>

            <article className="relative overflow-hidden rounded-[2rem] border border-white/[0.07] bg-white/[0.018]">
              <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-red-500 via-red-500/30 to-transparent" />
              <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-red-500/[0.035] blur-[100px]" />

              <div className="relative p-7 sm:p-10 md:p-14">
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-red-400">
                      Who we are
                    </p>

                    <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                      About IMC
                    </h2>
                  </div>

                  <span className="hidden text-xs font-black tracking-[0.3em] text-zinc-800 sm:block">
                    IMC
                  </span>
                </div>

                <div className="mt-8 h-px bg-white/[0.06]" />

                <div className="mt-9 space-y-7 text-sm leading-8 text-zinc-400 sm:text-base sm:leading-8">
                  <p>
                    <strong className="font-bold text-white">
                      International Minecraft Community (IMC)
                    </strong>{" "}
                    is a community built around Minecraft and the people who
                    make the game more enjoyable, competitive, and creative.
                  </p>

                  <p>
                    Our goal is simple:{" "}
                    <strong className="font-bold text-white">
                      bring Minecraft players together in one place.
                    </strong>
                  </p>

                  <p>
                    From discovering useful resources and community projects
                    to sharing content and connecting with other players, IMC
                    is designed to be a place where Minecraft enthusiasts can
                    find something valuable.
                  </p>

                  <p>
                    We believe a strong community is built by its members.
                    That's why we're focused on creating an open, welcoming,
                    and active environment where players can connect, share,
                    and grow together.
                  </p>

                  <p>
                    Whether you're here to discover something new, contribute
                    to the community, or simply enjoy Minecraft with others,{" "}
                    <strong className="font-bold text-white">
                      you're welcome at IMC.
                    </strong>
                  </p>
                </div>

                <div className="mt-10 overflow-hidden rounded-2xl border border-red-500/[0.12] bg-red-500/[0.035] p-5 sm:p-6">
                  <div className="flex gap-4">
                    <div className="mt-2 h-8 w-1 shrink-0 rounded-full bg-gradient-to-b from-red-500 to-red-500/10" />
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-[0.25em] text-red-400">
                        IMC
                      </p>
                      <p className="mt-2 text-sm font-semibold leading-7 text-white sm:text-base">
                        Welcome to the International Minecraft Community.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </section>

        {/* FOOTER IDENTITY */}
        <section className="border-t border-white/[0.06]">
          <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-bold text-white">
                  International Minecraft Community
                </p>
                <p className="mt-1 text-xs text-zinc-600">
                  Built for the Minecraft community.
                </p>
              </div>

              <div className="flex items-center gap-4">
                <span className="h-px w-8 bg-red-500/40" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-700">
                  IMC
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
