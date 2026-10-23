import { NextRequest, NextResponse } from "next/server";
import { Client } from "@gradio/client";

export const maxDuration = 300;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

    const HF_URL = process.env.HF_SPACE_URL || "https://ramdomx-Demucs6s.hf.space";
    console.log("Connect to:", HF_URL);
    
    const client = await Client.connect(HF_URL);
    const blob = new Blob([await file.arrayBuffer()]);
    
    // ramdomx input namanya "audio" / index 0
    const result = await client.predict("/predict", [blob]);
    
    console.log("Result:", result);
    return NextResponse.json(result);
  } catch (e: any) {
    console.error("SEPARATE ERROR:", e);
    return NextResponse.json({ error: e.message || "Gagal separate", detail: String(e) }, { status: 500 });
  }
}
