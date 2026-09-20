import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { promises as fs } from "fs";
import path from "path";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("imc_session")?.value;

  if (!token) {
    redirect("/login?redirect=/admin");
  }

  const session = await getSession(token);

  if (!session?.id) {
    redirect("/login?redirect=/admin");
  }

  try {
    const databasePath = path.join(
      process.cwd(),
      "..",
      "IMC-Tickets",
      "database",
      "webadmins.json"
    );

    const database = JSON.parse(
      await fs.readFile(databasePath, "utf8")
    );

    if (!database[String(session.id)]) {
      return (
        <main className="flex min-h-screen items-center justify-center bg-[#090909] px-6 text-white">
          <div className="w-full max-w-md rounded-3xl border border-red-500/20 bg-white/[0.03] p-10 text-center backdrop-blur-xl">
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-red-500">
              IMC Control Center
            </p>
            <h1 className="mt-5 text-3xl font-black">
              Access Denied
            </h1>
            <p className="mt-4 text-sm leading-7 text-gray-500">
              This Discord account has not been granted web admin access.
            </p>
            <a
              href="/"
              className="mt-7 inline-block rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold transition hover:bg-red-500"
            >
              Return Home
            </a>
          </div>
        </main>
      );
    }
  } catch (error) {
    console.error("[ADMIN AUTH] Error:", error);

    return (
      <main className="flex min-h-screen items-center justify-center bg-[#090909] px-6 text-white">
        <div className="rounded-3xl border border-red-500/20 bg-red-950/20 p-10 text-center">
          <h1 className="text-2xl font-black">
            Authentication Error
          </h1>
        </div>
      </main>
    );
  }
  return (
    <main className="min-h-screen bg-[#090909] text-white">

      <section className="relative overflow-hidden border-b border-white/10 px-5 pb-16 pt-28 sm:px-8">
        <div className="absolute right-0 top-0 h-[420px] w-[420px] rounded-full bg-red-600/10 blur-[130px]" />

        <div className="relative mx-auto max-w-6xl">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-red-500">
            IMC Control Center
          </p>

          <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-6xl">
            Admin Panel
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-500 sm:text-base">
            Manage the International Minecraft Community website,
            resources, community features, and connected services.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8">

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <p className="text-xs uppercase tracking-widest text-gray-600">
              Website
            </p>
            <h2 className="mt-3 text-xl font-bold">
              Online
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Website is running normally.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <p className="text-xs uppercase tracking-widest text-gray-600">
              Discord
            </p>
            <h2 className="mt-3 text-xl font-bold">
              Connected
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Discord integration will be connected later.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <p className="text-xs uppercase tracking-widest text-gray-600">
              Resources
            </p>
            <h2 className="mt-3 text-xl font-bold">
              Resource Library
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Manage mods, packs, shaders, maps, and their versions.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <p className="text-xs uppercase tracking-widest text-gray-600">
              System
            </p>
            <h2 className="mt-3 text-xl font-bold">
              Ready
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Backend controls will be added later.
            </p>
          </div>

        </div>

        <div className="mt-10 rounded-3xl border border-white/10 bg-gradient-to-br from-red-950/30 to-white/[0.02] p-7">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-500">
            Tierlist
          </p>

          <h2 className="mt-3 text-2xl font-bold">
            Tierlist Management
          </h2>

          <p className="mt-3 text-sm leading-7 text-gray-500">
            Configure gamemode emojis and manage the IMC Tierlist display.
          </p>

          <a
            href="/admin/tierlist"
            className="mt-6 inline-block rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold transition hover:bg-red-500"
          >
            Manage Tierlist →
          </a>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">

          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-red-950/30 to-white/[0.02] p-7">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-500">
              Management
            </p>

            <h2 className="mt-3 text-2xl font-bold">
              Website Management
            </h2>

            <p className="mt-3 text-sm leading-7 text-gray-500">
              Manage pages, downloads, announcements, and other website
              content from one place.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="/admin/resources"
              className="inline-block rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold transition hover:bg-red-500"
            >
              Manage Resources →
            </a>
            <a
              href="/admin/announcements"
              className="inline-block rounded-xl border border-red-500/30 bg-red-500/5 px-5 py-3 text-sm font-semibold text-red-400 transition hover:border-red-500/60 hover:bg-red-500/10"
            >
              Announcements →
            </a>
          </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-7">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-500">
              Discord
            </p>

            <h2 className="mt-3 text-2xl font-bold">
              Bot Management
            </h2>

            <p className="mt-3 text-sm leading-7 text-gray-500">
              Manage connected Discord services and bot features directly
              from the IMC control center.
            </p>

            <button
              disabled
              className="mt-6 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-gray-600"
            >
              Coming Soon
            </button>
          </div>

        </div>

      </section>

    </main>
  )
}
