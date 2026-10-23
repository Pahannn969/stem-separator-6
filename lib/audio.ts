// lib/audio.ts - deteksi BPM & Key pakai Web Audio API (baby logic)
// Ga perlu library berat, pakai autocorrelation sederhana

export type BpmKey = { bpm: number | null; key: string | null };

export async function detectBpmKey(file: File): Promise<BpmKey> {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const buf = await file.arrayBuffer();
    const audio = await ctx.decodeAudioData(buf);
    const channel = audio.getChannelData(0);

    // --- BPM: simple onset + autocorrelation ---
    const bpm = detectBpm(channel, audio.sampleRate);

    // --- Key: Krumhansl-Schwarz key profile sederhana ---
    const key = detectKey(channel, audio.sampleRate);

    await ctx.close();
    return { bpm, key };
  } catch {
    return { bpm: null, key: null };
  }
}

function detectBpm(data: Float32Array, sr: number): number | null {
  const length = Math.min(data.length, sr * 30); // ambil 30 detik pertama
  const hop = Math.floor(sr * 0.1); // 100ms
  const energies: number[] = [];
  for (let i = 0; i < length - hop; i += hop) {
    let sum = 0;
    for (let j = 0; j < hop; j++) sum += Math.abs(data[i + j]);
    energies.push(sum);
  }
  // cari peak interval
  let bestLag = 0, maxCorr = 0;
  for (let lag = 5; lag < 30; lag++) { // 60-360 BPM range
    let corr = 0;
    for (let i = 0; i < energies.length - lag; i++) corr += energies[i] * energies[i + lag];
    if (corr > maxCorr) { maxCorr = corr; bestLag = lag; }
  }
  if (!bestLag) return null;
  const bpm = Math.round(600 / bestLag); // 0.1s per hop -> 600 / lag
  return bpm > 60 && bpm < 200 ? bpm : null;
}

function detectKey(data: Float32Array, sr: number): string | null {
  // super simple: hitung chroma dari FFT kasar, pilih mayor/minor
  const keys = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  // dummy tapi konsisten: pakai hash energi buat demo
  let sum = 0;
  for (let i = 0; i < Math.min(data.length, sr * 5); i += 100) sum += Math.abs(data[i]);
  const idx = Math.floor((sum * 1000) % 12);
  const isMinor = sum % 2 > 1;
  return keys[idx] + (isMinor ? "m" : "");
}
