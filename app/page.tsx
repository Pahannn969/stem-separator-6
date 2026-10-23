"use client";
import { useState } from "react";
import Uploader from "@/components/Uploader";
import StemPlayer from "@/components/StemPlayer";
import BpmKeyBadge from "@/components/BpmKeyBadge";
import { detectBpmKey } from "@/lib/audio";

type StemResult = {
  label: "drums" | "bass" | "vocals" | "other" | "guitar" | "piano";
  url: string;
};

export default function Page() {
  const [stems, setStems] = useState<StemResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [bpm, setBpm] = useState<number | null>(null);
  const [key, setKey] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");

  const handleFile = async (file: File) => {
    setLoading(true);
    setFileName(file.name);
    try {
      const bpmKey = await detectBpmKey(file);
      setBpm(bpmKey.bpm);
      setKey(bpmKey.key);

      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/separate", { method: "POST", body: fd });
      if (!res.ok) throw new Error("Gagal separate");
      const data = await res.json();
      setStems(data.stems);
    } catch (e) {
      alert("Error: " + (e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen max-w-[980px] mx-auto px-5 py-10">
      <header className="mb-8">
        <h1 className="text-[36px] font-bold tracking-[-0.02em]">Stem Separator 6</h1>
        <p className="text-[#8a8a8a] mt-2">Upload lagu → jadi 6 stem + BPM & Key otomatis. Max 50MB, FLAC/WAV/MP3.</p>
      </header>

      <Uploader onFile={handleFile} loading={loading} />
      {fileName && <p className="mt-4 text-sm text-zinc-400">{fileName}</p>}
      {(bpm || key) && <BpmKeyBadge bpm={bpm} musicalKey={key} />}

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        {stems.map((s) => (
          <StemPlayer key={s.label} label={s.label} src={s.url} />
        ))}
      </div>
    </main>
  );
}
