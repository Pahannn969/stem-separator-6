// lib/separate.ts - helper kalau mau pakai di client atau server lain
export const STEM_LABELS = ["drums", "bass", "vocals", "other", "guitar", "piano"] as const;
export type StemLabel = typeof STEM_LABELS[number];

export function isValidAudioFile(file: File) {
  const ok = ["audio/mpeg", "audio/wav", "audio/flac", "audio/x-flac", "audio/mp3", "audio/ogg"];
  return ok.includes(file.type) || /\.(mp3|wav|flac|ogg|m4a)$/i.test(file.name);
}

export function formatBytes(bytes: number) {
  if (bytes < 1024) return bytes + " B";
  return (bytes / 1024 / 1024).toFixed(1) + " MB";
}
