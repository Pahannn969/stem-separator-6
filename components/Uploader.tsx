"use client";
import { useRef, useState } from "react";

export default function Uploader({ onFile, loading }: { onFile: (f: File) => void; loading: boolean }) {
  const ref = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => {
        e.preventDefault(); setDrag(false);
        const f = e.dataTransfer.files[0];
        if (f) onFile(f);
      }}
      className={`rounded-[20px] border-2 border-dashed p-8 text-center transition-all ${drag ? "border-white bg-zinc-900" : "border-zinc-700 bg-zinc-900/50"} `}
    >
      <input ref={ref} type="file" accept=".mp3,.wav,.flac,.m4a,.ogg" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); }} />
      <div className="mx-auto max-w-[360px]">
        <div className="text-[40px]">🎧</div>
        <p className="mt-3 font-semibold">Drag & drop lagu di sini</p>
        <p className="mt-1 text-sm text-zinc-400">atau pencet tombol bawah, max 50MB</p>
        <button
          disabled={loading}
          onClick={() => ref.current?.click()}
          className="mt-5 rounded-full bg-white text-black px-5 py-2.5 text-sm font-semibold disabled:opacity-50 hover:bg-zinc-200 transition"
        >
          {loading ? "Lagi proses..." : "Pilih File"}
        </button>
      </div>
    </div>
  );
}
