"use client"

import { useEffect, useState } from "react"

type Version = {
  id: string
  minecraftVersion: string
  fileName: string
  filePath: string
  fileSize: number
  downloads: number
}

type Resource = {
  id: string
  name: string
  description: string
  category: string
  edition: string
  minecraftVersion: string
  thumbnail: string
  modLoader?: string
  versions: Version[]
  downloads: number
}

const filters = [
  "All",
  "Mods",
  "Resource Packs",
  "Shaders",
  "Most Downloaded",
]

export default function DownloadsPage() {
  const [filter, setFilter] = useState("All")
  const [ready, setReady] = useState(false)
  const [files, setFiles] = useState<Resource[]>([])

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 60)

    fetch("/api/resources", {
      cache: "no-store",
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setFiles(data)
        }
      })
      .catch(() => {})

    return () => clearTimeout(timer)
  }, [])

  const filteredFiles =
    filter === "All"
      ? files
      : filter === "Most Downloaded"
        ? [...files].sort(
            (a, b) => b.downloads - a.downloads
          )
        : files.filter(
            (file) => file.category === filter
          )

  return (
    <main className="min-h-screen bg-[#0b0c0f] text-white">
      <div
        className={`pointer-events-none fixed inset-0 z-[9999] overflow-hidden transition-opacity duration-500 ${
          ready ? "opacity-0" : "opacity-100"
        }`}
      >
        <div className="absolute inset-0 bg-[#0b0c0f]" />

        <div
          className={`absolute left-0 top-1/2 h-px w-full bg-red-500 shadow-[0_0_25px_rgba(239,68,68,0.9)] transition-transform duration-[1000ms] ease-out ${
            ready
              ? "translate-x-full"
              : "-translate-x-full"
          }`}
        />

        <div
          className={`absolute left-0 top-1/2 h-32 w-32 -translate-y-1/2 rounded-full bg-red-600/20 blur-3xl transition-all duration-700 ${
            ready
              ? "translate-x-[100vw] opacity-0"
              : "translate-x-[-8rem] opacity-100"
          }`}
        />
      </div>

      <div
        className={`transition-all duration-1000 ease-out ${
          ready
            ? "translate-y-0 opacity-100"
            : "translate-y-10 opacity-0"
        }`}
      >
        <section className="relative overflow-hidden border-b border-white/10 px-5 pb-14 pt-28 sm:px-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(220,38,38,0.16),transparent_35%),radial-gradient(circle_at_85%_80%,rgba(127,29,29,0.12),transparent_35%)]" />

          <div className="absolute right-[-100px] top-[-120px] h-[350px] w-[350px] rounded-full border border-red-500/10" />

          <div className="absolute right-[-50px] top-[-70px] h-[250px] w-[250px] rounded-full border border-red-500/10" />

          <div className="relative mx-auto max-w-6xl">
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-red-500">
              IMC Resources
            </p>

            <h1 className="mt-5 max-w-3xl text-4xl font-black tracking-tight sm:text-6xl">
              Download.
              <span className="block text-gray-500">
                Explore. Create.
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-gray-400 sm:text-lg">
              Browse resources shared by the International Minecraft Community.
              Find mods, resource packs, shaders, and more.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold">
                Resource Library
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Browse available IMC downloads.
              </p>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2">
              {filters.map((item) => (
                <button
                  key={item}
                  onClick={() => setFilter(item)}
                  className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition ${
                    filter === item
                      ? "border-red-500 bg-red-500 text-white shadow-[0_0_20px_rgba(220,38,38,0.25)]"
                      : "border-white/10 bg-white/[0.03] text-gray-400 hover:border-white/20 hover:text-white"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 grid gap-4">
            {filteredFiles.map((file, index) => (
              <a
                key={file.id}
                href={`/downloads/${file.id}`}
                style={{
                  transitionDelay: ready
                    ? `${index * 100}ms`
                    : "0ms",
                }}
                className={`group flex flex-col gap-6 rounded-2xl border border-white/10 bg-[#111216] p-5 transition-all duration-700 sm:flex-row sm:items-center sm:p-6 ${
                  ready
                    ? "translate-y-0 opacity-100"
                    : "translate-y-8 opacity-0"
                } hover:border-red-500/30 hover:bg-[#15161b]`}
              >
                {file.thumbnail ? (
                  <img
                    src={file.thumbnail}
                    alt=""
                    className="h-14 w-14 shrink-0 rounded-xl object-cover"
                  />
                ) : (
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-xl text-red-400">
                    ↓
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-lg font-bold">
                      {file.name}
                    </h3>

                    <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-gray-500">
                      {file.category}
                    </span>

                    {file.category === "Mods" &&
                      file.modLoader && (
                        <span className="rounded-full bg-red-500/10 px-3 py-1 text-xs text-red-400">
                          {file.modLoader}
                        </span>
                      )}
                  </div>

                  <p className="mt-2 text-sm text-gray-500">
                    {file.description}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-4 text-xs text-gray-600">
                    <span>
                      {file.versions?.length || 0} versions
                    </span>

                    <span>
                      {file.downloads || 0} downloads
                    </span>
                  </div>
                </div>

                <span className="rounded-xl border border-red-500/20 bg-red-500/5 px-5 py-3 text-center text-sm font-semibold text-red-400 transition group-hover:border-red-500/50 group-hover:bg-red-500/10 group-hover:text-white sm:shrink-0">
                  View Resource →
                </span>
              </a>
            ))}
          </div>

          {filteredFiles.length === 0 && (
            <div className="rounded-2xl border border-dashed border-white/10 py-20 text-center">
              <p className="text-gray-500">
                No resources found in this category.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
