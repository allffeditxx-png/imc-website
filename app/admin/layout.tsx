import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { promises as fs } from "fs";
import path from "path";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

  return <>{children}</>;
}
