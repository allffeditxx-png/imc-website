"use client";

import { useRouter } from "next/navigation";

export default function BackButton() {
    const router = useRouter();

    return (
        <button
            onClick={() => router.back()}
            className="fixed left-4 top-4 z-[9999] inline-flex items-center gap-2 rounded-lg border border-white/10 bg-black/70 px-4 py-2 text-sm font-medium text-white backdrop-blur-md transition hover:bg-white/10"
        >
            ← Back
        </button>
    );
}
