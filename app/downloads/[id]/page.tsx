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

export default function ResourcePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const [resource, setResource] =
    useState<Resource | null>(null)
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [selectedVersion, setSelectedVersion] =
    useState("")

  useEffect(() => {
    params.then(({ id }) => {
      fetch("/api/resources", {
        cache: "no-store",
      })
        .then((res) => res.json())
        .then((data) => {
          const found = Array.isArray(data)
            ? data.find(
                (item: Resource) => item.id === id
              )
            : null

          setResource(found || null)

          if (found?.versions?.length) {
            setSelectedVersion(
              found.versions[0].id
            )
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false))
    })
  }, [params])

  function downloadSelected() {
    const version = resource?.versions?.find(
      (item) => item.id === selectedVersion
    )

    if (!version) return

    window.location.href = `/api/resources/${resource?.id}/download/${version.id}`
    setModal(false)
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0b0c0f] px-5 py-32 text-white">
        <div className="mx-auto max-w-4xl text-center text-gray-500">
          Loading resource...
        </div>
      </main>
    )
  }

  if (!resource) {
    return (
      <main className="min-h-screen bg-[#0b0c0f] px-5 py-32 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-black">
            Resource Not Found
          </h1>

          <a
            href="/downloads"
            className="mt-6 inline-block text-red-400 hover:text-red-300"
          >
            ← Back to Downloads
          </a>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#0b0c0f] px-5 py-28 text-white sm:px-8">
      <div className="mx-auto max-w-4xl">
        <a
          href="/downloads"
          className="text-sm text-gray-500 transition hover:text-red-400"
        >
          ← Back to Downloads
        </a>

        <section className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-[#111216]">
          {resource.thumbnail && (
            <div className="h-56 w-full overflow-hidden border-b border-white/10 sm:h-72">
              <img
                src={resource.thumbnail}
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
          )}

          <div className="p-6 sm:p-10">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-400">
                {resource.category}
              </span>

              <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-gray-500">
                {resource.edition}
              </span>

              {resource.category === "Mods" &&
                resource.modLoader && (
                  <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-gray-500">
                    {resource.modLoader}
                  </span>
                )}
            </div>

            <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">
              {resource.name}
            </h1>

            <p className="mt-5 whitespace-pre-wrap text-base leading-8 text-gray-400">
              {resource.description ||
                "No description available."}
            </p>

            <div className="mt-6 flex flex-wrap gap-5 text-sm text-gray-600">
              <span>
                {resource.versions?.length || 0} versions
              </span>

              <span>
                {resource.downloads || 0} downloads
              </span>
            </div>

            <button
              type="button"
              onClick={() => setModal(true)}
              disabled={!resource.versions?.length}
              className="mt-8 rounded-xl bg-gradient-to-r from-red-700 via-red-600 to-red-500 px-7 py-3.5 font-semibold shadow-[0_0_30px_rgba(220,38,38,0.2)] transition hover:-translate-y-0.5 hover:shadow-[0_0_40px_rgba(220,38,38,0.35)] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {resource.versions?.length
                ? "Download"
                : "No Versions Available"}
            </button>
          </div>
        </section>
      </div>

      {modal && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 px-5 backdrop-blur-xl"
          onClick={() => setModal(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-white/10 bg-[#111216] p-6 shadow-2xl"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-500">
                  Download
                </p>

                <h2 className="mt-2 text-2xl font-black">
                  Choose Version
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setModal(false)}
                className="text-xl text-gray-500 hover:text-white"
              >
                ×
              </button>
            </div>

            <label className="mt-7 block text-sm font-semibold text-gray-300">
              Minecraft Version
            </label>

            <select
              value={selectedVersion}
              onChange={(e) =>
                setSelectedVersion(e.target.value)
              }
              className="mt-2 w-full rounded-xl border border-white/10 bg-[#0b0c0f] px-4 py-3 text-sm text-white outline-none focus:border-red-500/50"
            >
              {resource.versions.map((version) => (
                <option
                  key={version.id}
                  value={version.id}
                >
                  {version.minecraftVersion}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={downloadSelected}
              className="mt-5 w-full rounded-xl bg-red-600 px-5 py-3.5 font-semibold transition hover:bg-red-500"
            >
              Download File
            </button>
          </div>
        </div>
      )}
    </main>
  )
}
