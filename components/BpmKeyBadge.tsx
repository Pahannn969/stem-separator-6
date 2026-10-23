"use client";
export default function BpmKeyBadge({ bpm, musicalKey }: { bpm: number | null; musicalKey: string | null }) {
  return (
    <div className="mt-4 flex gap-2">
      {bpm && <span className="rounded-full bg-white text-black px-3 py-1 text-xs font-mono font-bold">{bpm} BPM</span>}
      {musicalKey && <span className="rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-xs font-mono">KEY: {musicalKey}</span>}
    </div>
  );
}
