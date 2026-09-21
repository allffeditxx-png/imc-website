"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    try {
      const localUser = localStorage.getItem("imc_user");

      if (!localUser) {
        router.replace("/login?redirect=/admin");
        return;
      }

      const parsedUser = JSON.parse(localUser);
      const username = String(parsedUser?.username || "").trim();

      if (!username) {
        router.replace("/login?redirect=/admin");
        return;
      }

      fetch(
        `https://raw.githubusercontent.com/allffeditxx-png/imc-webadmins/main/webadmins.json?ts=${Date.now()}`,
        {
          cache: "no-store",
        }
      )
        .then((res) => {
          if (!res.ok) throw new Error("Failed to load admin list");
          return res.json();
        })
        .then((admins) => {
          const isAdmin = Object.keys(admins || {}).some(
            (key) => key.toLowerCase() === username.toLowerCase()
          );

          if (!isAdmin) {
            setAuthorized(false);
            setChecking(false);
            return;
          }

          setAuthorized(true);
          setChecking(false);
        })
        .catch(() => {
          setAuthorized(false);
          setChecking(false);
        });
    } catch {
      router.replace("/login?redirect=/admin");
    }
  }, [router]);

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
            This website username has not been granted web admin access.
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
