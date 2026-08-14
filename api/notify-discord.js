// Vercel Serverless Function — /api/notify-discord
// Menerima data permintaan baru, lalu kirim notifikasi ke channel Discord lewat Webhook.
// URL webhook disimpan sebagai Environment Variable di Vercel (bukan di kode).

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

  if (!webhookUrl) {
    console.error("DISCORD_WEBHOOK_URL belum diatur di Environment Variables Vercel");
    return res.status(500).json({ error: "Konfigurasi Discord belum lengkap" });
  }

  try {
    const { area, pemohon, lokasi, barang, tanggal, jam, urgensi, keterangan } = req.body || {};

    const urgLabel = urgensi === "ss" ? "🔴 PANGGILAN SS" : urgensi === "darurat" ? "🟡 DARURAT" : "Normal";

    const content =
      `**PERMINTAAN LIFTING BARU** — ${urgLabel}\n` +
      `Area: ${area || "-"}\n` +
      `Pemohon: ${pemohon || "-"}\n` +
      `Lokasi: ${lokasi || "-"}\n` +
      `Barang: ${barang || "-"}\n` +
      `Tanggal: ${tanggal || "-"}${jam ? " " + jam : ""}\n` +
      (keterangan ? `Keterangan: ${keterangan}\n` : "") +
      `\nCek di rig-order.vercel.app`;

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("Discord webhook error:", text);
      return res.status(502).json({ error: "Gagal kirim ke Discord", detail: text });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("notify-discord error:", err);
    return res.status(500).json({ error: "Terjadi kesalahan server" });
  }
}
