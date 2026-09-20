"use client"

import { useEffect, useState } from "react"

export default function AboutPage() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 60)
    return () => clearTimeout(timer)
  }, [])

  return (
    <main className="min-h-screen bg-[#0d0d0d] text-white">

      {/* About Page Transition */}
      <div
        className={`pointer-events-none fixed inset-0 z-[9999] ${
          ready ? "opacity-0" : "opacity-100"
        } transition-opacity duration-500`}
      >
        <div
          className={`absolute inset-y-0 left-0 w-[2px] bg-red-500 shadow-[0_0_30px_rgba(239,68,68,0.9)] transition-all duration-[900ms] ease-out ${
            ready
              ? "left-full opacity-0"
              : "left-1/2 opacity-100"
          }`}
        />

        <div
          className={`absolute inset-0 bg-[#0d0d0d] transition-opacity duration-700 ${
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
        className={`transition-all duration-1000 ease-out ${
          ready
            ? "translate-y-0 opacity-100 blur-0"
            : "translate-y-8 opacity-0 blur-sm"
        }`}
      >

        <section className="relative overflow-hidden px-5 pb-20 pt-28 sm:px-8">
          <div className="absolute inset-0">
            <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-red-600/[0.08] blur-[140px]" />
          </div>

          <div className="relative mx-auto max-w-5xl">
            <div className="grid items-end gap-10 md:grid-cols-[1fr_280px]">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.4em] text-red-500">
                  About IMC
                </p>

                <h1 className="mt-6 text-5xl font-black tracking-tight sm:text-7xl">
                  More than
                  <span className="block text-gray-500">
                    Minecraft.
                  </span>
                </h1>
              </div>

              <div className="border-l border-red-500/30 pl-6">
                <p className="text-sm leading-7 text-gray-500">
                  International Minecraft Community
                </p>

                <div className="mt-4 h-1 w-12 rounded-full bg-red-600" />
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-5 pb-24 sm:px-8">
          <div className="grid gap-10 md:grid-cols-[180px_1fr]">
            <div className="text-xs font-bold uppercase tracking-[0.3em] text-gray-600">
              Our Story
            </div>

            <article className="border-t border-white/10 pt-8">
              <h2 className="text-2xl font-bold sm:text-3xl">
                About IMC
              </h2>

              <div className="mt-7 space-y-6 text-base leading-8 text-gray-400 sm:text-lg">

                <p>
                  <strong className="text-white">
                    International Minecraft Community (IMC)
                  </strong>{" "}
                  is a community built around Minecraft and the people who make
                  the game more enjoyable, competitive, and creative.
                </p>

                <p>
                  Our goal is simple:{" "}
                  <strong className="text-white">
                    bring Minecraft players together in one place.
                  </strong>
                </p>

                <p>
                  From discovering useful resources and community projects to
                  sharing content and connecting with other players, IMC is
                  designed to be a place where Minecraft enthusiasts can find
                  something valuable.
                </p>

                <p>
                  We believe a strong community is built by its members. That's
                  why we're focused on creating an open, welcoming, and active
                  environment where players can connect, share, and grow
                  together.
                </p>

                <p>
                  Whether you're here to discover something new, contribute to
                  the community, or simply enjoy Minecraft with others,{" "}
                  <strong className="text-white">
                    you're welcome at IMC.
                  </strong>
                </p>

                <div className="border-l-2 border-red-500 pl-5 pt-2 text-white">
                  Welcome to the International Minecraft Community.
                </div>

              </div>
            </article>
          </div>

          <div className="mt-20 border-t border-white/10 pt-10">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-white">
                  International Minecraft Community
                </p>

                <p className="mt-1 text-xs text-gray-600">
                  Built for the Minecraft community.
                </p>
              </div>

              <div className="text-xs uppercase tracking-[0.25em] text-gray-700">
                IMC
              </div>
            </div>
          </div>
        </section>

      </div>
    </main>
  )
}
