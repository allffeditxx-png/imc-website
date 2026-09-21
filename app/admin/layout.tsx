"use client";

import { useEffect, useState } from "react";

const ADMIN_USERNAME = "AyushXDP";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    try {
      let username = "";

      const localUser = localStorage.getItem("imc_user");

      if (localUser) {
        try {
          const parsedUser = JSON.parse(localUser);
          username = String(parsedUser?.username || "").trim();
        } catch {}
      }

      if (!username) {
        const cookie = document.cookie
          .split("; ")
          .find((row) => row.startsWith("imc_username="));

        if (cookie) {
          username = decodeURIComponent(cookie.split("=")[1] || "").trim();
        }
      }

      const isAdmin =
        username.toLowerCase() === ADMIN_USERNAME.toLowerCase();

      setAuthorized(isAdmin);
      setChecking(false);
    } catch {
      setAuthorized(false);
      setChecking(false);
    }
  }, []);

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#090909] text-white">
        <p className="text-sm text-gray-500">Checking access...</p>
      </main>
    );
  }

  if (!authorized) {
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
            This website username does not have web admin access.
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

  return <>{children}</>;
}
