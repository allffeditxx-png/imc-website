"use client";

import { usePathname, useRouter } from "next/navigation";

export default function BackButton() {
    const router = useRouter();
    const pathname = usePathname();

    if (pathname === "/") {
        return null;
    }

    return (
        <button
            onClick={() => router.back()}
            aria-label="Go back"
            className="fixed right-5 top-5 z-[9999] inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/60 px-3 py-1.5 text-xs font-medium text-white/80 shadow-lg backdrop-blur-md transition hover:bg-white/10 hover:text-white"
        >
            ← Back
        </button>
    );
}
