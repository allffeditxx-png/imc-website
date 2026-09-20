"use client";

import { useState } from "react";

const GAMEMODES = [
  "CPvP",
  "Netherite Pot",
  "Pot",
  "Sword",
  "Axe",
  "Mace",
  "UHC",
  "SMP",
];

export default function TierlistAdminPage() {
  const [files, setFiles] = useState<Record<string, File>>({});
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const handleUpload = (
    mode: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (file.type !== "image/png") {
      alert("Please upload a PNG image.");
      return;
    }

    setFiles((current) => ({
      ...current,
      [mode]: file,
    }));

    setPreviews((current) => ({
      ...current,
      [mode]: URL.createObjectURL(file),
    }));

    setMessage("");
  };

  const saveIcons = async () => {
    if (Object.keys(files).length === 0) {
      setMessage("Upload at least one PNG first.");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      for (const mode of GAMEMODES) {
        const file = files[mode];

        if (!file) continue;

        const formData = new FormData();
        formData.append("gamemode", mode);
        formData.append("file", file);

        const response = await fetch("/api/tierlist-icons", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || `Failed to upload ${mode}.`);
        }
      }

      setMessage("Gamemode icons saved successfully.");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to save icons."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#090909] px-5 pb-16 pt-28 text-white sm:px-8">
      <div className="mx-auto max-w-4xl">
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-red-500">
          IMC Control Center
        </p>

        <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">
          Tierlist Settings
        </h1>

        <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-500">
          Upload a custom PNG icon for each gamemode.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {GAMEMODES.map((mode) => (
            <div
              key={mode}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
            >
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold">
                  {mode}
                </label>

                {previews[mode] && (
                  <img
                    src={previews[mode]}
                    alt={`${mode} icon`}
                    className="h-12 w-12 rounded-lg object-contain"
                  />
                )}
              </div>

              <label className="mt-4 flex cursor-pointer items-center justify-center rounded-xl border border-dashed border-white/15 bg-black/30 px-4 py-7 transition hover:border-red-500/50 hover:bg-red-950/10">
                <div className="text-center">
                  <p className="text-sm font-semibold">
                    {previews[mode]
                      ? "Change PNG"
                      : "Upload PNG"}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    PNG only
                  </p>
                </div>

                <input
                  type="file"
                  accept="image/png"
                  className="hidden"
                  onChange={(event) =>
                    handleUpload(mode, event)
                  }
                />
              </label>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={saveIcons}
          disabled={saving}
          className="mt-8 rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Gamemode Icons"}
        </button>

        {message && (
          <p className="mt-4 text-sm text-gray-400">
            {message}
          </p>
        )}
      </div>
    </main>
  );
}
