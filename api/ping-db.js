// File ini taruh di: api/ping-db.js (di root project rig-order, sejajar dengan api/notify-discord.js)
// Fungsinya: query super ringan ke Supabase supaya project dianggap "aktif" dan tidak di-auto-pause.

import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({ ok: false, error: 'SUPABASE_URL atau SUPABASE_KEY belum diset' });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Query paling ringan: ambil 1 baris saja dari tabel app_storage
    const { error } = await supabase
      .from('app_storage')
      .select('key')
      .limit(1);

    if (error) {
      return res.status(500).json({ ok: false, error: error.message });
    }

    return res.status(200).json({ ok: true, pinged_at: new Date().toISOString() });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
}
