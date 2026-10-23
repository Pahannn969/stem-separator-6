import { NextRequest, NextResponse } from "next/server";
import { Client } from "@gradio/client";

// OPSI A - FINAL: pakai @gradio/client langsung ke HF Space
// ENV wajib: HF_SPACE_URL contoh https://akivymoon-demucs-htdemucs-6s.hf.space
// atau duplikat space kamu sendiri

export const runtime = "nodejs";
export const maxDuration = 300; // 5 menit, karena demucs berat

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "file kosong" }, { status: 400 });

    const HF_SPACE_URL = process.env.HF_SPACE_URL;
    if (!HF_SPACE_URL) return NextResponse.json({ error: "HF_SPACE_URL belum di set di Vercel" }, { status: 500 });

    // Convert File -> Blob yang dimengerti Gradio
    const arrayBuffer = await file.arrayBuffer();
    const blob = new Blob([arrayBuffer], { type: file.type || "audio/wav" });

    // Connect ke Space
    const client = await Client.connect(HF_SPACE_URL);

    // Prediksi: Sesuai Space akivymoon/Demucs-htdemucs-6s
    // fn_index 0 = /predict, inputs: [audio]
    // Balik: array 6 file (drums, bass, vocals, other, guitar, piano)
    const result = await client.predict("/predict", [blob]) as any;

    // result.data = [[{name: "drums.wav", data: ...}, ...]] atau URL
    // Normalisasi ke URL yang bisa di-fetch
    const data = result.data as any[];
    let files: any[] = [];
    if (Array.isArray(data[0])) files = data[0];
    else files = data;

    const labels = ["drums", "bass", "vocals", "other", "guitar", "piano"] as const;
    const stems = files.slice(0, 6).map((f: any, i: number) => {
      // f bisa { url } atau string path
      const url = f?.url || f?.name ? HF_SPACE_URL + "/file=" + f.name : f;
      return { label: labels[i] || "other", url };
    });

    return NextResponse.json({ stems });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e.message || "Gagal separate" }, { status: 500 });
  }
}
