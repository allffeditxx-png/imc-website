"use client"
import FallingParticles from "@/components/FallingParticles";
import AccountButton from "@/components/AccountButton";

import { useEffect, useState } from "react"

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [pageReady, setPageReady] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)

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

      <main className="min-h-screen bg-black text-white">

      <FallingParticles />

      {/* Navbar */}
      <nav className="fixed left-0 right-0 top-0 z-[100] border-b border-white/10 bg-black/60 px-5 py-4 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between">

          <a href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-700 to-red-500 font-black shadow-lg shadow-red-900/30">
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
              className="rounded-lg bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400"
            >
              Home
            </a>

            <a
              href="/about"
              className="rounded-lg px-4 py-2 text-sm text-gray-400 transition hover:bg-white/5 hover:text-white"
            >
              About
            </a>

            <a
              href="/downloads"
              className="rounded-lg px-4 py-2 text-sm text-gray-400 transition hover:bg-white/5 hover:text-white"
            >
              Downloads
            </a>

            <a
              href="/dashboard"
              className="rounded-lg px-4 py-2 text-sm text-gray-400 transition hover:bg-white/5 hover:text-white"
            >
              Tierlist
            </a>
            <a
              href="/community"
              className="rounded-lg px-4 py-2 text-sm text-gray-400 transition hover:bg-white/5 hover:text-white"
            >
              Discord
            </a>

            <a
              href="/admin"
              className="rounded-lg px-4 py-2 text-sm text-gray-400 transition hover:bg-white/5 hover:text-white"
            >
              Admin Panel
            </a>

          </div>

          <div className="flex items-center gap-3">

            <AccountButton />

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              aria-label="Toggle menu"
              className="relative z-[120] flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 md:hidden"
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
              ["Discord", "/community"],
              ["Admin Panel", "/admin"],
            ].map(([name, href], index) => (
              <a
                key={name}
                href={href}
                onClick={closeMenu}
                className={`flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.035] px-5 py-4 text-base font-semibold text-gray-300 transition-all duration-500 hover:border-red-500/40 hover:bg-red-500/10 hover:text-white ${
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
                className="block rounded-2xl border border-red-500/30 bg-red-500/5 px-5 py-3 text-center text-sm font-semibold text-red-400 transition hover:border-red-500/60 hover:bg-red-500/10 hover:text-white"
              >
                Logout
              </a>
            ) : (
              <a
                href="/login"
                onClick={closeMenu}
                className="block rounded-2xl border border-red-500/30 bg-red-500/5 px-5 py-3 text-center text-sm font-semibold text-red-400 transition hover:border-red-500/60 hover:bg-red-500/10 hover:text-white"
              >
                Login
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Hero */}


      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 pt-24 text-center">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(220,38,38,0.35),transparent_45%),linear-gradient(to_bottom,#160000,#050505_55%,#000)]" />

        <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-600/10 blur-3xl" />

        <div className="relative z-10 max-w-3xl">

          <p className="mb-4 text-sm uppercase tracking-[0.35em] text-red-500">
            International Minecraft Community
          </p>

          <h1 className="text-5xl font-black tracking-tight md:text-7xl">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-red-400 via-red-600 to-red-900 bg-clip-text text-transparent">
              IMC
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-400">
            A clean and modern hub for everything related to the IMC community.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">

            <button
              type="button"
              onClick={() => {}}
              className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-red-700 via-red-600 to-red-500 px-7 py-3.5 font-semibold shadow-[0_0_30px_rgba(220,38,38,0.25)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(220,38,38,0.5)]"
            >
              <span className="relative z-10">
                Explore IMC
              </span>

              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            </button>

            <a
              href="https://discord.gg/Wyd6Z3wJeN"
              className="group rounded-xl border border-red-500/30 bg-white/[0.04] px-7 py-3.5 font-semibold backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-red-500/70 hover:bg-red-500/10"
            >
              Join Discord
              <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </a>

          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative overflow-hidden px-6 py-24">

        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#090000] to-black" />

        <div className="relative z-10 mx-auto max-w-7xl">

          <div className="mx-auto max-w-2xl text-center">

            <p className="text-sm uppercase tracking-[0.3em] text-red-500">
              Everything in one place
            </p>

            <h2 className="mt-3 text-3xl font-bold md:text-4xl">
              Built for the IMC Community
            </h2>

            <p className="mt-4 text-gray-500">
              Explore the different parts of the IMC ecosystem.
            </p>

          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">

            <div className="group rounded-2xl border border-white/10 bg-white/[0.03] p-7 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-red-500/40">

              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-2xl">
                ◈
              </div>

              <h3 className="text-xl font-bold">
                Community
              </h3>

              <p className="mt-3 leading-7 text-gray-500">
                Connect with the IMC community and stay updated with everything happening around us.
              </p>

              <a
                href="/community"
                className="mt-6 inline-block text-sm font-semibold text-red-500"
              >
                Explore →
              </a>

            </div>

            <div className="group rounded-2xl border border-white/10 bg-white/[0.03] p-7 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-red-500/40">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-2xl">
              ◇
            </div>
            <h3 className="text-xl font-bold">
              Tierlist
            </h3>
            <p className="mt-3 leading-7 text-gray-500">
              Explore the latest IMC player rankings, tiers and competitive standings.
            </p>
            <a
              href="/tierlist"
              className="mt-6 inline-block text-sm font-semibold text-red-500"
            >
              View Tierlist →
            </a>
          </div>

          <div className="group rounded-2xl border border-white/10 bg-white/[0.03] p-7 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-red-500/40">

              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-2xl">
                ◆
              </div>

              <h3 className="text-xl font-bold">
                Resources
              </h3>

              <p className="mt-3 leading-7 text-gray-500">
                Access useful downloads, files and resources created for the IMC community.
              </p>

              <a
                href="/downloads"
                className="mt-6 inline-block text-sm font-semibold text-red-500"
              >
                View Downloads →
              </a>

            </div>

            <div className="group rounded-2xl border border-white/10 bg-white/[0.03] p-7 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-red-500/40">

              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-2xl">
                ✦
              </div>

              <h3 className="text-xl font-bold">
                About Us
              </h3>

              <p className="mt-3 leading-7 text-gray-500">
                Learn more about IMC, our community, and what we are building together.
              </p>

              <a
                href="/about"
                className="mt-6 inline-block text-sm font-semibold text-red-500"
              >
                Learn More →
              </a>

            </div>

          </div>
        </div>
      </section>

    </main>
    </>
  )
}
