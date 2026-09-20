"use client";

import { useEffect, useState } from "react";

type User = {
  id?: string | null;
  username?: string | null;
  global_name?: string | null;
  avatar?: string | null;
};

export default function AccountButton() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetch("/api/auth/session", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) setUser(data.user);
      })
      .catch(() => {});
  }, []);

  if (!user) {
    return (
      <a
        href="/login"
        className="rounded-lg border border-red-500/30 bg-red-500/5 px-4 py-2 text-sm font-medium text-red-400 transition hover:border-red-500/60 hover:bg-red-500/10"
      >
        Login
      </a>
    );
  }

  const name = user.global_name || user.username || "Discord User";

  return (
    <a
      href="/dashboard"
      className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition hover:bg-white/5"
    >
      <div className="h-9 w-9 overflow-hidden rounded-full border border-white/10 bg-red-500/10">
        {user.avatar && user.id ? (
          <img
            src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=64`}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm font-bold text-red-400">
            {name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      <span className="hidden max-w-32 truncate text-sm font-medium text-gray-300 sm:block">
        {name}
      </span>
    </a>
  );
}
