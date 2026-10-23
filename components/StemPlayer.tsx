"use client";
import { useRef, useState } from "react";

export default function StemPlayer({ label, src }: { label: string; src: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [vol, setVol] = useState(1);

  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) audioRef.current.pause();
    else audioRef.current.play();
    setPlaying(!playing);
  };

  const icons: Record<string, string> = {
    drums: "🥁", bass: "🎸", vocals: "🎤", other: "🎹", guitar: "🎸", piano: "🎹"
  };

  return (
    <div className="rounded-[16px] border border-zinc-800 bg-zinc-900 p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[18px]">{icons[label] || "🎵"}</span>
          <span className="font-mono text-[13px] tracking-widest uppercase">{label}</span>
        </div>
        <span className={`h-2 w-2 rounded-full ${playing ? "bg-green-400 animate-pulse" : "bg-zinc-600"}`} />
      </div>
      <audio ref={audioRef} src={src} onEnded={() => setPlaying(false)} onVolumeChange={(e) => setVol((e.target as HTMLAudioElement).volume)} />
      <div className="flex items-center gap-3">
        <button onClick={toggle} className="h-10 w-10 grid place-items-center rounded-full bg-white text-black text-[14px] font-bold">
          {playing ? "II" : "▶"}
        </button>
        <input type="range" min={0} max={1} step={0.01} value={vol} onChange={(e) => { const v = parseFloat(e.target.value); setVol(v); if (audioRef.current) audioRef.current.volume = v; }} className="flex-1 accent-white" />
        <a href={src} download={`${label}.wav`} className="text-[11px] font-mono text-zinc-400 hover:text-white border border-zinc-700 rounded-full px-3 py-1">DOWNLOAD</a>
      </div>
    </div>
  );
}
