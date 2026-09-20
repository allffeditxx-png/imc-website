export default function DashboardPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#080808] px-5 py-24 text-white sm:px-8">

      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-red-700/15 blur-[130px]" />
        <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-red-900/10 blur-[130px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:55px_55px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
      </div>

      <div className="relative mx-auto max-w-6xl">

        {/* Header */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-red-400">
            IMC Dashboard
          </div>

          <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-6xl">
            Welcome to
            <span className="block bg-gradient-to-r from-white via-red-100 to-red-500 bg-clip-text text-transparent">
              International Minecraft Community
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-7 text-gray-400 sm:text-lg">
            Explore the IMC community, discover resources, and learn more
            about what we are building.
          </p>
        </div>

        {/* Dashboard Cards */}
        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">

          {/* Community */}
          <a
            href="/community"
            className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.045] p-7 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-red-500/40 hover:bg-red-500/[0.07] hover:shadow-[0_20px_60px_rgba(220,38,38,0.15)]"
          >
            <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-red-600/10 blur-3xl transition-all duration-500 group-hover:bg-red-600/20" />

            <div className="relative">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 text-2xl">
                ◈
              </div>

              <h2 className="mt-7 text-2xl font-bold">
                Community
              </h2>

              <p className="mt-3 leading-6 text-gray-400">
                Connect with the IMC community and discover what we offer.
              </p>

              <div className="mt-7 flex items-center gap-2 text-sm font-semibold text-red-400 transition-all group-hover:gap-4">
                Explore Community
                <span>→</span>
              </div>
            </div>
          </a>

          {/* Downloads */}
          <a
            href="/downloads"
            className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.045] p-7 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-red-500/40 hover:bg-red-500/[0.07] hover:shadow-[0_20px_60px_rgba(220,38,38,0.15)]"
          >
            <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-red-600/10 blur-3xl transition-all duration-500 group-hover:bg-red-600/20" />

            <div className="relative">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 text-2xl">
                ↓
              </div>

              <h2 className="mt-7 text-2xl font-bold">
                Downloads
              </h2>

              <p className="mt-3 leading-6 text-gray-400">
                Find mods, resource packs, shaders, and other IMC resources.
              </p>

              <div className="mt-7 flex items-center gap-2 text-sm font-semibold text-red-400 transition-all group-hover:gap-4">
                Browse Downloads
                <span>→</span>
              </div>
            </div>
          </a>

          {/* Tierlist */}
          <a
            href="/tierlist"
            className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.045] p-7 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-red-500/40 hover:bg-red-500/[0.07] hover:shadow-[0_20px_60px_rgba(220,38,38,0.15)]"
          >
            <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-red-600/10 blur-3xl transition-all duration-500 group-hover:bg-red-600/20" />

            <div className="relative">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 text-2xl">
                ◇
              </div>

              <h2 className="mt-7 text-2xl font-bold">
                Tierlist
              </h2>

              <p className="mt-3 leading-6 text-gray-400">
                Explore IMC player rankings, tiers, and competitive standings.
              </p>

              <div className="mt-7 flex items-center gap-2 text-sm font-semibold text-red-400 transition-all group-hover:gap-4">
                View Tierlist <span>→</span>
              </div>
            </div>
          </a>

          {/* About */}
          <a
            href="/about"
            className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.045] p-7 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-red-500/40 hover:bg-red-500/[0.07] hover:shadow-[0_20px_60px_rgba(220,38,38,0.15)]"
          >
            <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-red-600/10 blur-3xl transition-all duration-500 group-hover:bg-red-600/20" />

            <div className="relative">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 text-2xl">
                ✦
              </div>

              <h2 className="mt-7 text-2xl font-bold">
                About Us
              </h2>

              <p className="mt-3 leading-6 text-gray-400">
                Learn more about IMC, our purpose, and what we are creating.
              </p>

              <div className="mt-7 flex items-center gap-2 text-sm font-semibold text-red-400 transition-all group-hover:gap-4">
                Learn More
                <span>→</span>
              </div>
            </div>
          </a>

        </div>

        {/* Bottom accent */}
        <div className="mt-14 flex items-center gap-4">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />
          <span className="text-xs uppercase tracking-[0.3em] text-gray-600">
            IMC
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />
        </div>

      </div>
    </main>
  )
}
