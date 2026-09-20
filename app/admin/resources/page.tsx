"use client"

import { FormEvent, useEffect, useState } from "react"

type Version = {
  id: string
  minecraftVersion: string
  fileName: string
  filePath: string
  fileSize: number
  downloads: number
  createdAt: string
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
  createdAt: string
}

type VersionInput = {
  minecraftVersion: string
  file: File | null
}

const categories = [
  "Mods",
  "Resource Packs",
  "Shaders",
  "Maps",
  "Other",
]

const editions = [
  "Java",
  "Bedrock",
  "Java & Bedrock",
]

const loaders = [
  "Fabric",
  "Forge",
  "NeoForge",
]

export default function ResourcesAdminPage() {
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("")
  const [editing, setEditing] = useState<Resource | null>(null)

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("Mods")
  const [edition, setEdition] = useState("Java")
  const [minecraftVersion, setMinecraftVersion] = useState("")
  const [thumbnail, setThumbnail] = useState("")
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [modLoader, setModLoader] = useState("Fabric")

  const [versions, setVersions] = useState<VersionInput[]>([
    {
      minecraftVersion: "",
      file: null,
    },
  ])

  async function loadResources() {
    try {
      const response = await fetch("/api/resources", {
        cache: "no-store",
      })

      const data = await response.json()
      setResources(Array.isArray(data) ? data : [])
    } catch {
      setMessage("Failed to load resources.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadResources()
  }, [])

  function resetForm() {
    setName("")
    setDescription("")
    setCategory("Mods")
    setEdition("Java")
    setMinecraftVersion("")
    setThumbnail("")
    setThumbnailFile(null)
    setModLoader("Fabric")
    setVersions([
      {
        minecraftVersion: "",
        file: null,
      },
    ])
    setEditing(null)
  }

  function addVersion() {
    setVersions((current) => [
      ...current,
      {
        minecraftVersion: "",
        file: null,
      },
    ])
  }

  function removeVersion(index: number) {
    setVersions((current) =>
      current.length === 1
        ? current
        : current.filter((_, i) => i !== index)
    )
  }

  function updateVersion(
    index: number,
    field: "minecraftVersion" | "file",
    value: string | File | null
  ) {
    setVersions((current) =>
      current.map((version, i) =>
        i === index
          ? {
              ...version,
              [field]: value,
            }
          : version
      )
    )
  }

  async function uploadVersions(resourceId: string) {
    for (const version of versions) {
      if (!version.minecraftVersion.trim() && !version.file) {
        continue
      }

      if (
        !version.minecraftVersion.trim() ||
        !version.file
      ) {
        throw new Error(
          "Every version must have a Minecraft version and file."
        )
      }

      const formData = new FormData()

      formData.append(
        "minecraftVersion",
        version.minecraftVersion.trim()
      )

      formData.append("file", version.file)

      const response = await fetch(
        `/api/resources/${resourceId}/versions`,
        {
          method: "POST",
          body: formData,
        }
      )

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(
          data.error || "Failed to upload version."
        )
      }
    }
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()
    setMessage("")

    try {
      const response = await fetch("/api/resources", {
        method: editing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: editing?.id,
          name,
          description,
          category,
          edition,
          minecraftVersion,
          thumbnail,
          modLoader:
            category === "Mods" ? modLoader : "",
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to save resource."
        )
      }

      const resourceId = editing?.id || data.id

      if (thumbnailFile) {
        const thumbnailForm = new FormData()
        thumbnailForm.append("file", thumbnailFile)

        const thumbnailResponse = await fetch(
          `/api/resources/${resourceId}/thumbnail`,
          {
            method: "POST",
            body: thumbnailForm,
          }
        )

        if (!thumbnailResponse.ok) {
          const thumbnailData =
            await thumbnailResponse.json().catch(() => ({}))

          throw new Error(
            thumbnailData.error ||
              "Failed to upload thumbnail."
          )
        }
      }

      await uploadVersions(resourceId)

      setMessage(
        editing
          ? "Resource updated successfully."
          : "Resource created successfully."
      )

      resetForm()
      await loadResources()
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      )
    }
  }

  function startEdit(resource: Resource) {
    setEditing(resource)
    setName(resource.name)
    setDescription(resource.description)
    setCategory(resource.category)
    setEdition(resource.edition)
    setMinecraftVersion(resource.minecraftVersion)
    setThumbnail(resource.thumbnail)
    setModLoader(resource.modLoader || "Fabric")

    setVersions([
      {
        minecraftVersion: "",
        file: null,
      },
    ])

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  async function deleteResource(id: string) {
    if (
      !window.confirm(
        "Are you sure you want to delete this resource?"
      )
    ) {
      return
    }

    try {
      const response = await fetch("/api/resources", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to delete resource."
        )
      }

      setMessage("Resource deleted.")
      await loadResources()
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to delete resource."
      )
    }
  }

  function formatSize(bytes: number) {
    if (!bytes) return "0 B"

    const units = ["B", "KB", "MB", "GB"]
    const index = Math.floor(
      Math.log(bytes) / Math.log(1024)
    )

    return `${(bytes / Math.pow(1024, index)).toFixed(
      1
    )} ${units[index]}`
  }

  return (
    <main className="min-h-screen bg-[#0b0c0f] px-5 py-28 text-white sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-red-500">
            IMC Admin
          </p>

          <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
            Resources
          </h1>

          <p className="mt-3 max-w-2xl text-gray-500">
            Create and manage IMC resources and their versions.
          </p>
        </div>

        {message && (
          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/5 px-5 py-4 text-sm text-red-300">
            {message}
          </div>
        )}

        <section className="rounded-2xl border border-white/10 bg-[#111216] p-5 sm:p-7">
          <div className="mb-7 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">
                {editing
                  ? "Edit Resource"
                  : "Create Resource"}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Add the resource details and its versions.
              </p>
            </div>

            {editing && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-400 transition hover:border-white/20 hover:text-white"
              >
                Cancel
              </button>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-300">
                  Name
                </label>

                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Resource name"
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none transition focus:border-red-500/50"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-300">
                  Category
                </label>

                <select
                  value={category}
                  onChange={(e) => {
                    const value = e.target.value
                    setCategory(value)

                    if (value !== "Mods") {
                      setModLoader("")
                    } else {
                      setModLoader("Fabric")
                    }
                  }}
                  className="w-full rounded-xl border border-white/10 bg-[#111216] px-4 py-3 text-sm outline-none focus:border-red-500/50"
                >
                  {categories.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {category === "Mods" && (
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-300">
                  Mod Loader
                </label>

                <select
                  value={modLoader}
                  onChange={(e) =>
                    setModLoader(e.target.value)
                  }
                  required
                  className="w-full rounded-xl border border-red-500/20 bg-[#111216] px-4 py-3 text-sm outline-none focus:border-red-500/50"
                >
                  {loaders.map((loader) => (
                    <option key={loader} value={loader}>
                      {loader}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-300">
                Description
              </label>

              <textarea
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                rows={4}
                placeholder="Describe this resource..."
                className="w-full resize-none rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none focus:border-red-500/50"
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-300">
                  Edition
                </label>

                <select
                  value={edition}
                  onChange={(e) =>
                    setEdition(e.target.value)
                  }
                  className="w-full rounded-xl border border-white/10 bg-[#111216] px-4 py-3 text-sm outline-none focus:border-red-500/50"
                >
                  {editions.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-300">
                  Main Minecraft Version
                </label>

                <input
                  value={minecraftVersion}
                  onChange={(e) =>
                    setMinecraftVersion(e.target.value)
                  }
                  placeholder="e.g. 1.21.11"
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none focus:border-red-500/50"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-300">
                Thumbnail
              </label>

              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={(e) =>
                  setThumbnailFile(
                    e.target.files?.[0] || null
                  )
                }
                className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-gray-400 file:mr-4 file:rounded-lg file:border-0 file:bg-red-500/10 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-red-400"
              />

              {thumbnail && !thumbnailFile && (
                <p className="mt-2 text-xs text-gray-600">
                  Existing thumbnail will be kept unless you choose a new image.
                </p>
              )}

              {thumbnailFile && (
                <p className="mt-2 text-xs text-gray-500">
                  Selected: {thumbnailFile.name}
                </p>
              )}
            </div>

            <div className="border-t border-white/10 pt-6">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h3 className="font-bold">
                    Versions & Files
                  </h3>

                  <p className="mt-1 text-xs text-gray-500">
                    Add as many Minecraft versions as needed.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addVersion}
                  className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-400 transition hover:border-red-500/60 hover:bg-red-500/20 hover:text-white"
                >
                  + Add Version
                </button>
              </div>

              <div className="space-y-4">
                {versions.map((version, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-white/10 bg-black/20 p-4"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <span className="text-sm font-bold text-gray-300">
                        Version {index + 1}
                      </span>

                      {versions.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            removeVersion(index)
                          }
                          className="text-xs font-semibold text-red-400 hover:text-red-300"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <input
                        value={version.minecraftVersion}
                        onChange={(e) =>
                          updateVersion(
                            index,
                            "minecraftVersion",
                            e.target.value
                          )
                        }
                        placeholder="Minecraft version e.g. 1.21.11"
                        className="rounded-xl border border-white/10 bg-[#111216] px-4 py-3 text-sm outline-none focus:border-red-500/50"
                      />

                      <input
                        type="file"
                        onChange={(e) =>
                          updateVersion(
                            index,
                            "file",
                            e.target.files?.[0] || null
                          )
                        }
                        className="w-full rounded-xl border border-white/10 bg-[#111216] px-4 py-3 text-sm text-gray-400 file:mr-4 file:rounded-lg file:border-0 file:bg-red-500/10 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-red-400"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-red-700 via-red-600 to-red-500 px-6 py-3.5 font-semibold shadow-[0_0_30px_rgba(220,38,38,0.2)] transition hover:-translate-y-0.5 hover:shadow-[0_0_40px_rgba(220,38,38,0.35)]"
            >
              {editing
                ? "Save Changes"
                : "Create Resource"}
            </button>
          </form>
        </section>

        <section className="mt-10">
          <div className="mb-5">
            <h2 className="text-xl font-bold">
              Existing Resources
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Manage resources and add more versions.
            </p>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-white/10 bg-[#111216] p-10 text-center text-sm text-gray-500">
              Loading resources...
            </div>
          ) : resources.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 p-10 text-center text-sm text-gray-500">
              No resources created yet.
            </div>
          ) : (
            <div className="space-y-4">
              {resources.map((resource) => (
                <div
                  key={resource.id}
                  className="rounded-2xl border border-white/10 bg-[#111216] p-5 sm:p-6"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-lg font-bold">
                          {resource.name}
                        </h3>

                        <span className="rounded-full bg-red-500/10 px-3 py-1 text-xs text-red-400">
                          {resource.category}
                        </span>

                        {resource.category === "Mods" &&
                          resource.modLoader && (
                            <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-gray-400">
                              {resource.modLoader}
                            </span>
                          )}
                      </div>

                      <p className="mt-2 text-sm text-gray-500">
                        {resource.description ||
                          "No description."}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-4 text-xs text-gray-600">
                        <span>{resource.edition}</span>
                        <span>
                          {resource.versions?.length || 0}{" "}
                          versions
                        </span>
                        <span>
                          {resource.downloads || 0} downloads
                        </span>
                      </div>

                      {resource.versions &&
                        resource.versions.length > 0 && (
                          <div className="mt-5 space-y-2">
                            {resource.versions.map(
                              (version) => (
                                <div
                                  key={version.id}
                                  className="flex flex-col gap-2 rounded-xl border border-white/5 bg-black/20 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                                >
                                  <div>
                                    <p className="text-sm font-semibold text-gray-300">
                                      {version.minecraftVersion}
                                    </p>

                                    <p className="text-xs text-gray-600">
                                      {version.fileName} ·{" "}
                                      {formatSize(
                                        version.fileSize
                                      )}
                                    </p>
                                  </div>

                                  <a
                                    href={version.filePath}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-xs font-semibold text-red-400 hover:text-red-300"
                                  >
                                    Open File →
                                  </a>
                                </div>
                              )
                            )}
                          </div>
                        )}
                    </div>

                    <div className="flex shrink-0 gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          startEdit(resource)
                        }
                        className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-gray-300 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-white"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          deleteResource(resource.id)
                        }
                        className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-2.5 text-sm font-semibold text-red-400 transition hover:border-red-500/50 hover:bg-red-500/10"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
