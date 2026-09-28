"use client";

import { useEffect, useState } from "react";

const modes = [
  { name: "Sword", icon: "/tierlist-icons/Sword.png" },
  { name: "Netherite Pot", icon: "/tierlist-icons/Netherite Pot.png" },
  { name: "Pot", icon: "/tierlist-icons/Pot.png" },
  { name: "CPvP", icon: "/tierlist-icons/CPvP.png" },
  { name: "Axe", icon: "/tierlist-icons/Axe.png" },
  { name: "Mace", icon: "/tierlist-icons/Mace.png" },
  { name: "UHC", icon: "/tierlist-icons/UHC.png" },
  { name: "SMP", icon: "/tierlist-icons/SMP.png" },
];

type RubricItem = {
  id: number;
  type: "box" | "message";
  title: string;
  content: string;
};

export default function RubricsAdminPage() {
  const [selectedMode, setSelectedMode] = useState("Sword");
  const [rubrics, setRubrics] = useState<Record<string, RubricItem[]>>({});
  const [editingId, setEditingId] = useState<number | null>(null);

  const items = Array.isArray(rubrics[selectedMode])
    ? rubrics[selectedMode]
    : Array.isArray((rubrics[selectedMode] as any)?.items)
      ? (rubrics[selectedMode] as any).items
      : [];

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadRubrics = async () => {
      try {
        const response = await fetch("/api/rubrics");
        const data = await response.json();

        if (data.success && data.rubrics) {
          setRubrics(data.rubrics);
        }
      } catch (error) {
        console.error("Failed to load rubrics:", error);
      } finally {
        setLoading(false);
      }
    };

    loadRubrics();
  }, []);

  const saveRubrics = async () => {
    try {
      setSaving(true);

      const response = await fetch("/api/rubrics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(rubrics),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to save rubrics.");
      }
    } catch (error) {
      console.error("Failed to save rubrics:", error);
      alert("Failed to save rubrics.");
    } finally {
      setSaving(false);
    }
  };

  const getModeItems = (modeName: string): RubricItem[] => {
    const modeData = rubrics[modeName];

    if (Array.isArray(modeData)) {
      return modeData;
    }

    if (
      modeData &&
      typeof modeData === "object" &&
      Array.isArray((modeData as any).items)
    ) {
      return (modeData as any).items;
    }

    return [];
  };

  const setModeItems = (
    modeName: string,
    nextItems: RubricItem[]
  ) => {
    setRubrics((current) => {
      const existing = current[modeName];

      if (
        existing &&
        typeof existing === "object" &&
        !Array.isArray(existing)
      ) {
        return {
          ...current,
          [modeName]: {
            ...(existing as any),
            items: nextItems,
          },
        };
      }

      return {
        ...current,
        [modeName]: nextItems,
      };
    });
  };

  const addItem = (type: "box" | "message") => {
    const item: RubricItem = {
      id: Date.now(),
      type,
      title: type === "box" ? "New Box" : "",
      content: "",
    };

    setModeItems(selectedMode, [
      ...getModeItems(selectedMode),
      item,
    ]);

    setEditingId(item.id);
  };

  const updateItem = (
    id: number,
    field: "title" | "content",
    value: string
  ) => {
    setModeItems(
      selectedMode,
      getModeItems(selectedMode).map((item) =>
        item.id === id
          ? { ...item, [field]: value }
          : item
      )
    );
  };

  const deleteItem = (id: number) => {
    setModeItems(
      selectedMode,
      getModeItems(selectedMode).filter(
        (item) => item.id !== id
      )
    );

    if (editingId === id) {
      setEditingId(null);
    }
  };

  const moveItem = (id: number, direction: -1 | 1) => {
    const currentItems = getModeItems(selectedMode);
    const index = currentItems.findIndex((item) => item.id === id);

    if (index === -1) return;

    const newIndex = index + direction;

    if (newIndex < 0 || newIndex >= currentItems.length) return;

    const nextItems = [...currentItems];
    [nextItems[index], nextItems[newIndex]] = [
      nextItems[newIndex],
      nextItems[index],
    ];

    setModeItems(selectedMode, nextItems);
  };

  const saveItem = async (id: number) => {
    setEditingId(null);

    try {
      setSaving(true);

      const response = await fetch("/api/rubrics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(rubrics),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to save rubrics.");
      }
    } catch (error) {
      console.error("Failed to save rubrics:", error);
      alert("Failed to save rubrics.");
    } finally {
      setSaving(false);
    }
  };

  const mode = modes.find((item) => item.name === selectedMode);

  return (
    <main className="min-h-screen bg-[#090909] text-white">
      <section className="border-b border-white/10 px-5 pb-12 pt-24 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-red-500">
            IMC Control Center
          </p>

          <div className="mt-5 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
                Ranked Rubrics
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-500 sm:text-base">
                Create and manage the official testing rubrics for every IMC
                ranked gamemode.
              </p>
            </div>

            <a
              href="/ranked-rubrics"
              className="w-fit rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold transition hover:bg-white/[0.08]"
            >
              View Page →
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          <aside className="h-fit rounded-3xl border border-white/10 bg-white/[0.025] p-4">
            <p className="px-3 pb-3 text-xs font-bold uppercase tracking-[0.2em] text-gray-600">
              Gamemodes
            </p>

            <div className="space-y-1">
              {modes.map((item) => {
                const active = selectedMode === item.name;

                return (
                  <button
                    key={item.name}
                    onClick={() => {
                      setSelectedMode(item.name);
                      setEditingId(null);
                    }}
                    className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
                      active
                        ? "bg-red-600 text-white"
                        : "text-gray-400 hover:bg-white/[0.05] hover:text-white"
                    }`}
                  >
                    <img src={item.icon} alt="" className="h-6 w-6 object-contain" />
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </div>
          </aside>

          <div>
            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-red-950/30 to-white/[0.02] p-6 sm:p-8">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-2xl">
                    <img src={mode?.icon} alt="" className="h-8 w-8 object-contain" />
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-600">
                      Editing
                    </p>
                    <h2 className="mt-1 text-2xl font-black">
                      {selectedMode}
                    </h2>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={saveRubrics}
                    disabled={saving}
                    className="rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm font-bold transition hover:bg-white/[0.09] disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Save All"}
                  </button>

                  <button
                    onClick={() => addItem("box")}
                    className="rounded-xl bg-red-600 px-4 py-3 text-sm font-bold transition hover:bg-red-500"
                  >
                    + Add Box
                  </button>

                  <button
                    onClick={() => addItem("message")}
                    className="rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm font-bold transition hover:bg-white/[0.09]"
                  >
                    + Add Message
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {loading ? (
                <div className="rounded-3xl border border-dashed border-white/10 px-6 py-16 text-center">
                  <p className="text-lg font-bold text-gray-300">
                    Loading rubrics...
                  </p>
                </div>
              ) : items.length === 0 && (
                <div className="rounded-3xl border border-dashed border-white/10 px-6 py-16 text-center">
                  <p className="text-lg font-bold text-gray-300">
                    No rubric content yet
                  </p>

                  <p className="mt-2 text-sm text-gray-600">
                    Add a Box or Message to start building this rubric.
                  </p>
                </div>
              )}

          {!loading &&
            items.map((item: RubricItem, index: number) => {
              const editing = editingId === item.id;

              return (
                <div
                  key={item.id}
                  className="rounded-3xl border border-white/10 bg-white/[0.025] p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-red-500">
                        {item.type === "box" ? "Box" : "Message"} • #{index + 1}
                      </p>

                      {!editing && (
                        <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-gray-500">
                          {item.content || "No content yet."}
                        </p>
                      )}
                    </div>

                    {!editing && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => moveItem(item.id, -1)}
                          disabled={index === 0}
                          className="rounded-lg border border-white/10 px-3 py-2 text-sm font-semibold text-gray-400 transition hover:border-red-500/40 hover:bg-red-500/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-25"
                          title="Move up"
                        >
                          ↑
                        </button>

                        <button
                          onClick={() => moveItem(item.id, 1)}
                          disabled={index === items.length - 1}
                          className="rounded-lg border border-white/10 px-3 py-2 text-sm font-semibold text-gray-400 transition hover:border-red-500/40 hover:bg-red-500/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-25"
                          title="Move down"
                        >
                          ↓
                        </button>

                        <button
                          onClick={() => setEditingId(item.id)}
                          className="rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-gray-400 transition hover:bg-white/[0.05] hover:text-white"
                        >
                          Edit
                        </button>
                      </div>
                    )}
                  </div>

                  {editing ? (
                    <div className="mt-5 space-y-4">
                      {item.type === "box" && (
                        <input
                          value={item.title}
                          onChange={(event) =>
                            updateItem(item.id, "title", event.target.value)
                          }
                          placeholder="Box title"
                          className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none transition placeholder:text-gray-700 focus:border-red-500/50"
                        />
                      )}

                      <textarea
                        value={item.content}
                        onChange={(event) =>
                          updateItem(item.id, "content", event.target.value)
                        }
                        placeholder={
                          item.type === "box"
                            ? "Write the box content..."
                            : "Write your message..."
                        }
                        rows={7}
                        className="w-full resize-y rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-gray-700 focus:border-red-500/50"
                      />

                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => saveItem(item.id)}
                          className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold transition hover:bg-red-500"
                        >
                          Save
                        </button>

                        <button
                          onClick={() => deleteItem(item.id)}
                          className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-2.5 text-sm font-semibold text-red-400 transition hover:bg-red-500/10"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })}
        </div>
      </div>
        </div>
      </section>
    </main>
  );
}
