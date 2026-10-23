# Stem Separator 6 - Demucs htdemucs 6s

Pisah lagu jadi 6 stem: drums, bass, vocals, other, guitar, piano.
Plus deteksi BPM & Key otomatis di browser.

## Cara Jalanin (bayi version)
1. Bikin DAPUR di HuggingFace: duplicate space akivymoon/Demucs-htdemucs-6s
2. Bikin LEMARI di GitHub: upload 13 file ini
3. Bikin TOKO di Vercel: import repo, set ENV HF_SPACE_URL, deploy

ENV:
HF_SPACE_URL=https://username-duplikat-kamu.hf.space

Test: upload FLAC 30 detik dulu, kalau 6 stem keluar = berhasil.

Stack: Next.js 14, @gradio/client, Web Audio API
