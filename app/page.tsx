"use client"
import FallingParticles from "@/components/FallingParticles";
import AccountButton from "@/components/AccountButton";

import { useEffect, useState } from "react"

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [pageReady, setPageReady] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)
  const [isWebAdmin, setIsWebAdmin] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setPageReady(true)
    }, 50)

    fetch("/api/auth/session", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        setAuthenticated(Boolean(data.authenticated))
      })
      .catch(() => {
        setAuthenticated(false)
      })

    try {
      const localUser = localStorage.getItem("imc_user")

      if (localUser) {
        const parsedUser = JSON.parse(localUser)
        const username = String(parsedUser?.username || "").trim()

        if (username) {
          fetch("https://raw.githubusercontent.com/allffeditxx-png/imc-webadmins/main/webadmins.json?ts=${Date.now()}", {
            cache: "no-store",
          })
            .then((res) => res.json())
            .then((admins) => {
              const authorized = Object.keys(admins || {}).some(
                (key) => key.toLowerCase() === username.toLowerCase()
              )

              setIsWebAdmin(authorized)
            })
            .catch(() => {
              setIsWebAdmin(false)
            })
        }
      }
    } catch {
      setIsWebAdmin(false)
    }

    return () => clearTimeout(timer)
  }, [])

  const playMenuSound = (opening: boolean) => {
    try {
      const AudioContext =
        window.AudioContext ||
        (window as any).webkitAudioContext

      const ctx = new AudioContext()
      const now = ctx.currentTime

      // Cinematic shutter whoosh
      const whoosh = ctx.createOscillator()
      const whooshGain = ctx.createGain()

      whoosh.type = "sine"
      whoosh.frequency.setValueAtTime(
        opening ? 180 : 260,
        now
      )
      whoosh.frequency.exponentialRampToValueAtTime(
        opening ? 55 : 70,
        now + 0.16
      )

      whooshGain.gain.setValueAtTime(0.0001, now)
      whooshGain.gain.exponentialRampToValueAtTime(
        0.16,
        now + 0.015
      )
      whooshGain.gain.exponentialRampToValueAtTime(
        0.0001,
        now + 0.18
      )

      whoosh.connect(whooshGain)
      whooshGain.connect(ctx.destination)

      whoosh.start(now)
      whoosh.stop(now + 0.2)

      // Sharp mechanical click
      const click = ctx.createOscillator()
      const clickGain = ctx.createGain()

      click.type = "square"
      click.frequency.setValueAtTime(
        opening ? 950 : 750,
        now + 0.13
      )

      clickGain.gain.setValueAtTime(
        0.0001,
        now + 0.13
      )
      clickGain.gain.exponentialRampToValueAtTime(
        0.12,
        now + 0.135
      )
      clickGain.gain.exponentialRampToValueAtTime(
        0.0001,
        now + 0.18
      )

      click.connect(clickGain)
      clickGain.connect(ctx.destination)

      click.start(now + 0.13)
      click.stop(now + 0.19)

      setTimeout(() => ctx.close(), 300)
    } catch {}
  }

  const toggleMenu = () => {
    const next = !menuOpen
    setMenuOpen(next)
    playMenuSound(next)
  }

  const closeMenu = () => {
    setMenuOpen(false)
    playMenuSound(false)
  }

  return (
    <>
      {/* Home Page Transition */}
      <div
        className={`pointer-events-none fixed inset-0 z-[9999] overflow-hidden transition-opacity duration-300 ${
          pageReady ? "opacity-0" : "opacity-100"
        }`}
      >
        <div
          className={`absolute inset-y-0 left-0 w-1/2 bg-[#090000] transition-transform duration-700 ease-[cubic-bezier(0.77,0,0.18,1)] ${
            pageReady ? "-translate-x-full" : "translate-x-0"
          }`}
        >
          <div className="absolute right-0 top-0 h-full w-px bg-red-500/70 shadow-[0_0_25px_rgba(239,68,68,0.8)]" />
        </div>

        <div
          className={`absolute inset-y-0 right-0 w-1/2 bg-[#090000] transition-transform duration-700 ease-[cubic-bezier(0.77,0,0.18,1)] ${
            pageReady ? "translate-x-full" : "translate-x-0"
          }`}
        >
          <div className="absolute left-0 top-0 h-full w-px bg-red-500/70 shadow-[0_0_25px_rgba(239,68,68,0.8)]" />
        </div>

        <div
          className={`absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-600/30 blur-3xl transition-all duration-500 ${
            pageReady
              ? "scale-[3] opacity-0"
              : "scale-75 opacity-100"
          }`}
        />
      </div>

      <main className="min-h-screen bg-[#050505] text-white selection:bg-red-500/30">

      <FallingParticles />

      {/* IMC Atmospheric Lighting */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-18rem] h-[42rem] w-[42rem] -translate-x-1/2 rounded-full bg-red-600/[0.10] blur-[140px]" />
        <div className="absolute right-[-12rem] top-[25%] h-[30rem] w-[30rem] rounded-full bg-orange-500/[0.07] blur-[130px]" />
        <div className="absolute bottom-[-15rem] left-[-10rem] h-[30rem] w-[30rem] rounded-full bg-red-900/[0.10] blur-[130px]" />
      </div>

      {/* Navbar */}
      <nav className="fixed left-0 right-0 top-0 z-[100] border-b border-white/[0.06] bg-black/55 px-5 py-4 backdrop-blur-2xl shadow-[0_8px_40px_rgba(0,0,0,0.45)]">
        <div className="mx-auto flex max-w-7xl items-center justify-between">

          <a href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-400/30 bg-gradient-to-br from-red-600 via-red-500 to-orange-500 font-black shadow-[0_0_25px_rgba(239,68,68,0.35)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_35px_rgba(239,68,68,0.55)]">
              IMC
            </div>

            <div className="hidden sm:block">
              <p className="font-bold tracking-wide">
                International
              </p>
              <p className="text-xs text-gray-500">
                Minecraft Community
              </p>
            </div>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-2 md:flex">

            <a
              href="/"
              className="rounded-xl border border-red-400/25 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-200 shadow-[0_0_22px_rgba(239,68,68,0.18)] transition-all duration-300 hover:bg-red-500/20 hover:text-white hover:shadow-[0_0_32px_rgba(239,68,68,0.4)]"
            >
              Home
            </a>

            <a
              href="/about"
              className="rounded-xl px-4 py-2 text-sm text-gray-400 transition-all duration-300 hover:bg-white/[0.06] hover:text-white hover:-translate-y-0.5"
            >
              About
            </a>

            <a
              href="/downloads"
              className="rounded-xl px-4 py-2 text-sm text-gray-400 transition-all duration-300 hover:bg-white/[0.06] hover:text-white hover:-translate-y-0.5"
            >
              Downloads
            </a>

            <a
              href="/dashboard"
              className="rounded-xl px-4 py-2 text-sm text-gray-400 transition-all duration-300 hover:bg-white/[0.06] hover:text-white hover:-translate-y-0.5"
            >
              Tierlist
            </a>

            <a
              href="/ranked-rubrics"
              className="rounded-xl px-4 py-2 text-sm text-gray-400 transition-all duration-300 hover:bg-white/[0.06] hover:text-white hover:-translate-y-0.5"
            >
              Ranked Rubrics
            </a>
            <a
              href="/community"
              className="rounded-xl px-4 py-2 text-sm text-gray-400 transition-all duration-300 hover:bg-white/[0.06] hover:text-white hover:-translate-y-0.5"
            >
              Discord
            </a>

            {isWebAdmin && (
              <a
                href="/admin"
                className="rounded-xl px-4 py-2 text-sm text-gray-400 transition-all duration-300 hover:bg-white/[0.06] hover:text-white hover:-translate-y-0.5"
              >
                Admin Panel
              </a>
            )}

          </div>

          <div className="flex items-center gap-3">

            <AccountButton />

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              aria-label="Toggle menu"
              className="relative z-[120] flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 shadow-[0_0_20px_rgba(239,68,68,0.08)] transition-all duration-300 hover:border-yellow-400/60 hover:shadow-[0_0_45px_rgba(250,204,21,0.4),0_0_90px_rgba(245,158,11,0.15)] hover:bg-red-500/10 hover:shadow-[0_0_28px_rgba(239,68,68,0.25)] md:hidden"
            >
              <span className="relative block h-5 w-6">

                <span
                  className={`absolute left-0 top-0 h-0.5 w-6 rounded-full bg-white transition-all duration-500 ${
                    menuOpen
                      ? "top-[9px] rotate-45"
                      : ""
                  }`}
                />

                <span
                  className={`absolute left-0 top-[9px] h-0.5 w-6 rounded-full bg-white transition-all duration-300 ${
                    menuOpen
                      ? "scale-0 opacity-0"
                      : ""
                  }`}
                />

                <span
                  className={`absolute left-0 top-[18px] h-0.5 w-6 rounded-full bg-white transition-all duration-500 ${
                    menuOpen
                      ? "top-[9px] -rotate-45"
                      : ""
                  }`}
                />

              </span>
            </button>

          </div>

        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-[90] md:hidden transition-all duration-500 ${
          menuOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        <div
          className="absolute inset-0 bg-black/80 backdrop-blur-2xl"
          onClick={closeMenu}
        />

        <div
          className={`absolute right-0 top-0 h-full w-[88%] max-w-sm border-l border-red-500/20 bg-[#0b0505]/95 px-6 pb-10 pt-28 shadow-[-20px_0_80px_rgba(120,0,0,0.25)] transition-transform duration-500 ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="mb-10">
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-red-500">
              IMC Navigation
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight">
              Explore
            </h2>
            <div className="mt-4 h-px w-20 bg-red-500" />
          </div>

          <div className="space-y-2">
            {[
              ["Home", "/"],
              ["About", "/about"],
              ["Downloads", "/downloads"],
              ["Tierlist", "/tierlist"],
              ["Ranked Rubrics", "/ranked-rubrics"],
              ["Discord", "/community"],
              ["Admin Panel", "/admin"],
            ].map(([name, href], index) => (
              <a
                key={name}
                href={href}
                onClick={closeMenu}
                className={`flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.035] px-5 py-4 text-base font-semibold text-gray-300 transition-all duration-500 hover:border-cyan-500/40 hover:bg-cyan-500/10 hover:text-cyan-200 hover:shadow-[0_0_28px_rgba(6,182,212,0.18)] ${
                  menuOpen
                    ? "translate-x-0 opacity-100"
                    : "translate-x-10 opacity-0"
                }`}
                style={{
                  transitionDelay: menuOpen
                    ? `${150 + index * 60}ms`
                    : "0ms",
                }}
              >
                <span>{name}</span>
                <span className="text-red-500">→</span>
              </a>
            ))}
          </div>

          <div className="mt-8 border-t border-white/10 pt-6">
            {authenticated ? (
              <a
                href="/api/auth/logout"
                onClick={closeMenu}
                className="block rounded-2xl border border-red-500/30 bg-red-500/5 px-5 py-3 text-center text-sm font-semibold text-red-400 transition hover:border-red-500/60 hover:bg-red-500/10 hover:text-white hover:shadow-[0_0_30px_rgba(239,68,68,0.25)]"
              >
                Logout
              </a>
            ) : (
              <a
                href="/login"
                onClick={closeMenu}
                className="block rounded-2xl border border-red-500/30 bg-red-500/5 px-5 py-3 text-center text-sm font-semibold text-red-400 transition hover:border-red-500/60 hover:bg-red-500/10 hover:text-white hover:shadow-[0_0_30px_rgba(239,68,68,0.25)]"
              >
                Login
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="relative flex min-h-[92vh] items-center justify-center overflow-hidden px-6 pt-28 text-center">

        {/* Hero atmosphere */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(220,38,38,0.18),transparent_32%),radial-gradient(circle_at_80%_55%,rgba(245,158,11,0.08),transparent_25%),linear-gradient(180deg,#090909_0%,#050505_65%,#020202_100%)]" />

        <div className="absolute left-1/2 top-[38%] h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-600/[0.08] blur-[120px]" />

        {/* Decorative lines */}
        <div className="absolute left-0 right-0 top-1/2 h-px bg-gradient-to-r from-transparent via-red-500/20 to-transparent" />
        <div className="absolute left-1/2 top-24 h-[70%] w-px bg-gradient-to-b from-transparent via-red-500/[0.08] to-transparent" />

        <div className="relative z-10 w-full max-w-5xl">

          <div className="mx-auto mb-7 flex w-fit items-center gap-3 rounded-full border border-red-500/20 bg-red-500/[0.05] px-4 py-2 backdrop-blur-xl shadow-[0_0_30px_rgba(239,68,68,0.08)]">
            <span className="h-2 w-2 animate-pulse rounded-full bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.9)]" />
            <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-red-300">
              Minecraft PvP Tierlist
            </span>
          </div>

          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.45em] text-gray-500">
            International Minecraft Community
          </p>

          <h1 className="text-6xl font-black tracking-[-0.04em] sm:text-7xl md:text-9xl">
            <span className="text-white">IMC</span>
            <span className="ml-3 bg-gradient-to-r from-red-400 via-red-500 to-orange-400 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(239,68,68,0.35)]">
              TIERLIST
            </span>
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-gray-400 sm:text-lg">
            Test your skills. Earn your tier. Build your legacy.
            <br className="hidden sm:block" />
            The competitive Minecraft PvP community built around skill and fair testing.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <button
              type="button"
              onClick={() => {
                if (window.innerWidth >= 768) {
                  window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
                } else {
                  setMenuOpen(true);
                }
              }}
              className="group relative overflow-hidden rounded-xl border border-red-400/30 bg-red-600 px-8 py-3.5 font-bold text-white shadow-[0_0_25px_rgba(239,68,68,0.25)] transition-all duration-300 hover:-translate-y-1 hover:border-red-300 hover:bg-red-500 hover:shadow-[0_0_45px_rgba(239,68,68,0.5),0_0_80px_rgba(245,158,11,0.12)]"
            >
              <span className="relative z-10">Explore IMC</span>
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            </button>

            <a
              href="https://discord.gg/Wyd6Z3wJeN"
              className="group rounded-xl border border-white/10 bg-white/[0.04] px-8 py-3.5 font-bold text-gray-200 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-indigo-400/50 hover:bg-indigo-500/10 hover:text-white hover:shadow-[0_0_35px_rgba(99,102,241,0.22)]"
            >
              Join Community
              <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </a>
          </div>

          {/* IMC Core */} 
          <section className="relative mt-24 overflow-hidden rounded-[2rem] border border-white/[0.08] bg-white/[0.02] p-8 backdrop-blur-xl sm:p-12">
            <div className="absolute -right-32 -top-32 h-72 w-72 rounded-full bg-red-600/[0.08] blur-[100px]" />
            <div className="absolute -bottom-32 -left-32 h-72 w-72 rounded-full bg-orange-500/[0.05] blur-[100px]" />

            <div className="relative z-10">
              <p className="text-xs font-bold uppercase tracking-[0.35em] text-red-500">
                The IMC Standard
              </p>

              <h2 className="mt-4 max-w-3xl text-3xl font-black tracking-tight sm:text-5xl">
                Built for players who want to prove their skill.
              </h2>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-gray-500 sm:text-base">
                IMC brings competitive Minecraft players together through structured
                testing, transparent tiers and a community built around competition.
              </p>

              <div className="mt-12 grid gap-4 md:grid-cols-3">
                <div className="group rounded-2xl border border-white/[0.08] bg-black/30 p-7 transition-all duration-500 hover:-translate-y-1 hover:border-red-500/30 hover:bg-red-500/[0.035] hover:shadow-[0_20px_60px_rgba(239,68,68,0.10)]">
                  <p className="text-sm font-black uppercase tracking-[0.2em] text-red-400">
                    01 / Test
                  </p>
                  <h3 className="mt-4 text-2xl font-black">Show your skill</h3>
                  <p className="mt-3 text-sm leading-6 text-gray-500">
                    Get tested through competitive Minecraft gameplay and establish
                    where your skill belongs.
                  </p>
                </div>

                <div className="group rounded-2xl border border-white/[0.08] bg-black/30 p-7 transition-all duration-500 hover:-translate-y-1 hover:border-orange-400/30 hover:bg-orange-500/[0.035] hover:shadow-[0_20px_60px_rgba(245,158,11,0.10)]">
                  <p className="text-sm font-black uppercase tracking-[0.2em] text-orange-400">
                    02 / Earn
                  </p>
                  <h3 className="mt-4 text-2xl font-black">Earn your tier</h3>
                  <p className="mt-3 text-sm leading-6 text-gray-500">
                    Build your competitive profile and track your progression across
                    the IMC tier system.
                  </p>
                </div>

                <div className="group rounded-2xl border border-white/[0.08] bg-black/30 p-7 transition-all duration-500 hover:-translate-y-1 hover:border-indigo-400/30 hover:bg-indigo-500/[0.035] hover:shadow-[0_20px_60px_rgba(99,102,241,0.10)]">
                  <p className="text-sm font-black uppercase tracking-[0.2em] text-indigo-400">
                    03 / Compete
                  </p>
                  <h3 className="mt-4 text-2xl font-black">Join the scene</h3>
                  <p className="mt-3 text-sm leading-6 text-gray-500">
                    Connect with competitive players, take part in events and become
                    part of the International Minecraft Community.
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-5 md:grid-cols-2">
                <a
                  href="/tierlist"
                  className="group rounded-2xl border border-white/[0.08] bg-black/25 p-7 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-red-500/30 hover:bg-red-500/[0.035] hover:shadow-[0_15px_45px_rgba(239,68,68,0.10)]"
                >
                  <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-500">
                    Rankings
                  </p>
                  <h3 className="mt-3 text-2xl font-black">Player Tierlist</h3>
                  <p className="mt-3 text-sm leading-6 text-gray-500">
                    Explore players, tiers and competitive standings across IMC.
                  </p>
                  <p className="mt-5 text-sm font-bold text-red-400 transition-transform group-hover:translate-x-1">
                    View rankings →
                  </p>
                </a>

                <a
                  href="/ranked-rubrics"
                  className="group rounded-2xl border border-white/[0.08] bg-black/25 p-7 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-orange-400/30 hover:bg-orange-500/[0.035] hover:shadow-[0_15px_45px_rgba(245,158,11,0.10)]"
                >
                  <p className="text-xs font-bold uppercase tracking-[0.25em] text-orange-400">
                    Standards
                  </p>
                  <h3 className="mt-3 text-2xl font-black">Ranked Rubrics</h3>
                  <p className="mt-3 text-sm leading-6 text-gray-500">
                    Understand the testing standards, scoring requirements and rules.
                  </p>
                  <p className="mt-5 text-sm font-bold text-orange-400 transition-transform group-hover:translate-x-1">
                    Explore rubrics →
                  </p>
                </a>
              </div>

              <div className="mt-5 grid gap-5 md:grid-cols-2">
                <a
                  href="/about"
                  className="group rounded-2xl border border-white/[0.08] bg-black/25 p-7 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.04] hover:shadow-[0_15px_45px_rgba(255,255,255,0.05)]"
                >
                  <p className="text-xs font-bold uppercase tracking-[0.25em] text-gray-400">
                    About IMC
                  </p>
                  <h3 className="mt-3 text-2xl font-black">About Us</h3>
                  <p className="mt-3 text-sm leading-6 text-gray-500">
                    Learn more about IMC, our purpose and the community behind the tierlist.
                  </p>
                  <p className="mt-5 text-sm font-bold text-gray-300 transition-transform group-hover:translate-x-1">
                    Learn more →
                  </p>
                </a>

                <a
                  href="/community"
                  className="group rounded-2xl border border-white/[0.08] bg-black/25 p-7 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-indigo-400/30 hover:bg-indigo-500/[0.035] hover:shadow-[0_15px_45px_rgba(99,102,241,0.10)]"
                >
                  <p className="text-xs font-bold uppercase tracking-[0.25em] text-indigo-400">
                    Community
                  </p>
                  <h3 className="mt-3 text-2xl font-black">Join IMC</h3>
                  <p className="mt-3 text-sm leading-6 text-gray-500">
                    Connect with other players, participate in the community and stay updated.
                  </p>
                  <p className="mt-5 text-sm font-bold text-indigo-400 transition-transform group-hover:translate-x-1">
                    Enter community →
                  </p>
                </a>
              </div>
            </div>
          </section>

        </div>
      </section>

      {/* IMC Game Modes */}
      

    </main>
    </>
  )
}
