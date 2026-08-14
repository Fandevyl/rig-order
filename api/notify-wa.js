// Vercel Serverless Function — /api/notify-wa
// Menerima data permintaan baru, lalu kirim notifikasi WhatsApp lewat Fonnte.
// Token & nomor tujuan disimpan sebagai Environment Variable di Vercel (bukan di kode),
// supaya tidak bocor ke publik.

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const token = process.env.FONNTE_TOKEN;
  const target = process.env.WA_TARGET_NUMBER;

  if (!token || !target) {
    console.error("FONNTE_TOKEN atau WA_TARGET_NUMBER belum diatur di Environment Variables Vercel");
    return res.status(500).json({ error: "Konfigurasi WhatsApp belum lengkap" });
  }

  try {
    const { area, pemohon, lokasi, barang, tanggal, jam, urgensi, keterangan } = req.body || {};

    const urgLabel = urgensi === "ss" ? "🔴 PANGGILAN SS" : urgensi === "darurat" ? "🟡 DARURAT" : "Normal";

    const message =
      `*PERMINTAAN LIFTING BARU*\n` +
      `${urgLabel}\n\n` +
      `Area: ${area || "-"}\n` +
      `Pemohon: ${pemohon || "-"}\n` +
      `Lokasi: ${lokasi || "-"}\n` +
      `Barang: ${barang || "-"}\n` +
      `Tanggal: ${tanggal || "-"}${jam ? " " + jam : ""}\n` +
      (keterangan ? `Keterangan: ${keterangan}\n` : "") +
      `\nCek di rig-order.vercel.app`;

    const response = await fetch("https://api.fonnte.com/send", {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ target, message }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Fonnte error:", data);
      return res.status(502).json({ error: "Gagal kirim WhatsApp", detail: data });
    }

    return res.status(200).json({ ok: true, data });
  } catch (err) {
    console.error("notify-wa error:", err);
    return res.status(500).json({ error: "Terjadi kesalahan server" });
  }
}
