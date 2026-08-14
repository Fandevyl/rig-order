import React, { useState, useEffect, useMemo, useCallback } from "react";
import { supabase } from "./supabaseClient";
import {
  Radio, ClipboardList, LayoutGrid, CalendarClock, BarChart3, Clock3,
  Plus, Check, ChevronDown, AlertTriangle, PhoneCall, MapPin, Package,
  Weight, Ruler, User, Loader2, X, Siren, Lock, LogOut, Printer, Users, Trash2, Camera, Link2
} from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  LineChart, Line, Legend, Cell
} from "recharts";

/* ---------------------------------------------------------------
   TOKENS
   bg-deep #14181B  panel #1F262A  panel-raised #262F34  line #38434A
   amber(signature) #F2A31B   red(SS) #E1493F   green(selesai) #5FA980
   text #EDEBE4   muted #8B98A0   tag paper #EDE6D3
----------------------------------------------------------------*/

const COMPANY_LOGO = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKAAAAAyCAMAAADsvyBXAAABCGlDQ1BJQ0MgUHJvZmlsZQAAeJxjYGA8wQAELAYMDLl5JUVB7k4KEZFRCuwPGBiBEAwSk4sLGHADoKpv1yBqL+viUYcLcKakFicD6Q9ArFIEtBxopAiQLZIOYWuA2EkQtg2IXV5SUAJkB4DYRSFBzkB2CpCtkY7ETkJiJxcUgdT3ANk2uTmlyQh3M/Ck5oUGA2kOIJZhKGYIYnBncAL5H6IkfxEDg8VXBgbmCQixpJkMDNtbGRgkbiHEVBYwMPC3MDBsO48QQ4RJQWJRIliIBYiZ0tIYGD4tZ2DgjWRgEL7AwMAVDQsIHG5TALvNnSEfCNMZchhSgSKeDHkMyQx6QJYRgwGDIYMZAKbWPz9HbOBQAAAAYFBMVEX///////7+/////v/+/v/+/v7+/vz9/v77//3+/f79/f3+/fv+/Pz8/Pz7+/v6/Pz7+/n68PDp7OTkzs2qxEvkqK6fnp/PdX41gbEAdr8obJneOkRxREkuKywdGhsSDxBCk0MZAAAIGUlEQVR42s2Yi5ajKBCGCQoFCMpl1NkTY97/LfcvNOmYdE/P7vbZaU63CpTwpYoqSoT4uMhWU9Oc9qKbVmrxrUpj3RC8tdY5Z22ntWq+F6AxhyqFjv4Uinq3kC6PJQo/qP+xfA7oxXh+KHMRUZGl9tsAWuvnR8JzkZ7I2D+gwg8AB5MPgHMiR/CV7wKoTDwa+Tyeekvm2wBqssM7RlbfR4POBpmejKxC830AmfHFyF59K0AVXow8NN8K0MsXT7Z/EPAWQ948oRvk0cjz6U8Dat11yAxuxXpdDlYuAuH6vbD+4Tr+qANvEP0jwKpAIucCo5kQYiTTBeHzw56cnd007GrZGAwXd2h0t4LhrbtT3jvvlfsgT/f3NIguioesrzGmGeIhtdiH2Qdw4WGsW6MKD+M7697muD3xzW01XII7dImPnQS6Eybdy5CjNciyYnooe7YQthoA3P6YourvjeEuH5zD+3H7XXgKIOMG6IKviuXR2dfKTeR9QDJBD9PPx5LVcMrjj4dShGtbKCUuF5RlmRqR6+PlMomyPSyjSHvbZclCTNwXSA38NIrItyJYehK08HPkQVjG2qUKv78Go80//3ooPzO/+eNQotMb4OW6Xq/XdZ1Evqz8eAXgum6NBd3XWlkz91+XKA0Al+t1EYobJiFGvhI3JQdaVPqwCbPR3wG0wRz4/gKfjke+LNiTqgavyzRNl/USMCY/TgWzrJdpWi7XRW19uGYxgXQtUI+My7pesppWpuGfMwm3rBfc1AbYQxivZajwHcAgyoFvEjGeyo+jgTv1Boh3MXzOdTouAERjz4DcVyUc7heWCK7qGjR4ibsKaxCAtW0DVP0u3L8Akg7Nk4EHg6YnA5PeN+kNEDNe0kGDS+oLTx/7gLlSwBrBhBCOomedoY9fWlGvGrRMdPuVsXJCWL2YWBsd6MnAp8G+GNhVQGLAFS5SF8zDGrzUxisMChUwIHsE7DtxEx6vF34Nf1eY8Qa4jJW6AkIi4x+u2DwB6uHVwN2zgZtOPwBWKozFGuFSNbjCN+DFCBwbYOCbfZuef8N1qgzjDRDt68QSrtqlgocnQESYZwPT8GJgbILqDghtIMpktjMMyHGwmhgKgxeGHVBWfFb1JdXVyD9sLSN7zR0wJnae3W+q8PJiYhNfPLin9OLBWr1psLqAEHWRLSnnnDYnmXje3lEFVFy9bqFHhKotMISqpDdAselVsCqrLNv4zndqdGfji4H7TjwZ+NRhJTw6ifOhd+5u4roGN3VUn60m5it7EM+fLnXFbov1ETDU6AKBZd2E+SfeATUZE07PBtb+lJ8ijKv5zQ2QJ+N9HYBVRVugZiZ4Yp2gApZ10zRXalwBS65Kh7pqmIHZVY8bKrVF8Nhouxv5pA11TwaGy7nuMYkp1b4PJeKH1sTBiTRtBe6CK9RRcINqucLPBWmRwz1nllFl2t/mqmSpHiG49rFQHyNH+STugE3nX0P0gLTrkMScuqdP4kOKsi/meqFQkxjH70t3S4DuMm5PYQRt0ts4m9wu7J7O2brYPhsYu16nXdftOR1yWKeeAEMfbvlm3w89CpK1vof7Uqg3lrDKcTsT9D0LBn5S29PWFbgDmxMq8iaMN9UB8MXAeOeIw/776aECcdmSZVL28PBhUv2h0APgqwe7f/d9/o8B1W8BvoZo7f7zJ499efgt6fcAJcknA5/i7wzqUe4fFlzx7t5G1m8fLuS8pdtHlX+EsZD3fg/7XtHHgIj1B/2B73MDW119UHetaYQycj+FrZfWaqRjzu4BkzqLj0O0Q4gM2VOrrbT7ca1GbCXX4PIrE5fprZRBBPMZIABMHOd59MarUqRK48xVtI2FHL7v0rh9blIcIxq8KKNMYyLvxJiboKPxeGEuQg6mkxii+wXg8ehZd4o+PYDRTqbzPJ9n7Bfz3BgAolpq2yiGIMZz4qNOS/48d9axlEh8OmbSeZQRN/yecTzPyYWuQaf/lRe7YQhbif1AMMinZ4DG8nSinBMfjeD3CzGPAm1ZjLO3LjInz2k8yPXQo7m+0UuG8j7OM3/MJj5YlqUe7H0MeCLq4OdYKFjPhOVgPw8MHfF0DARNzGKInu29AfZBlhkqxDgkLdteDDfAEFEfpeSfBmUIgV0WQ0Ak/ObhUfNbR7xtJ+MZEHOHWYFlAmsQ0LDaKPoGFfxFZ1rL/bOgDVBK3KFj5o22fkV7nc8JvORb+y9Ot34FCMKEmVJilhMu9bizdGyzglUZsRU2HsBMuANC0RG9vOqizLyKeXnWIXr6QkDFgPj0hs7YL+ARzbYGRz5BFHNtBI4jex6VZM1WwKacN98az9HEmOEqzT5ENM6ZrwTEdC5iyXMqBsfcARPWnsjnMZfM6yq03B5lYiheg/PMOdw5YYEIxEWsSOh2HyK69ssAdXUS2UcYEBOBqtlMzAjwUCHxLQKB0HSQiJ6DEgNmeBG6IFCwQAoWsYd2uYlV6uzXadBQnDPpjDgWg0tzliOCbppTi8gxFtV7J0dEGvIjclI71EA9pzJaxDIqiDGJA/Xo4fAJu55Fpwz0dU6CWHQyhB2MDL4YWnw2cLRSyLqlwLYGVTTY5BBnrLDY3owRlhph7AnrDFFe+mCE9JzWkmDnsFIY/ZVOwrNaMs53xjTaBXIIjRbTahNMcNv5jTHYaZH6GmUb26JmOA9GlMerXeddq/ugjTecaVKwWn0ZIEGBpl4YlKBJE/BZQ9Alsgi067oKsFIJEro1vAmg4GZY3EAUd/wCRHKQc3KssS++rsG/AetdLOmUpGWdAAAAAElFTkSuQmCC";
const PENGAWAS_PASSWORD = "Anakketua10";
const AREAS = ["MA1", "MA2", "MA3", "MA4", "Genmaint", "Workshop"];
const RIGGERS_DEFAULT = ["Andi P.", "Budi S.", "Candra W.", "Dedi R.", "Eko F.", "Fajar N."];
const KATEGORI_LIST = ["TKJP", "Pekerja Kontrak"];
const POSISI_LIST = ["Rigger", "Operator Crane", "Operator Forklift"];
const CRITICAL_LIFT_THRESHOLD = 75; // % dari SWL
const CHECKLIST_ITEMS = [
  { id: "c1", label: "Alat sudah diperiksa visual, tidak ada kerusakan/retak" },
  { id: "c2", label: "Sling / webbing / wire rope dalam kondisi baik, tidak aus/sobek" },
  { id: "c3", label: "SWL alat sudah dikonfirmasi cukup untuk beban" },
  { id: "c4", label: "Area kerja steril dari orang yang tidak berkepentingan" },
  { id: "c5", label: "Rigger/operator bersertifikat (SIO) sudah standby" },
  { id: "c6", label: "Permukaan / ground kerja stabil dan rata" },
  { id: "c7", label: "Cuaca & kondisi lingkungan aman untuk lifting" },
  { id: "c8", label: "Jalur lifting bebas dari halangan (kabel, pipa, dll)" },
];
function parseTon(text) {
  if (!text) return "";
  const m = String(text).match(/[\d.]+/);
  return m ? m[0] : "";
}
function emptyLiftingPlan() {
  return { alat: "", swl: "", beratBeban: "", radius: "", boom: "", checklist: {}, completed: false, templateUsed: "", kodeBarang: "" };
}
function emptyJSA() {
  return { hazards: [], pengawasNama: "", pengawasAt: "", safetyNama: "", safetyAt: "", completed: false };
}
function isJSAComplete(jsa) {
  return !!(jsa && jsa.hazards && jsa.hazards.length > 0 && jsa.hazards.every((h) => h.hazard && h.mitigation) && jsa.pengawasNama && jsa.safetyNama);
}
function isChecklistComplete(checklist) {
  return CHECKLIST_ITEMS.every((c) => checklist && checklist[c.id]);
}
function libKey(barang, lokasi) {
  return `${(barang || "").trim().toLowerCase()}|${(lokasi || "").trim().toLowerCase()}`;
}
function interpolateLoadChart(chart, radius) {
  if (!chart || chart.length === 0) return null;
  const sorted = [...chart].map((p) => ({ radius: parseFloat(p.radius), kapasitas: parseFloat(p.kapasitas) })).sort((a, b) => a.radius - b.radius);
  const r = parseFloat(radius);
  if (isNaN(r) || sorted.length === 0) return null;
  const first = sorted[0], last = sorted[sorted.length - 1];
  if (r <= first.radius) return { value: first.kapasitas, outOfRange: r < first.radius };
  if (r >= last.radius) return { value: last.kapasitas, outOfRange: r > last.radius };
  for (let i = 0; i < sorted.length - 1; i++) {
    const a = sorted[i], b = sorted[i + 1];
    if (r >= a.radius && r <= b.radius) {
      const t = (r - a.radius) / (b.radius - a.radius || 1);
      const val = a.kapasitas + t * (b.kapasitas - a.kapasitas);
      return { value: Math.round(val * 100) / 100, outOfRange: false, a, b };
    }
  }
  return null;
}
function chartHasBoom(chart) {
  return !!(chart && chart.some((p) => p.boom !== undefined && p.boom !== null && String(p.boom).trim() !== ""));
}
function chartBoomOptions(chart) {
  if (!chart) return [];
  const set = new Set(chart.map((p) => String(p.boom)).filter((b) => b && b !== "undefined"));
  return [...set].sort((a, b) => parseFloat(a) - parseFloat(b));
}
function interpolateLoadChart2D(chart, boom, radius) {
  if (!chart || chart.length === 0) return null;
  if (!chartHasBoom(chart)) return interpolateLoadChart(chart, radius);
  const options = chartBoomOptions(chart);
  if (options.length === 0) return null;
  let useBoom = String(boom);
  let boomOutOfRange = false;
  if (!options.includes(useBoom)) {
    // pick nearest available boom length
    const target = parseFloat(boom);
    if (isNaN(target)) return null;
    let nearest = options[0];
    let bestDiff = Infinity;
    for (const o of options) {
      const diff = Math.abs(parseFloat(o) - target);
      if (diff < bestDiff) { bestDiff = diff; nearest = o; }
    }
    useBoom = nearest;
    boomOutOfRange = true;
  }
  const subset = chart.filter((p) => String(p.boom) === useBoom);
  const result = interpolateLoadChart(subset, radius);
  if (!result) return null;
  return { ...result, outOfRange: result.outOfRange || boomOutOfRange, boomUsed: useBoom };
}
function seedProfiles() {
  return {
    "Andi P.": { kategori: "TKJP", posisi: "Rigger" },
    "Budi S.": { kategori: "TKJP", posisi: "Rigger" },
    "Candra W.": { kategori: "Pekerja Kontrak", posisi: "Operator Crane" },
    "Dedi R.": { kategori: "TKJP", posisi: "Rigger" },
    "Eko F.": { kategori: "Pekerja Kontrak", posisi: "Operator Forklift" },
    "Fajar N.": { kategori: "Pekerja Kontrak", posisi: "Rigger" },
  };
}
function seedGear() {
  return [
    { id: uid(), nama: "Web Sling 2 Ton", kapasitas: "2 ton", kondisi: "Baik", kategori: "Lifting Gear" },
    { id: uid(), nama: "Chain Block 3 Ton", kapasitas: "3 ton", kondisi: "Baik", kategori: "Lifting Equipment" },
    { id: uid(), nama: "Shackle 1 Ton", kapasitas: "1 ton", kondisi: "Rusak", kategori: "Lifting Gear" },
    { id: uid(), nama: "Wire Rope Sling 5 Ton", kapasitas: "5 ton", kondisi: "Baik", kategori: "Lifting Gear" },
  ];
}
const GEAR_KATEGORI_LIST = ["Lifting Equipment", "Lifting Gear"];
const URGENSI = [
  { key: "normal", label: "Normal", color: "#8B98A0" },
  { key: "darurat", label: "Darurat", color: "#F2A31B" },
  { key: "ss", label: "Panggilan SS", color: "#E1493F" },
];
const STATUS_FLOW = ["Pending", "Diproses", "Selesai"];

function uid() { return Math.random().toString(36).slice(2, 9); }
function todayISO() { return new Date().toISOString().slice(0, 10); }
function fmtDate(d) {
  if (!d) return "-";
  const dt = new Date(d + "T00:00:00");
  return dt.toLocaleDateString("id-ID", { weekday: "short", day: "2-digit", month: "short", year: "numeric" });
}
function isWeekend(dateStr) {
  const dt = new Date(dateStr + "T00:00:00");
  const day = dt.getDay();
  return day === 0 || day === 6;
}
function areaLabel(a) { return a.replace(/([A-Za-z])(\d)/, "$1 $2"); }
function areaFullLabel(a) { return a.replace(/^MA(\d)$/, "Maintenance Area $1"); }

function seedRequests() {
  const now = new Date();
  const mk = (o) => ({
    id: uid(), pemohon: "", nopek: "", telp: "", radio: "", lokasi: "", tanggal: todayISO(), jam: "",
    barang: "", urgensi: "normal", berat: "", dimensi: "", keterangan: "", status: "Pending",
    riggers: [], jamMulai: "", jamSelesai: "", overtimeOverride: null,
    createdAt: now.toISOString(), ...o,
  });
  return [
    mk({ area: "MA1", pemohon: "Taufan Fajar", nopek: "754688", telp: "5807", radio: "Ch. 3", lokasi: "CWI", barang: "Band Screen C", urgensi: "darurat", berat: "1 ton", status: "Diproses", riggers: ["Andi P.", "Budi S."], jamMulai: "08:30", jamSelesai: "12:00" }),
    mk({ area: "MA2", pemohon: "Herman S.", nopek: "731204", telp: "5102", radio: "Ch. 2", lokasi: "Conveyor 12", barang: "Motor gearbox", urgensi: "ss", riggers: [], status: "Pending" }),
    mk({ area: "Genmaint", pemohon: "Wawan K.", nopek: "719855", telp: "5044", lokasi: "Workshop bay 3", barang: "Panel listrik", urgensi: "normal", status: "Selesai", riggers: ["Candra W."], jamMulai: "07:30", jamSelesai: "10:00" }),
    mk({ area: "MA3", pemohon: "Rizki A.", nopek: "742390", telp: "5391", radio: "Ch. 1", lokasi: "Crusher house", barang: "Bearing housing", urgensi: "normal", status: "Selesai", riggers: ["Dedi R.", "Eko F."], jamMulai: "16:30", jamSelesai: "19:00" }),
  ];
}

/* ---------------- Storage helpers (Supabase-backed) ---------------- */
async function loadShared(key, fallback) {
  try {
    const { data, error } = await supabase.from("app_storage").select("value").eq("key", key).maybeSingle();
    if (error || !data) return fallback;
    return data.value;
  } catch { return fallback; }
}
async function saveShared(key, value) {
  try {
    await supabase.from("app_storage").upsert({ key, value, updated_at: new Date().toISOString() });
  } catch {}
}

async function uploadImage(file, pathPrefix) {
  const blob = await compressImageToBlob(file);
  const path = `${pathPrefix}-${Date.now()}.jpg`;
  const { error } = await supabase.storage.from("rigops-photos").upload(path, blob, {
    contentType: "image/jpeg",
    upsert: true,
  });
  if (error) throw error;
  const { data } = supabase.storage.from("rigops-photos").getPublicUrl(path);
  return data.publicUrl;
}

function compressImageToBlob(file, maxDim = 640, quality = 0.78) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Gagal membaca file"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Gagal memuat gambar"));
      img.onload = () => {
        let { width, height } = img;
        if (width > height && width > maxDim) { height = Math.round(height * (maxDim / width)); width = maxDim; }
        else if (height > maxDim) { width = Math.round(width * (maxDim / height)); height = maxDim; }
        const canvas = document.createElement("canvas");
        canvas.width = width; canvas.height = height;
        canvas.getContext("2d").drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("Gagal memproses gambar")), "image/jpeg", quality);
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

/* ---------------------------------------------------------------- */

export default function App() {
  const [ready, setReady] = useState(false);
  const [requests, setRequests] = useState([]);
  const [riggers, setRiggers] = useState([]);
  const [profiles, setProfiles] = useState({});
  const [gear, setGear] = useState([]);
  const [liftingTemplates, setLiftingTemplates] = useState([]);
  const [liftingLibrary, setLiftingLibrary] = useState([]);
  const [role, setRole] = useState("pengawas"); // 'pengawas' | area name
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState("beranda");
  const [toast, setToast] = useState(null);
  const printRef = React.useRef(null);

  const handlePrint = (r) => {
    if (printRef.current) printRef.current.innerHTML = buildTicketHTML(r);
    window.print();
  };

  const handleSetRole = (r) => {
    setRole(r);
    if (r !== "pengawas") setAuthed(false);
  };

  useEffect(() => {
    (async () => {
      const [r, rg, pf, gr] = await Promise.all([
        loadShared("rigops:requests", null),
        loadShared("rigops:riggers", null),
        loadShared("rigops:profiles", null),
        loadShared("rigops:gear", null),
      ]);
      setRequests(r ?? seedRequests());
      setRiggers(rg ?? RIGGERS_DEFAULT);
      setProfiles(pf ?? seedProfiles());
      setGear(gr ?? seedGear());
      const lt = await loadShared("rigops:lifting_templates", null);
      setLiftingTemplates(lt ?? []);
      const ll = await loadShared("rigops:lifting_library", null);
      setLiftingLibrary(ll ?? []);
      setReady(true);
    })();
  }, []);

  useEffect(() => {
    if (ready) saveShared("rigops:requests", requests);
  }, [requests, ready]);

  useEffect(() => {
    if (ready) saveShared("rigops:riggers", riggers);
  }, [riggers, ready]);

  useEffect(() => {
    if (ready) saveShared("rigops:profiles", profiles);
  }, [profiles, ready]);

  useEffect(() => {
    if (ready) saveShared("rigops:gear", gear);
  }, [gear, ready]);

  useEffect(() => {
    if (ready) saveShared("rigops:lifting_templates", liftingTemplates);
  }, [liftingTemplates, ready]);

  useEffect(() => {
    if (ready) saveShared("rigops:lifting_library", liftingLibrary);
  }, [liftingLibrary, ready]);

  const upsertLiftingLibrary = (barang, lokasi, data) => {
    const key = libKey(barang, lokasi);
    setLiftingLibrary((prev) => {
      const idx = prev.findIndex((e) => e.key === key);
      const entry = { key, barang, lokasi, ...data, updatedAt: new Date().toISOString() };
      if (idx === -1) return [...prev, entry];
      const next = [...prev];
      next[idx] = entry;
      return next;
    });
  };

  const saveLiftingTemplate = (tpl) => {
    setLiftingTemplates((prev) => [...prev, { ...tpl, id: uid(), createdAt: new Date().toISOString() }]);
    notify("Template lifting plan disimpan");
  };
  const removeLiftingTemplate = (id) => setLiftingTemplates((prev) => prev.filter((t) => t.id !== id));
  const removeLiftingLibraryEntry = (key) => setLiftingLibrary((prev) => prev.filter((e) => e.key !== key));

  const updateProfile = (name, patch) => {
    setProfiles((prev) => ({ ...prev, [name]: { ...prev[name], ...patch } }));
  };
  const addGear = (item) => setGear((prev) => [...prev, { ...item, id: uid() }]);
  const removeGear = (id) => setGear((prev) => prev.filter((g) => g.id !== id));
  const toggleGearKondisi = (id) => setGear((prev) => prev.map((g) => g.id === id ? { ...g, kondisi: g.kondisi === "Baik" ? "Rusak" : "Baik" } : g));
  const updateGear = (id, patch) => setGear((prev) => prev.map((g) => g.id === id ? { ...g, ...patch } : g));

  const addRigger = (name, kategori, posisi) => {
    const trimmed = name.trim();
    if (!trimmed || riggers.includes(trimmed)) return;
    setRiggers((prev) => [...prev, trimmed]);
    setProfiles((prev) => ({ ...prev, [trimmed]: { ...prev[trimmed], kategori: kategori || "TKJP", posisi: posisi || "Rigger" } }));
  };
  const removeRigger = (name) => {
    setRiggers((prev) => prev.filter((n) => n !== name));
  };

  const notify = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2400);
  }, []);

  const addRequest = (req) => {
    setRequests((prev) => [{ ...req, id: uid(), status: "Pending", riggers: [], createdAt: new Date().toISOString() }, ...prev]);
    notify("Permintaan terkirim ke Workshop");
  };

  const updateRequest = (id, patch) => {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
    if (patch.liftingPlan) {
      const lp = patch.liftingPlan;
      const req = requests.find((r) => r.id === id);
      if (req && lp.alat && lp.swl && lp.beratBeban) {
        upsertLiftingLibrary(req.barang, req.lokasi, { alat: lp.alat, swl: lp.swl, beratBeban: lp.beratBeban, radius: lp.radius || "", boom: lp.boom || "", kode: lp.kodeBarang || "" });
      }
    }
  };

  const deleteRequest = (id) => {
    setRequests((prev) => prev.filter((r) => r.id !== id));
    notify("Permintaan dihapus");
  };

  const isMA = role !== "pengawas";

  const NAV = isMA
    ? [
        { key: "beranda", label: "Beranda", icon: LayoutGrid },
        { key: "request", label: "Buat Request", icon: Plus },
        { key: "status", label: "Status Saya", icon: ClipboardList },
        { key: "tim", label: "Tim & Alat", icon: Users },
      ]
    : [
        { key: "beranda", label: "Beranda", icon: LayoutGrid },
        { key: "dashboard", label: "Dashboard", icon: LayoutGrid },
        { key: "harian", label: "Laporan Harian", icon: CalendarClock },
        { key: "grafik", label: "Grafik & Rekap", icon: BarChart3 },
        { key: "lembur", label: "Jam Lembur", icon: Clock3 },
        { key: "anggota", label: "Kelola Anggota", icon: Users },
        { key: "tim", label: "Tim & Alat", icon: Package },
      ];

  useEffect(() => {
    if (!NAV.find((n) => n.key === tab)) setTab(NAV[0].key);
    // eslint-disable-next-line
  }, [role]);

  if (!ready) {
    return (
      <div style={{ ...S.appShell, alignItems: "center", justifyContent: "center", display: "flex" }}>
        <Loader2 className="spin" size={22} color="#F2A31B" />
        <style>{fontImports}{`.spin{animation:spin 1s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  return (
    <div style={S.appShell}>
      <style>{fontImports}{globalCss}</style>

      {/* Sidebar */}
      <aside style={S.sidebar} className="no-print-area">
        <div style={S.sidebarHazard} />
        <div style={S.brand}>
          <div style={S.brandMark}><Link2 size={16} color="#14181B" /></div>
          <div>
            <div style={S.brandTitle}>RIG&nbsp;ORDER</div>
            <div style={S.brandSub}>Order Lifting Rigger</div>
          </div>
        </div>

        <RoleSwitcher role={role} setRole={handleSetRole} />

        <nav style={{ marginTop: 18 }}>
          {NAV.map((n) => (
            <button
              key={n.key}
              onClick={() => setTab(n.key)}
              style={{ ...S.navBtn, ...(tab === n.key ? S.navBtnActive : {}) }}
            >
              <n.icon size={16} strokeWidth={2} />
              <span>{n.label}</span>
            </button>
          ))}
        </nav>

        <div style={S.sidebarFoot}>
          {!isMA && authed && (
            <button style={S.logoutBtn} onClick={() => setAuthed(false)}>
              <LogOut size={13} /> Keluar mode Pengawas
            </button>
          )}
          <div style={S.footLine} />
          <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: "#5C666C", letterSpacing: 0.4 }}>
            RIG ORDER · DIGITAL<br />RIGGING REQUEST SYSTEM
          </div>
        </div>
      </aside>

      {/* Main */}
      <main style={S.main} className="no-print-area">
        {tab === "tim" && <TeamAndGear riggers={riggers} profiles={profiles} gear={gear} />}
        {tab === "beranda" && <BerandaMA requests={requests} area={role} />}
        {isMA && tab === "request" && <RequestForm area={role} onSubmit={addRequest} />}
        {isMA && tab === "status" && <StatusList area={role} requests={requests.filter((r) => r.area === role)} />}
        {!isMA && tab !== "tim" && tab !== "beranda" && !authed && <PasswordGate onSuccess={() => setAuthed(true)} />}
        {!isMA && authed && tab === "dashboard" && <Dashboard requests={requests} riggers={riggers} gear={gear} liftingTemplates={liftingTemplates} liftingLibrary={liftingLibrary} onSaveTemplate={saveLiftingTemplate} onUpdate={updateRequest} onDelete={deleteRequest} notify={notify} onPrint={handlePrint} />}
        {!isMA && authed && tab === "harian" && <DailyReport requests={requests} />}
        {!isMA && authed && tab === "grafik" && <Charts requests={requests} riggers={riggers} />}
        {!isMA && authed && tab === "lembur" && <Overtime requests={requests} riggers={riggers} onUpdate={updateRequest} />}
        {!isMA && authed && tab === "anggota" && <AnggotaManager riggers={riggers} profiles={profiles} onAdd={addRigger} onRemove={removeRigger} onUpdateProfile={updateProfile} gear={gear} onAddGear={addGear} onRemoveGear={removeGear} onToggleGear={toggleGearKondisi} onUpdateGear={updateGear} liftingTemplates={liftingTemplates} onRemoveTemplate={removeLiftingTemplate} liftingLibrary={liftingLibrary} onRemoveLibrary={removeLiftingLibraryEntry} notify={notify} />}
      </main>

      {toast && <div style={S.toast} className="no-print-area"><Check size={14} /> {toast}</div>}

      <div className="print-ticket"><div ref={printRef} /></div>
    </div>
  );
}

/* ============================== KELOLA ANGGOTA & ALAT ============================== */
function AnggotaManager({ riggers, profiles, onAdd, onRemove, onUpdateProfile, gear, onAddGear, onRemoveGear, onToggleGear, onUpdateGear, liftingTemplates, onRemoveTemplate, liftingLibrary, onRemoveLibrary, notify }) {
  const [name, setName] = useState("");
  const [kategori, setKategori] = useState("TKJP");
  const [posisi, setPosisi] = useState("Rigger");
  const [gNama, setGNama] = useState("");
  const [gKap, setGKap] = useState("");
  const [gKategori, setGKategori] = useState("Lifting Equipment");

  const submitRigger = () => {
    if (!name.trim()) return;
    onAdd(name, kategori, posisi);
    setName("");
  };

  const submitGear = () => {
    if (!gNama.trim()) return;
    onAddGear({ nama: gNama.trim(), kapasitas: gKap.trim(), kondisi: "Baik", kategori: gKategori });
    setGNama(""); setGKap("");
  };

  const uploadFor = async (name, field, file) => {
    if (!file) return;
    try {
      const url = await uploadImage(file, `${field}-${name.replace(/\s+/g, "_")}`);
      onUpdateProfile(name, { [field]: url });
      notify(field === "foto" ? "Foto personil tersimpan" : field === "sio" ? "Foto SIO tersimpan" : "Foto Badge tersimpan");
    } catch {
      notify("Gagal mengunggah gambar");
    }
  };

  return (
    <div style={S.pageWrap}>
      <PageHeader eyebrow="PENGAWAS" title="Kelola Anggota & Alat" desc="Tambah anggota, unggah foto & SIO, dan kelola daftar lifting gear." />

      {/* Anggota */}
      <div style={S.sectionLabel}>ANGGOTA TIM</div>
      <div style={{ display: "flex", gap: 8, marginBottom: 10, maxWidth: 380 }}>
        <input
          style={S.input}
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); submitRigger(); } }}
          placeholder="Nama anggota baru"
        />
        <button type="button" onClick={submitRigger} style={{ ...S.submitBtn, width: "auto", padding: "9px 16px", marginTop: 0 }}>
          <Plus size={15} />
        </button>
      </div>
      <div style={{ marginBottom: 10 }}>
        <div style={{ ...S.fieldLabel, marginBottom: 5 }}>Posisi</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {POSISI_LIST.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPosisi(p)}
              style={{ ...S.urgChip, borderColor: posisi === p ? "#F2A31B" : "#38434A", color: posisi === p ? "#F2A31B" : "#8B98A0", background: posisi === p ? "#F2A31B1A" : "transparent" }}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
      <div style={{ marginBottom: 16 }}>
        <div style={{ ...S.fieldLabel, marginBottom: 5 }}>Kategori</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {KATEGORI_LIST.map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setKategori(k)}
              style={{ ...S.urgChip, borderColor: kategori === k ? "#F2A31B" : "#38434A", color: kategori === k ? "#F2A31B" : "#8B98A0", background: kategori === k ? "#F2A31B1A" : "transparent" }}
            >
              {k}
            </button>
          ))}
        </div>
      </div>

      {riggers.length === 0 && <EmptyState text="Belum ada anggota terdaftar." />}

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 30 }}>
        {riggers.map((r) => {
          const p = profiles[r] || {};
          return (
            <div key={r} style={S.memberRowFull}>
              <PhotoUpload label="Foto" src={p.foto} onFile={(f) => uploadFor(r, "foto", f)} round />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap" }}>
                  <span style={{ fontFamily: FONT_DISPLAY, fontSize: 14.5, color: "#EDEBE4" }}>{r}</span>
                  <button
                    onClick={() => { const idx = POSISI_LIST.indexOf(p.posisi || "Rigger"); onUpdateProfile(r, { posisi: POSISI_LIST[(idx + 1) % POSISI_LIST.length] }); }}
                    style={S.posisiTag}
                    title="Klik untuk ganti posisi"
                  >
                    {p.posisi || "Rigger"}
                  </button>
                  <span style={S.kategoriTag}>{p.kategori || "TKJP"}</span>
                </div>
                <div style={{ fontSize: 11, color: "#8B98A0", marginTop: 2 }}>
                  {p.sio ? "SIO terunggah" : "SIO belum diunggah"} · {p.badge ? "Badge terunggah" : "Badge belum diunggah"}
                </div>
              </div>
              <PhotoUpload label="SIO" src={p.sio} onFile={(f) => uploadFor(r, "sio", f)} />
              <PhotoUpload label="Badge" src={p.badge} onFile={(f) => uploadFor(r, "badge", f)} />
              <button onClick={() => onRemove(r)} style={S.memberRemoveBtn}><Trash2 size={13} /></button>
            </div>
          );
        })}
      </div>

      {/* Alat */}
      <div style={S.sectionLabel}>ALAT & GEAR</div>
      <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
        {GEAR_KATEGORI_LIST.map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setGKategori(k)}
            style={{ ...S.urgChip, borderColor: gKategori === k ? "#F2A31B" : "#38434A", color: gKategori === k ? "#F2A31B" : "#8B98A0", background: gKategori === k ? "#F2A31B1A" : "transparent" }}
          >
            {k}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 20, maxWidth: 480, flexWrap: "wrap" }}>
        <input style={{ ...S.input, flex: 2, minWidth: 160 }} value={gNama} onChange={(e) => setGNama(e.target.value)} placeholder="Nama alat" />
        <input style={{ ...S.input, flex: 1, minWidth: 100 }} value={gKap} onChange={(e) => setGKap(e.target.value)} placeholder="Kapasitas" />
        <button type="button" onClick={submitGear} style={{ ...S.submitBtn, width: "auto", padding: "9px 16px", marginTop: 0 }}>
          <Plus size={15} />
        </button>
      </div>

      {gear.length === 0 && <EmptyState text="Belum ada alat terdaftar." />}

      {GEAR_KATEGORI_LIST.map((kat) => {
        const items = gear.filter((g) => (g.kategori || "Lifting Equipment") === kat);
        if (items.length === 0) return null;
        return (
          <div key={kat} style={{ marginBottom: 22 }}>
            <div style={{ ...S.fieldLabel, marginBottom: 8 }}>{kat.toUpperCase()}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 520 }}>
              {items.map((g) => (
                <GearRow key={g.id} g={g} onToggleGear={onToggleGear} onRemoveGear={onRemoveGear} onUpdateGear={onUpdateGear} />
              ))}
            </div>
          </div>
        );
      })}

      <div style={{ ...S.sectionLabel, marginTop: 26 }}>TEMPLATE LIFTING PLAN</div>
      {liftingTemplates.length === 0 ? (
        <EmptyState text="Belum ada template generic lift tersimpan." />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 480 }}>
          {liftingTemplates.map((t) => (
            <div key={t.id} style={S.memberRow}>
              <div>
                <div style={{ fontFamily: FONT_DISPLAY, fontSize: 14, color: "#EDEBE4" }}>{t.nama}</div>
                <div style={{ fontSize: 11, color: "#8B98A0" }}>Checklist tersimpan lengkap</div>
              </div>
              <button onClick={() => onRemoveTemplate(t.id)} style={S.memberRemoveBtn}><Trash2 size={13} /></button>
            </div>
          ))}
        </div>
      )}

      <div style={{ ...S.sectionLabel, marginTop: 26 }}>DATABASE BARANG</div>
      {liftingLibrary.length === 0 ? (
        <EmptyState text="Belum ada data barang tersimpan. Data otomatis terisi begitu Lifting Plan sebuah barang lengkap diisi." />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 560 }}>
          {liftingLibrary.map((e) => (
            <div key={e.key} style={S.memberRow}>
              <div>
                <div style={{ fontFamily: FONT_DISPLAY, fontSize: 14, color: "#EDEBE4" }}>
                  {e.barang} {e.kode && <span style={{ fontFamily: FONT_MONO, fontSize: 11, color: "#F2A31B" }}>· {e.kode}</span>}
                </div>
                <div style={{ fontSize: 11, color: "#8B98A0" }}>{e.lokasi} · {e.alat} · SWL {e.swl} ton · Berat {e.beratBeban} ton</div>
              </div>
              <button onClick={() => onRemoveLibrary(e.key)} style={S.memberRemoveBtn}><Trash2 size={13} /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ============================== GEAR ROW + LOAD CHART ============================== */
function GearRow({ g, onToggleGear, onRemoveGear, onUpdateGear }) {
  const [expanded, setExpanded] = useState(false);
  const [boom, setBoom] = useState("");
  const [radius, setRadius] = useState("");
  const [kap, setKap] = useState("");
  const [showBulk, setShowBulk] = useState(false);
  const [bulkText, setBulkText] = useState("");
  const chart = g.loadChart || [];

  const sortChart = (arr) => [...arr].sort((a, b) => {
    const ba = parseFloat(a.boom) || 0, bb = parseFloat(b.boom) || 0;
    if (ba !== bb) return ba - bb;
    return parseFloat(a.radius) - parseFloat(b.radius);
  });

  const addPoint = () => {
    if (!radius || !kap) return;
    const next = sortChart([...chart, { boom: boom || "", radius, kapasitas: kap }]);
    onUpdateGear(g.id, { loadChart: next });
    setRadius(""); setKap("");
  };
  const removePoint = (idx) => onUpdateGear(g.id, { loadChart: chart.filter((_, i) => i !== idx) });

  const importBulk = () => {
    const lines = bulkText.split("\n").map((l) => l.trim()).filter(Boolean);
    const points = [];
    for (const line of lines) {
      const parts = line.split(/[,;\t]+|\s+/).map((s) => s.trim()).filter(Boolean);
      if (parts.length >= 3) {
        const boomVal = parts[0].replace(",", ".");
        const rad = parseFloat(parts[1].replace(",", "."));
        const kapVal = parseFloat(parts[2].replace(",", "."));
        if (!isNaN(rad) && !isNaN(kapVal)) points.push({ boom: boomVal, radius: String(rad), kapasitas: String(kapVal) });
      } else if (parts.length === 2) {
        const rad = parseFloat(parts[0].replace(",", "."));
        const kapVal = parseFloat(parts[1].replace(",", "."));
        if (!isNaN(rad) && !isNaN(kapVal)) points.push({ boom: "", radius: String(rad), kapasitas: String(kapVal) });
      }
    }
    if (points.length === 0) return;
    const merged = sortChart([...chart, ...points]);
    onUpdateGear(g.id, { loadChart: merged });
    setBulkText("");
    setShowBulk(false);
  };

  return (
    <div style={S.gearRowWrap}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 14, color: "#EDEBE4" }}>{g.nama}</div>
          <div style={{ fontSize: 11, color: "#8B98A0" }}>{g.kapasitas || "-"}{chart.length > 0 ? ` · Load chart: ${chart.length} titik` : ""}</div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button onClick={() => setExpanded((e) => !e)} style={S.lpViewBtn}>{expanded ? "Tutup" : "Load Chart"}</button>
          <button onClick={() => onToggleGear(g.id)} style={{ ...S.gearKondisi, color: g.kondisi === "Baik" ? "#5FA980" : "#E1493F", borderColor: (g.kondisi === "Baik" ? "#5FA980" : "#E1493F") + "55" }}>
            {g.kondisi}
          </button>
          <button onClick={() => onRemoveGear(g.id)} style={S.memberRemoveBtn}><Trash2 size={13} /></button>
        </div>
      </div>

      {expanded && (
        <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #2A333A" }}>
          <div style={{ ...S.fieldLabel, marginBottom: 6 }}>Load chart (boom + radius vs kapasitas) — untuk crane</div>
          {chart.length === 0 && <div style={{ fontSize: 11.5, color: "#5C666C", marginBottom: 8 }}>Belum ada titik chart. Kalau alat ini bukan crane, boleh dibiarkan kosong (pakai kapasitas tetap). Kolom "Boom" boleh dikosongkan kalau alatnya tidak punya variasi panjang boom.</div>}
          {chart.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 10 }}>
              {chart.map((p, i) => (
                <div key={i} style={S.lpChartRow}>
                  <span style={{ fontFamily: FONT_MONO, fontSize: 12, color: "#C9D1D6" }}>
                    {p.boom ? `Boom ${p.boom} m · ` : ""}Radius {p.radius} m → {p.kapasitas} ton
                  </span>
                  <button onClick={() => removePoint(i)} style={S.memberRemoveBtn}><X size={11} /></button>
                </div>
              ))}
            </div>
          )}
          <div style={{ display: "flex", gap: 8, alignItems: "flex-end", flexWrap: "wrap", marginBottom: 10 }}>
            <div>
              <div style={S.fieldLabel}>Boom (m, opsional)</div>
              <input value={boom} onChange={(e) => setBoom(e.target.value)} style={{ ...S.inputSm, width: 90 }} placeholder="cth. 23.8" />
            </div>
            <div>
              <div style={S.fieldLabel}>Radius (m)</div>
              <input value={radius} onChange={(e) => setRadius(e.target.value)} style={{ ...S.inputSm, width: 90 }} placeholder="cth. 5" />
            </div>
            <div>
              <div style={S.fieldLabel}>Kapasitas (ton)</div>
              <input value={kap} onChange={(e) => setKap(e.target.value)} style={{ ...S.inputSm, width: 90 }} placeholder="cth. 5.5" />
            </div>
            <button onClick={addPoint} style={{ ...S.submitBtn, width: "auto", padding: "9px 14px", marginTop: 0 }}><Plus size={14} /></button>
          </div>

          <button onClick={() => setShowBulk((s) => !s)} style={S.lpViewBtn}>{showBulk ? "Tutup import massal" : "Import banyak sekaligus"}</button>
          {showBulk && (
            <div style={{ marginTop: 10 }}>
              <div style={{ fontSize: 11, color: "#5C666C", marginBottom: 6 }}>
                Tempel daftar, satu baris per titik, dipisah koma/spasi/tab. Kalau crane punya variasi boom, isi 3 kolom: <span style={{ fontFamily: FONT_MONO }}>boom, radius, kapasitas</span> (contoh: <span style={{ fontFamily: FONT_MONO }}>23.8, 5, 23</span>). Kalau tidak ada variasi boom, cukup 2 kolom: <span style={{ fontFamily: FONT_MONO }}>radius, kapasitas</span>.
              </div>
              <textarea
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
                style={{ ...S.input, minHeight: 100, resize: "vertical", fontFamily: FONT_MONO, fontSize: 12.5 }}
                placeholder={"23.8, 5, 23\n23.8, 6, 22\n30.7, 5, 12.5"}
              />
              <button onClick={importBulk} style={{ ...S.submitBtn, width: "auto", padding: "9px 16px", marginTop: 8 }}>Import ke Load Chart</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function PhotoUpload({ label, src, onFile, round }) {
  const inputRef = React.useRef(null);
  return (
    <div style={{ textAlign: "center" }}>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        style={{ ...S.photoBox, borderRadius: round ? 99 : 8, backgroundImage: src ? `url(${src})` : "none" }}
      >
        {!src && <Camera size={14} color="#5C666C" />}
      </button>
      <div style={{ fontSize: 9.5, color: "#5C666C", marginTop: 3, fontFamily: FONT_MONO }}>{label}</div>
      <input ref={inputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => { onFile(e.target.files?.[0]); e.target.value = ""; }} />
    </div>
  );
}

/* ============================== TIM & ALAT (publik, semua bisa lihat) ============================== */
function TeamAndGear({ riggers, profiles, gear }) {
  const [zoom, setZoom] = useState(null);
  return (
    <div style={S.pageWrap}>
      <PageHeader eyebrow="SEMUA PIHAK" title="Tim & Alat" desc="Profil anggota rigger beserta SIO, dan daftar lifting gear yang tersedia." />

      <div style={S.sectionLabel}>ANGGOTA TIM</div>
      {riggers.length === 0 && <EmptyState text="Belum ada anggota terdaftar." />}
      <div style={S.teamGrid}>
        {riggers.map((r) => {
          const p = profiles[r] || {};
          return (
            <div key={r} style={S.teamCard}>
              <div style={{ ...S.teamPhoto, backgroundImage: p.foto ? `url(${p.foto})` : "none" }}>
                {!p.foto && <User size={22} color="#5C666C" />}
              </div>
              <div style={{ fontFamily: FONT_DISPLAY, fontSize: 13.5, color: "#EDEBE4", marginTop: 8, textAlign: "center" }}>{r}</div>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap", justifyContent: "center", marginTop: 4 }}>
                <span style={S.posisiTag}>{p.posisi || "Rigger"}</span>
                <span style={S.kategoriTag}>{p.kategori || "TKJP"}</span>
              </div>
              {p.sio ? (
                <button style={S.sioBtn} onClick={() => setZoom(p.sio)}>Lihat SIO</button>
              ) : (
                <div style={{ fontSize: 10, color: "#5C666C", marginTop: 6 }}>SIO belum ada</div>
              )}
              {p.badge ? (
                <button style={{ ...S.sioBtn, marginTop: 6 }} onClick={() => setZoom(p.badge)}>Lihat Badge</button>
              ) : (
                <div style={{ fontSize: 10, color: "#5C666C", marginTop: 6 }}>Badge belum ada</div>
              )}
            </div>
          );
        })}
      </div>

      {GEAR_KATEGORI_LIST.map((kat) => {
        const items = gear.filter((g) => (g.kategori || "Lifting Equipment") === kat);
        if (items.length === 0) return null;
        return (
          <div key={kat} style={{ marginTop: 26 }}>
            <div style={S.sectionLabel}>{kat.toUpperCase()}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 480 }}>
              {items.map((g) => (
                <div key={g.id} style={S.memberRow}>
                  <div>
                    <div style={{ fontFamily: FONT_DISPLAY, fontSize: 14, color: "#EDEBE4" }}>{g.nama}</div>
                    <div style={{ fontSize: 11, color: "#8B98A0" }}>{g.kapasitas || "-"}</div>
                  </div>
                  <span style={{ ...S.gearKondisi, color: g.kondisi === "Baik" ? "#5FA980" : "#E1493F", borderColor: (g.kondisi === "Baik" ? "#5FA980" : "#E1493F") + "55" }}>
                    {g.kondisi}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
      {gear.length === 0 && <EmptyState text="Belum ada alat terdaftar." />}

      {zoom && (
        <div style={S.zoomOverlay} onClick={() => setZoom(null)}>
          <img src={zoom} alt="SIO" style={S.zoomImg} />
        </div>
      )}
    </div>
  );
}

/* ============================== PRINT TICKET ============================== */
function esc(s) {
  return String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function ticketRowHTML(label, value) {
  return `
    <tr style="border-bottom:1px solid #EAEAEA">
      <td style="padding:6px 0;width:130px;color:#777;vertical-align:top;font-family:'JetBrains Mono',monospace;font-size:10.5px;letter-spacing:0.3px;text-transform:uppercase">${esc(label)}</td>
      <td style="padding:6px 0;font-weight:600">${esc(value)}</td>
    </tr>`;
}

function buildTicketHTML(r) {
  const urg = URGENSI.find((u) => u.key === r.urgensi);
  const urgColor = r.urgensi === "ss" ? "#B7261A" : r.urgensi === "darurat" ? "#B4740E" : "#333";
  const stripe = "height:7px;background:repeating-linear-gradient(135deg,#F2A31B 0px,#F2A31B 9px,#161616 9px,#161616 18px)";

  const rows = [
    ticketRowHTML("Area", areaLabel(r.area)),
    ticketRowHTML("Pemohon", `${r.pemohon} (${r.nopek || "-"})`),
    ticketRowHTML("Kontak", `${r.telp}${r.radio ? " / Radio " + r.radio : ""}`),
    ticketRowHTML("Lokasi", r.lokasi),
    ticketRowHTML("Tanggal", `${fmtDate(r.tanggal)}${r.jam ? "  " + r.jam : ""}`),
    ticketRowHTML("Barang", r.barang),
    (r.berat || r.dimensi) ? ticketRowHTML("Berat / Dimensi", [r.berat, r.dimensi].filter(Boolean).join(" · ")) : "",
    ticketRowHTML("Petugas", r.riggers.length ? r.riggers.join(", ") : "-"),
    ticketRowHTML("Jam kerja", `${r.jamMulai || "--:--"} – ${r.jamSelesai || "--:--"}`),
    r.keterangan ? ticketRowHTML("Keterangan", r.keterangan) : "",
  ].join("");

  const urgBadge = r.urgensi !== "normal" ? `
    <div style="display:inline-flex;align-items:center;gap:6px;border:2px solid ${urgColor};color:${urgColor};padding:4px 12px;font-family:'Oswald',sans-serif;font-size:13px;letter-spacing:1.2px;margin-bottom:14px;transform:rotate(-2deg);text-transform:uppercase">
      ⚠ ${esc(urg.label)}
    </div>` : "";

  return `
    <div style="position:relative;font-family:'Inter',sans-serif;color:#161616;max-width:480px;margin:0 auto;border:1.5px solid #161616;border-radius:10px;overflow:hidden">
      <div style="${stripe}"></div>
      <div style="position:absolute;top:-9px;left:50%;transform:translateX(-50%);width:18px;height:18px;border-radius:99px;background:#fff;border:1.5px solid #161616"></div>
      <div style="padding:22px 26px 20px">
        <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid #161616;padding-bottom:10px;margin-bottom:16px">
          <img src="${COMPANY_LOGO}" alt="Logo perusahaan" style="height:32px" />
          <div style="text-align:right">
            <div style="font-family:'Oswald',sans-serif;font-size:17px;letter-spacing:1px;text-transform:uppercase">Tiket Lifting</div>
            <div style="font-family:'JetBrains Mono',monospace;font-size:10px;color:#777;letter-spacing:0.5px">RIG ORDER · ${esc(r.id.toUpperCase())}</div>
          </div>
        </div>
        ${urgBadge}
        <table style="width:100%;border-collapse:collapse;font-size:13px"><tbody>${rows}</tbody></table>
        <div style="margin-top:22px;padding-top:14px;border-top:1px dashed #999;display:flex;justify-content:space-between;font-size:11px;color:#444;font-family:'JetBrains Mono',monospace">
          <div>Dicetak: ${esc(new Date().toLocaleString("id-ID"))}</div>
          <div>Paraf petugas: _______________</div>
        </div>
      </div>
      <div style="${stripe}"></div>
    </div>`;
}

function buildTicketPage(r) {
  return `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8" />
<title>Tiket Lifting — ${esc(r.barang)}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@500;600&family=Inter:wght@400;600&family=JetBrains+Mono:wght@400;500&display=swap');
  @page { size: A5; margin: 8mm; }
  body { margin: 24px; background: #F2F2F0; }
  .print-btn { display: block; max-width: 480px; margin: 0 auto 14px; background: #F2A31B; color: #161616; border: none; border-radius: 8px; padding: 10px; font-family: 'Inter', sans-serif; font-weight: 600; font-size: 14px; cursor: pointer; }
  @media print { .print-btn { display: none; } body { background: #fff; margin: 0; } }
</style>
</head>
<body>
  <button class="print-btn" onclick="window.print()">Cetak / Simpan sebagai PDF</button>
  ${buildTicketHTML(r)}
</body>
</html>`;
}

/* ============================== BERANDA (MA — semua area) ============================== */
function BerandaMA({ requests, area }) {
  const rank = { ss: 0, darurat: 1, normal: 2 };
  const antrian = [...requests]
    .filter((r) => r.status === "Pending")
    .sort((a, b) => rank[a.urgensi] - rank[b.urgensi] || new Date(a.createdAt) - new Date(b.createdAt));
  const diproses = [...requests]
    .filter((r) => r.status === "Diproses")
    .sort((a, b) => rank[a.urgensi] - rank[b.urgensi]);
  const selesai = [...requests]
    .filter((r) => r.status === "Selesai")
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 8);

  return (
    <div style={S.pageWrap}>
      <PageHeader eyebrow={areaLabel(area)} title="Beranda — Antrian Permintaan" desc="Semua permintaan lifting dari seluruh area ME, urut berdasarkan prioritas." />

      <div style={S.groupHeader}><StatusDot status="Pending" /> DALAM ANTRIAN <span style={S.groupCount}>{antrian.length}</span></div>
      {antrian.length === 0 ? <EmptyState text="Tidak ada permintaan yang mengantre saat ini." /> : (
        <div style={{ ...S.cardList, marginBottom: 22 }}>
          {antrian.map((r, i) => <QueueCard key={r.id} r={r} queueNo={i + 1} mine={r.area === area} />)}
        </div>
      )}

      <div style={S.groupHeader}><StatusDot status="Diproses" /> SEDANG DIKERJAKAN <span style={S.groupCount}>{diproses.length}</span></div>
      {diproses.length === 0 ? <EmptyState text="Tidak ada pekerjaan yang sedang berjalan." /> : (
        <div style={{ ...S.cardList, marginBottom: 22 }}>
          {diproses.map((r) => <QueueCard key={r.id} r={r} mine={r.area === area} />)}
        </div>
      )}

      <div style={S.groupHeader}><StatusDot status="Selesai" /> SELESAI TERBARU</div>
      {selesai.length === 0 ? <EmptyState text="Belum ada yang selesai." /> : (
        <div style={S.cardList}>
          {selesai.map((r) => <QueueCard key={r.id} r={r} mine={r.area === area} />)}
        </div>
      )}
    </div>
  );
}

/* ============================== LIFTING PLAN — TAMPILAN PUBLIK ============================== */
function LiftingPlanBadge({ plan }) {
  const hasAny = plan && (plan.alat || plan.swl || plan.beratBeban);
  if (!hasAny) return <span style={{ ...S.lpBadge, color: "#5C666C", borderColor: "#38434A" }}>Belum ada Lifting Plan</span>;
  if (plan.completed) return <span style={{ ...S.lpBadge, color: "#5FA980", borderColor: "#5FA98066" }}><Check size={10} style={{ marginRight: 3, position: "relative", top: 1 }} />Lifting Plan Lengkap</span>;
  return <span style={{ ...S.lpBadge, color: "#F2A31B", borderColor: "#F2A31B66" }}><AlertTriangle size={10} style={{ marginRight: 3, position: "relative", top: 1 }} />Lifting Plan Belum Lengkap</span>;
}

function LiftingPlanDetail({ plan }) {
  const pct = plan.swl && plan.beratBeban ? Math.round((parseFloat(plan.beratBeban) / parseFloat(plan.swl)) * 100) : null;
  const jenisLift = pct !== null ? (pct >= CRITICAL_LIFT_THRESHOLD ? "Critical Lift" : "Generic Lift") : null;
  return (
    <div style={S.lpDetailBox}>
      <div style={S.miniMeta}>
        {plan.kodeBarang && `Kode: ${plan.kodeBarang} · `}{plan.alat && `Alat: ${plan.alat}`}{plan.boom && ` · Boom: ${plan.boom} m`}{plan.radius && ` · Radius: ${plan.radius} m`}{plan.swl && ` · SWL: ${plan.swl} ton`}{plan.beratBeban && ` · Beban: ${plan.beratBeban} ton`}
        {pct !== null && ` · ${pct}% (${jenisLift})`}
      </div>
      <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
        {CHECKLIST_ITEMS.map((c) => (
          <div key={c.id} style={{ display: "flex", gap: 7, fontSize: 11.5, color: plan.checklist && plan.checklist[c.id] ? "#C9D1D6" : "#5C666C" }}>
            {plan.checklist && plan.checklist[c.id] ? <Check size={12} color="#5FA980" style={{ flexShrink: 0, marginTop: 1 }} /> : <X size={12} color="#5C666C" style={{ flexShrink: 0, marginTop: 1 }} />}
            <span>{c.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function JSABadge({ jsa }) {
  const hasAny = jsa && jsa.hazards && jsa.hazards.length > 0;
  if (!hasAny) return <span style={{ ...S.lpBadge, color: "#5C666C", borderColor: "#38434A" }}>Belum ada JSA</span>;
  if (jsa.completed) return <span style={{ ...S.lpBadge, color: "#5FA980", borderColor: "#5FA98066" }}><Check size={10} style={{ marginRight: 3, position: "relative", top: 1 }} />JSA Lengkap</span>;
  return <span style={{ ...S.lpBadge, color: "#F2A31B", borderColor: "#F2A31B66" }}><AlertTriangle size={10} style={{ marginRight: 3, position: "relative", top: 1 }} />JSA Belum Lengkap</span>;
}

function JSADetail({ jsa }) {
  return (
    <div style={S.lpDetailBox}>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {jsa.hazards.map((h, i) => (
          <div key={i} style={{ fontSize: 11.5, color: "#C9D1D6" }}>
            <span style={{ color: "#F2A31B" }}>Bahaya:</span> {h.hazard} <span style={{ color: "#5FA980" }}>· Mitigasi:</span> {h.mitigation}
          </div>
        ))}
      </div>
      <div style={{ marginTop: 10, paddingTop: 8, borderTop: "1px solid #2A333A", fontSize: 11, color: "#8B98A0" }}>
        {jsa.pengawasNama && `Disetujui Pengawas: ${jsa.pengawasNama}${jsa.pengawasAt ? ` (${new Date(jsa.pengawasAt).toLocaleString("id-ID")})` : ""}`}
        {jsa.safetyNama && <><br />Disetujui Safety Officer: {jsa.safetyNama}{jsa.safetyAt ? ` (${new Date(jsa.safetyAt).toLocaleString("id-ID")})` : ""}</>}
      </div>
    </div>
  );
}

function QueueCard({ r, queueNo, mine }) {
  const urg = URGENSI.find((u) => u.key === r.urgensi);
  const [showPlan, setShowPlan] = useState(false);
  const [showJSA, setShowJSA] = useState(false);
  const plan = r.liftingPlan;
  const jsa = r.jsa;
  return (
    <div style={{ ...S.miniCard, borderColor: mine ? "#F2A31B55" : "#2A333A" }}>
      {r.urgensi === "ss" && <div style={S.ssRibbon}>SS</div>}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ display: "flex", gap: 10, minWidth: 0 }}>
          {queueNo && <div style={S.queueNo}>{queueNo}</div>}
          <div style={{ minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap" }}>
              <span style={{ fontFamily: FONT_DISPLAY, fontSize: 15, color: "#EDEBE4" }}>{r.barang}</span>
              <span style={S.areaTag}>{areaLabel(r.area)}{mine ? " · area Anda" : ""}</span>
            </div>
            <div style={S.miniMeta}>{r.lokasi} · {fmtDate(r.tanggal)}{r.jam ? ` · ${r.jam}` : ""}</div>
            {r.riggers.length > 0 && <div style={S.miniMeta}>Petugas: {r.riggers.join(", ")}</div>}
          </div>
        </div>
        <span style={{ ...S.urgTag, color: urg.color, borderColor: urg.color + "55", flexShrink: 0 }}>{urg.label}</span>
      </div>
      <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <LiftingPlanBadge plan={plan} />
        {plan && (plan.alat || plan.swl) && (
          <button onClick={() => setShowPlan((s) => !s)} style={S.lpViewBtn}>{showPlan ? "Tutup" : "Lihat detail"}</button>
        )}
        <JSABadge jsa={jsa} />
        {jsa && jsa.hazards && jsa.hazards.length > 0 && (
          <button onClick={() => setShowJSA((s) => !s)} style={S.lpViewBtn}>{showJSA ? "Tutup JSA" : "Lihat JSA"}</button>
        )}
      </div>
      {showPlan && plan && <LiftingPlanDetail plan={plan} />}
      {showJSA && jsa && <JSADetail jsa={jsa} />}
    </div>
  );
}

/* ============================== PASSWORD GATE ============================== */
function PasswordGate({ onSuccess }) {
  const [val, setVal] = useState("");
  const [error, setError] = useState(false);

  const submit = () => {
    if (val.trim() === PENGAWAS_PASSWORD) {
      onSuccess();
    } else {
      setError(true);
      setVal("");
    }
  };

  return (
    <div style={S.gateWrap}>
      <div style={S.gateCard}>
        <div style={S.gateIcon}><Lock size={18} color="#14181B" /></div>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 18, color: "#EDEBE4", marginTop: 12 }}>Akses Pengawas</div>
        <div style={{ fontSize: 12.5, color: "#8B98A0", marginTop: 4, marginBottom: 18 }}>
          Masukkan password untuk membuka dashboard, assign rigger, dan laporan.
        </div>
        <div>
          <input
            type="password"
            autoFocus
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck="false"
            value={val}
            onChange={(e) => { setVal(e.target.value); setError(false); }}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); submit(); } }}
            placeholder="Password"
            style={{ ...S.input, borderColor: error ? "#E1493F" : "#2E383F", textAlign: "center", letterSpacing: 2 }}
          />
          {error && <div style={{ color: "#E1493F", fontSize: 11.5, marginTop: 8 }}>Password salah, coba lagi.</div>}
          <button type="button" onClick={submit} style={{ ...S.submitBtn, marginTop: 16 }}>Masuk</button>
        </div>
      </div>
    </div>
  );
}

/* ============================== ROLE SWITCHER ============================== */
function RoleSwitcher({ role, setRole }) {
  const [open, setOpen] = useState(false);
  const label = role === "pengawas" ? "Pengawas Rigger" : areaFullLabel(role);
  return (
    <div style={{ position: "relative" }}>
      <div style={S.roleLabel}>MASUK SEBAGAI</div>
      <button style={S.roleBtn} onClick={() => setOpen((o) => !o)}>
        <span>{label}</span>
        <ChevronDown size={14} />
      </button>
      {open && (
        <div style={S.roleMenu}>
          <div style={S.roleMenuHeader}>Pengawas</div>
          <button style={S.roleOpt} onClick={() => { setRole("pengawas"); setOpen(false); }}>Pengawas Rigger</button>
          <div style={S.roleMenuHeader}>Bagian</div>
          {AREAS.map((a) => (
            <button key={a} style={S.roleOpt} onClick={() => { setRole(a); setOpen(false); }}>{areaFullLabel(a)}</button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ============================== REQUEST FORM (MA) ============================== */
function RequestForm({ area, onSubmit }) {
  const [f, setF] = useState({
    area, pemohon: "", nopek: "", telp: "", radio: "", lokasi: "", tanggal: todayISO(),
    barang: "", urgensi: "normal", berat: "", dimensi: "", keterangan: "",
  });
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));
  const valid = f.pemohon && f.nopek && f.lokasi && f.tanggal && f.barang && f.keterangan;

  const submit = () => {
    if (!valid) return;
    onSubmit(f);
    setF({ area, pemohon: "", nopek: "", telp: "", radio: "", lokasi: "", tanggal: todayISO(), barang: "", urgensi: "normal", berat: "", dimensi: "", keterangan: "" });
  };

  return (
    <div style={S.pageWrap}>
      <PageHeader eyebrow={areaLabel(area)} title="Buat Permintaan Lifting" desc="Isi data di bawah — permintaan langsung masuk ke desk Workshop." />

      <div style={S.ticketCard}>
        <div style={S.ticketHole} />
        <div style={{ ...S.ticketRivet, top: 10, left: 10 }} />
        <div style={{ ...S.ticketRivet, top: 10, right: 10 }} />
        <div style={{ ...S.ticketRivet, bottom: 10, left: 10 }} />
        <div style={{ ...S.ticketRivet, bottom: 10, right: 10 }} />
        <div style={S.ticketHead}>
          <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: "#8B98A0", letterSpacing: 1 }}>PERMINTAAN / ORDER</div>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 20, color: "#EDEBE4", letterSpacing: 0.5 }}>{areaLabel(area)}</div>
        </div>

        <div style={S.grid2}>
          <Field label="Nama" required icon={User}>
            <input style={S.input} value={f.pemohon} onChange={set("pemohon")} placeholder="Nama lengkap" />
          </Field>
          <Field label="No. Pegawai (NoPek)" required icon={ClipboardList}>
            <input style={S.input} value={f.nopek} onChange={set("nopek")} placeholder="cth. 754688" />
          </Field>
        </div>

        <Field label="No. Telp (opsional)" icon={PhoneCall}>
          <input style={S.input} value={f.telp} onChange={set("telp")} placeholder="cth. 5807" />
        </Field>

        <Field label="No. Radio (opsional)" icon={Radio}>
          <input style={S.input} value={f.radio} onChange={set("radio")} placeholder="cth. Channel 3" />
        </Field>

        <Field label="Lokasi / titik lifting" required icon={MapPin}>
          <input style={S.input} value={f.lokasi} onChange={set("lokasi")} placeholder="cth. CWI, Conveyor 12" />
        </Field>

        <Field label="Tanggal diperlukan" required icon={CalendarClock}>
          <input type="date" style={S.input} value={f.tanggal} onChange={set("tanggal")} />
        </Field>

        <Field label="Barang yang diangkat" required icon={Package}>
          <input style={S.input} value={f.barang} onChange={set("barang")} placeholder="cth. Motor gearbox" />
        </Field>

        <div style={S.grid2}>
          <Field label="Berat (opsional)" icon={Weight}>
            <input style={S.input} value={f.berat} onChange={set("berat")} placeholder="cth. 1 ton" />
          </Field>
          <Field label="Dimensi (opsional)" icon={Ruler}>
            <input style={S.input} value={f.dimensi} onChange={set("dimensi")} placeholder="cth. 2 x 1 x 1 m" />
          </Field>
        </div>

        <Field label="Term of Service / Penjelasan Order" required icon={ClipboardList}>
          <textarea style={{ ...S.input, minHeight: 70, resize: "vertical", fontFamily: FONT_BODY }} value={f.keterangan} onChange={set("keterangan")} placeholder="Penjelasan tambahan mengenai pekerjaan ini" />
        </Field>

        <Field label="Tingkat urgensi" required>
          <div style={{ display: "flex", gap: 8 }}>
            {URGENSI.map((u) => (
              <button
                type="button"
                key={u.key}
                onClick={() => setF((s) => ({ ...s, urgensi: u.key }))}
                style={{
                  ...S.urgChip,
                  borderColor: f.urgensi === u.key ? u.color : "#38434A",
                  color: f.urgensi === u.key ? u.color : "#8B98A0",
                  background: f.urgensi === u.key ? u.color + "1A" : "transparent",
                }}
              >
                {u.key === "ss" && <Siren size={13} />}
                {u.label}
              </button>
            ))}
          </div>
          {f.urgensi === "ss" && (
            <div style={S.ssNote}><AlertTriangle size={13} /> Panggilan SS akan diprioritaskan di desk Workshop.</div>
          )}
        </Field>

        <button type="button" onClick={submit} disabled={!valid} style={{ ...S.submitBtn, opacity: valid ? 1 : 0.45 }}>
          Kirim Permintaan
        </button>
      </div>
    </div>
  );
}

function Field({ label, required, icon: Icon, children }) {
  return (
    <label style={S.field}>
      <span style={S.fieldLabel}>
        {Icon && <Icon size={12} style={{ marginRight: 5, position: "relative", top: 2 }} />}
        {label}{required && <span style={{ color: "#F2A31B" }}> *</span>}
      </span>
      {children}
    </label>
  );
}

/* ============================== STATUS LIST (MA read-only) ============================== */
function StatusList({ area, requests }) {
  const grouped = STATUS_FLOW.map((s) => ({ status: s, items: requests.filter((r) => r.status === s) }));
  return (
    <div style={S.pageWrap}>
      <PageHeader eyebrow={areaLabel(area)} title="Status Permintaan" desc="Pantau progres permintaan yang sudah Anda kirim." />
      {requests.length === 0 && <EmptyState text="Belum ada permintaan dari area ini." />}
      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        {grouped.map((g) => g.items.length > 0 && (
          <div key={g.status}>
            <div style={S.groupHeader}><StatusDot status={g.status} /> {g.status.toUpperCase()} <span style={S.groupCount}>{g.items.length}</span></div>
            <div style={S.cardList}>
              {g.items.map((r) => <RequestMiniCard key={r.id} r={r} />)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RequestMiniCard({ r }) {
  const urg = URGENSI.find((u) => u.key === r.urgensi);
  const [showPlan, setShowPlan] = useState(false);
  const [showJSA, setShowJSA] = useState(false);
  const plan = r.liftingPlan;
  const jsa = r.jsa;
  return (
    <div style={S.miniCard}>
      {r.urgensi === "ss" && <div style={S.ssRibbon}>SS</div>}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 15, color: "#EDEBE4" }}>{r.barang}</div>
          <div style={S.miniMeta}>{r.lokasi} · {fmtDate(r.tanggal)}{r.jam ? ` · ${r.jam}` : ""}</div>
        </div>
        <span style={{ ...S.urgTag, color: urg.color, borderColor: urg.color + "55" }}>{urg.label}</span>
      </div>
      {r.riggers.length > 0 && (
        <div style={S.miniMeta}>Petugas: {r.riggers.join(", ")}</div>
      )}
      <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <LiftingPlanBadge plan={plan} />
        {plan && (plan.alat || plan.swl) && (
          <button onClick={() => setShowPlan((s) => !s)} style={S.lpViewBtn}>{showPlan ? "Tutup" : "Lihat detail"}</button>
        )}
        <JSABadge jsa={jsa} />
        {jsa && jsa.hazards && jsa.hazards.length > 0 && (
          <button onClick={() => setShowJSA((s) => !s)} style={S.lpViewBtn}>{showJSA ? "Tutup JSA" : "Lihat JSA"}</button>
        )}
      </div>
      {showPlan && plan && <LiftingPlanDetail plan={plan} />}
      {showJSA && jsa && <JSADetail jsa={jsa} />}
    </div>
  );
}

function StatusDot({ status }) {
  const color = status === "Selesai" ? "#5FA980" : status === "Diproses" ? "#F2A31B" : "#8B98A0";
  return <span style={{ width: 7, height: 7, borderRadius: 99, background: color, display: "inline-block", marginRight: 7 }} />;
}

function EmptyState({ text }) {
  return <div style={S.empty}>{text}</div>;
}

/* ============================== DASHBOARD (Pengawas) ============================== */
function Dashboard({ requests, riggers, gear, liftingTemplates, liftingLibrary, onSaveTemplate, onUpdate, onDelete, notify, onPrint }) {
  const [filter, setFilter] = useState("Semua");
  const sorted = useMemo(() => {
    const rank = { ss: 0, darurat: 1, normal: 2 };
    const statusRank = { Pending: 0, Diproses: 1, Selesai: 2 };
    return [...requests]
      .filter((r) => filter === "Semua" || r.status === filter)
      .sort((a, b) => statusRank[a.status] - statusRank[b.status] || rank[a.urgensi] - rank[b.urgensi]);
  }, [requests, filter]);

  return (
    <div style={S.pageWrap}>
      <PageHeader eyebrow="PENGAWAS" title="Dashboard Permintaan" desc="Semua permintaan lifting dari seluruh area ME. Panggilan SS didahulukan." />

      <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" }}>
        {["Semua", ...STATUS_FLOW].map((s) => (
          <button key={s} onClick={() => setFilter(s)} style={{ ...S.filterChip, ...(filter === s ? S.filterChipActive : {}) }}>
            {s}
          </button>
        ))}
      </div>

      {sorted.length === 0 && <EmptyState text="Tidak ada permintaan pada filter ini." />}

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {sorted.map((r) => (
          <RequestRow key={r.id} r={r} riggers={riggers} gear={gear} liftingTemplates={liftingTemplates} liftingLibrary={liftingLibrary}
            onSaveTemplate={onSaveTemplate} onUpdate={onUpdate} onDelete={onDelete} notify={notify} onPrint={onPrint} />
        ))}
      </div>
    </div>
  );
}

function RequestRow({ r, riggers, gear, liftingTemplates, liftingLibrary, onSaveTemplate, onUpdate, onDelete, notify, onPrint }) {
  const [expanded, setExpanded] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showLP, setShowLP] = useState(false);
  const [showJSA, setShowJSA] = useState(false);
  const urg = URGENSI.find((u) => u.key === r.urgensi);
  const lp = r.liftingPlan;
  const pct = lp && lp.swl && lp.beratBeban ? Math.round((parseFloat(lp.beratBeban) / parseFloat(lp.swl)) * 100) : null;
  const isCriticalLift = pct !== null && pct >= CRITICAL_LIFT_THRESHOLD;

  const toggleRigger = (name) => {
    const has = r.riggers.includes(name);
    const riggers = has ? r.riggers.filter((x) => x !== name) : [...r.riggers, name];
    onUpdate(r.id, { riggers, status: riggers.length > 0 && r.status === "Pending" ? "Diproses" : r.status });
  };

  const setStatus = (status) => {
    onUpdate(r.id, { status });
    notify(`Status diubah ke "${status}"`);
  };

  return (
    <div style={{ ...S.rowCard, borderColor: r.urgensi === "ss" ? "#E1493F55" : "#2A333A" }}>
      <div style={S.rowMain} onClick={() => setExpanded((e) => !e)}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          <StatusDot status={r.status} />
          <div style={{ minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontFamily: FONT_DISPLAY, fontSize: 15, color: "#EDEBE4" }}>{r.barang}</span>
              <span style={{ ...S.areaTag }}>{areaLabel(r.area)}</span>
              {r.urgensi !== "normal" && <span style={{ ...S.urgTag, color: urg.color, borderColor: urg.color + "55" }}>{urg.label}</span>}
            </div>
            <div style={S.miniMeta}>{r.lokasi} · {r.pemohon} ({r.nopek}) · {r.telp}{r.radio ? ` / ${r.radio}` : ""} · {fmtDate(r.tanggal)}{r.jam ? ` ${r.jam}` : ""}</div>
          </div>
        </div>
        <ChevronDown size={16} color="#5C666C" style={{ transform: expanded ? "rotate(180deg)" : "none", transition: "transform .15s", flexShrink: 0 }} />
      </div>

      {expanded && (
        <div style={S.rowExpand}>
          {(r.berat || r.dimensi) && (
            <div style={S.miniMeta}>{r.berat && `Berat: ${r.berat}`}{r.berat && r.dimensi && " · "}{r.dimensi && `Dimensi: ${r.dimensi}`}</div>
          )}
          {r.keterangan && (
            <div style={{ ...S.miniMeta, marginTop: 6, padding: "8px 10px", background: "#161B1E", borderRadius: 6, border: "1px solid #2A333A" }}>{r.keterangan}</div>
          )}

          <div style={{ marginTop: 10 }}>
            <div style={S.fieldLabel}>Assign rigger</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 6 }}>
              {riggers.map((name) => (
                <button key={name} onClick={() => toggleRigger(name)} style={{ ...S.riggerChip, ...(r.riggers.includes(name) ? S.riggerChipActive : {}) }}>
                  {r.riggers.includes(name) && <Check size={11} />} {name}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
            <div>
              <div style={S.fieldLabel}>Jam mulai</div>
              <input type="time" style={S.inputSm} value={r.jamMulai} onChange={(e) => onUpdate(r.id, { jamMulai: e.target.value })} />
            </div>
            <div>
              <div style={S.fieldLabel}>Jam selesai</div>
              <input type="time" style={S.inputSm} value={r.jamSelesai} onChange={(e) => onUpdate(r.id, { jamSelesai: e.target.value })} />
            </div>
          </div>

          <button onClick={() => setShowLP((s) => !s)} style={{ ...S.lpViewBtn, marginTop: 14 }}>
            {showLP ? "Tutup Lifting Plan" : `+ Tambah Lifting Plan (opsional)${r.liftingPlan && (r.liftingPlan.alat || r.liftingPlan.swl) ? " · sudah ada data" : ""}`}
          </button>
          {showLP && (
            <LiftingPlanEditor r={r} gear={gear} liftingTemplates={liftingTemplates} liftingLibrary={liftingLibrary} onSaveTemplate={onSaveTemplate} notify={notify}
              onChange={(patch) => onUpdate(r.id, { liftingPlan: { ...emptyLiftingPlan(), ...r.liftingPlan, ...patch } })} />
          )}

          {(isCriticalLift || (r.urgensi === "ss")) && !showJSA && (
            <div style={S.lpWarn}><AlertTriangle size={12} /> Disarankan isi JSA untuk {isCriticalLift ? "Critical Lift" : "Panggilan SS"} ini.</div>
          )}
          <button onClick={() => setShowJSA((s) => !s)} style={{ ...S.lpViewBtn, marginTop: 8 }}>
            {showJSA ? "Tutup JSA" : `+ Tambah JSA (opsional)${r.jsa && r.jsa.hazards && r.jsa.hazards.length > 0 ? " · sudah ada data" : ""}`}
          </button>
          {showJSA && (
            <JSAEditor jsa={r.jsa || emptyJSA()} onChange={(patch) => onUpdate(r.id, { jsa: { ...emptyJSA(), ...r.jsa, ...patch } })} />
          )}

          <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
            {STATUS_FLOW.map((s) => (
              <button key={s} onClick={() => setStatus(s)} style={{ ...S.statusBtn, ...(r.status === s ? S.statusBtnActive : {}) }}>
                {s}
              </button>
            ))}
            {r.status === "Diproses" ? (
              <button onClick={() => onPrint(r)} style={S.printBtn}>
                <Printer size={13} /> Cetak Tiket
              </button>
            ) : (
              <span style={S.printHint}>Cetak tersedia saat status "Diproses"</span>
            )}
            {confirmDelete ? (
              <div style={{ display: "flex", gap: 6, alignItems: "center", marginLeft: "auto" }}>
                <span style={{ fontSize: 11.5, color: "#E1493F" }}>Yakin hapus?</span>
                <button onClick={() => onDelete(r.id)} style={S.deleteConfirmBtn}>Ya, Hapus</button>
                <button onClick={() => setConfirmDelete(false)} style={S.deleteCancelBtn}>Batal</button>
              </div>
            ) : (
              <button onClick={() => setConfirmDelete(true)} style={{ ...S.deleteBtn, marginLeft: r.status === "Diproses" ? 0 : "auto" }}>
                <Trash2 size={13} /> Hapus
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================== LAPORAN HARIAN ============================== */
/* ============================== LIFTING PLAN ============================== */
/* ============================== JSA (JOB SAFETY ANALYSIS) ============================== */
function JSAEditor({ jsa, onChange }) {
  const [hazard, setHazard] = useState("");
  const [mitigation, setMitigation] = useState("");

  const setField = (patch) => {
    const next = { ...jsa, ...patch };
    onChange({ ...next, completed: isJSAComplete(next) });
  };

  const addHazard = () => {
    if (!hazard.trim() || !mitigation.trim()) return;
    setField({ hazards: [...jsa.hazards, { hazard: hazard.trim(), mitigation: mitigation.trim() }] });
    setHazard(""); setMitigation("");
  };
  const removeHazard = (idx) => setField({ hazards: jsa.hazards.filter((_, i) => i !== idx) });

  const signPengawas = (nama) => setField({ pengawasNama: nama, pengawasAt: nama ? new Date().toISOString() : "" });
  const signSafety = (nama) => setField({ safetyNama: nama, safetyAt: nama ? new Date().toISOString() : "" });

  return (
    <div style={S.lpBox}>
      <div style={S.lpHeader}>
        <span style={S.fieldLabel}>JOB SAFETY ANALYSIS (JSA)</span>
        {jsa.completed && <span style={{ ...S.lpBadge, color: "#5FA980", borderColor: "#5FA98066" }}><Check size={10} style={{ marginRight: 3, position: "relative", top: 1 }} />Lengkap</span>}
      </div>

      <div style={S.fieldLabel}>Bahaya & Mitigasi</div>
      {jsa.hazards.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 6, marginBottom: 10 }}>
          {jsa.hazards.map((h, i) => (
            <div key={i} style={S.lpChartRow}>
              <span style={{ fontSize: 12, color: "#C9D1D6" }}><b style={{ color: "#F2A31B" }}>Bahaya:</b> {h.hazard} — <b style={{ color: "#5FA980" }}>Mitigasi:</b> {h.mitigation}</span>
              <button onClick={() => removeHazard(i)} style={S.memberRemoveBtn}><X size={11} /></button>
            </div>
          ))}
        </div>
      )}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 6, marginBottom: 12 }}>
        <input value={hazard} onChange={(e) => setHazard(e.target.value)} style={{ ...S.inputSm, width: 180 }} placeholder="Bahaya (cth. beban ayun)" />
        <input value={mitigation} onChange={(e) => setMitigation(e.target.value)} style={{ ...S.inputSm, width: 180 }} placeholder="Mitigasi (cth. tagline)" />
        <button onClick={addHazard} style={{ ...S.submitBtn, width: "auto", padding: "9px 14px", marginTop: 0 }}><Plus size={14} /></button>
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <div>
          <div style={S.fieldLabel}>Nama Pengawas (approve)</div>
          <input value={jsa.pengawasNama} onChange={(e) => signPengawas(e.target.value)} style={S.inputSm} placeholder="Ketik nama" />
          {jsa.pengawasNama && <div style={{ fontSize: 10, color: "#5C666C", marginTop: 3 }}>Disetujui {new Date(jsa.pengawasAt).toLocaleString("id-ID")}</div>}
        </div>
        <div>
          <div style={S.fieldLabel}>Nama Safety Officer (approve)</div>
          <input value={jsa.safetyNama} onChange={(e) => signSafety(e.target.value)} style={S.inputSm} placeholder="Ketik nama" />
          {jsa.safetyNama && <div style={{ fontSize: 10, color: "#5C666C", marginTop: 3 }}>Disetujui {new Date(jsa.safetyAt).toLocaleString("id-ID")}</div>}
        </div>
      </div>
      {!jsa.completed && (
        <div style={{ ...S.lpWarn, marginTop: 10 }}><AlertTriangle size={12} /> Minimal 1 bahaya+mitigasi, dan kedua nama approval perlu diisi supaya JSA lengkap.</div>
      )}
    </div>
  );
}

function LiftingPlanEditor({ r, gear, liftingTemplates, liftingLibrary, onSaveTemplate, notify, onChange }) {
  const plan = r.liftingPlan || emptyLiftingPlan();
  const pct = plan.swl && plan.beratBeban ? Math.round((parseFloat(plan.beratBeban) / parseFloat(plan.swl)) * 100) : null;
  const jenisLift = pct !== null ? (pct >= CRITICAL_LIFT_THRESHOLD ? "critical" : "generic") : null;
  const checklistDone = isChecklistComplete(plan.checklist);
  const dataOk = plan.alat && plan.swl && plan.beratBeban;
  const canComplete = dataOk && checklistDone;

  const libEntry = useMemo(() => liftingLibrary.find((e) => e.key === libKey(r.barang, r.lokasi)), [liftingLibrary, r.barang, r.lokasi]);
  const selectedGear = gear.find((x) => x.nama === plan.alat);
  const hasChart = !!(selectedGear && selectedGear.loadChart && selectedGear.loadChart.length > 0);
  const needsBoom = hasChart && chartHasBoom(selectedGear.loadChart);
  const boomOptions = needsBoom ? chartBoomOptions(selectedGear.loadChart) : [];
  const chartResult = hasChart && plan.radius && (!needsBoom || plan.boom) ? interpolateLoadChart2D(selectedGear.loadChart, plan.boom, plan.radius) : null;

  useEffect(() => {
    if (!plan.alat && !plan.swl && !plan.beratBeban && libEntry) {
      onChange({ alat: libEntry.alat, swl: libEntry.swl, beratBeban: libEntry.beratBeban, radius: libEntry.radius || "", boom: libEntry.boom || "", kodeBarang: libEntry.kode || "" });
      notify(`Data "${r.barang}" di "${r.lokasi}" otomatis terisi dari riwayat sebelumnya`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setField = (patch) => {
    const next = { ...plan, ...patch };
    const nextComplete = !!(next.alat && next.swl && next.beratBeban && isChecklistComplete(next.checklist));
    onChange({ ...next, completed: nextComplete });
  };

  const pickGear = (name) => {
    const g = gear.find((x) => x.nama === name);
    const gHasChart = !!(g && g.loadChart && g.loadChart.length > 0);
    setField({ alat: name, radius: "", boom: "", swl: gHasChart ? "" : (g ? parseTon(g.kapasitas) : plan.swl) });
  };

  const recalcSwl = (boomVal, radiusVal) => {
    if (!hasChart) return "";
    const result = interpolateLoadChart2D(selectedGear.loadChart, boomVal, radiusVal);
    return result ? String(result.value) : "";
  };

  const setBoom = (val) => setField({ boom: val, swl: recalcSwl(val, plan.radius) });
  const setRadius = (val) => setField({ radius: val, swl: recalcSwl(plan.boom, val) });

  const toggleCheck = (id) => {
    setField({ checklist: { ...plan.checklist, [id]: !plan.checklist[id] } });
  };

  const applyTemplate = (tpl) => {
    setField({ alat: tpl.alat, swl: tpl.swl, radius: tpl.radius || "", boom: tpl.boom || "", checklist: { ...tpl.checklist }, templateUsed: tpl.nama });
  };

  const genericTemplates = liftingTemplates.filter((t) => gear.some((g) => g.nama === t.alat));

  return (
    <div style={S.lpBox}>
      <div style={S.lpHeader}>
        <span style={S.fieldLabel}>LIFTING PLAN</span>
        {jenisLift && (
          <span style={{ ...S.lpBadge, color: jenisLift === "critical" ? "#E1493F" : "#5FA980", borderColor: (jenisLift === "critical" ? "#E1493F" : "#5FA980") + "66" }}>
            {jenisLift === "critical" ? `CRITICAL LIFT · ${pct}%` : `GENERIC LIFT · ${pct}%`}
          </span>
        )}
        {plan.completed && <span style={{ ...S.lpBadge, color: "#5FA980", borderColor: "#5FA98066" }}><Check size={10} style={{ marginRight: 3, position: "relative", top: 1 }} />Lengkap</span>}
      </div>

      {genericTemplates.length > 0 && (
        <div style={{ marginBottom: 10 }}>
          <div style={{ ...S.fieldLabel, marginBottom: 4 }}>Pakai template tersimpan</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {genericTemplates.map((t) => (
              <button key={t.id} onClick={() => applyTemplate(t)} style={S.lpTplChip}>{t.nama}</button>
            ))}
          </div>
        </div>
      )}

      {libEntry && (
        <div style={S.lpLibNote}>
          <Check size={12} color="#5FA980" style={{ flexShrink: 0 }} />
          Data "{r.barang}" di "{r.lokasi}" sudah pernah tercatat{libEntry.kode ? ` (Kode: ${libEntry.kode})` : ""}: {libEntry.alat}{libEntry.boom ? ` · Boom ${libEntry.boom} m` : ""}{libEntry.radius ? ` · Radius ${libEntry.radius} m` : ""} · SWL {libEntry.swl} ton · Beban {libEntry.beratBeban} ton
        </div>
      )}

      <div style={{ marginBottom: 10 }}>
        <div style={S.fieldLabel}>Kode Barang (opsional)</div>
        <input value={plan.kodeBarang} onChange={(e) => setField({ kodeBarang: e.target.value })} style={{ ...S.inputSm, width: 160 }} placeholder="cth. G-2-08 A" />
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 10 }}>
        <div style={{ minWidth: 180 }}>
          <div style={S.fieldLabel}>Alat yang dipakai</div>
          <select value={plan.alat} onChange={(e) => pickGear(e.target.value)} style={S.lpSelect}>
            <option value="">Pilih alat...</option>
            {GEAR_KATEGORI_LIST.map((kat) => {
              const items = gear.filter((g) => (g.kategori || "Lifting Equipment") === kat);
              if (items.length === 0) return null;
              return (
                <optgroup key={kat} label={kat}>
                  {items.map((g) => <option key={g.id} value={g.nama}>{g.nama}</option>)}
                </optgroup>
              );
            })}
          </select>
        </div>
        {needsBoom && (
          <div>
            <div style={S.fieldLabel}>Boom (m)</div>
            <select value={plan.boom} onChange={(e) => setBoom(e.target.value)} style={{ ...S.lpSelect, width: 110 }}>
              <option value="">Pilih...</option>
              {boomOptions.map((b) => <option key={b} value={b}>{b} m</option>)}
            </select>
          </div>
        )}
        <div>
          {hasChart ? (
            <>
              <div style={S.fieldLabel}>Radius kerja (m)</div>
              <input value={plan.radius} onChange={(e) => setRadius(e.target.value)} style={S.inputSm} placeholder="cth. 6" />
            </>
          ) : (
            <>
              <div style={S.fieldLabel}>SWL (ton)</div>
              <input value={plan.swl} onChange={(e) => setField({ swl: e.target.value })} style={S.inputSm} placeholder="cth. 2" />
            </>
          )}
        </div>
        <div>
          <div style={S.fieldLabel}>Berat beban (ton)</div>
          <input value={plan.beratBeban} onChange={(e) => setField({ beratBeban: e.target.value })} style={S.inputSm} placeholder="cth. 1" />
        </div>
      </div>

      {hasChart && plan.radius && (!needsBoom || plan.boom) && (
        <div style={{ ...S.lpLibNote, color: chartResult && chartResult.outOfRange ? "#E1493F" : "#5FA980", background: chartResult && chartResult.outOfRange ? "#E1493F0F" : "#5FA9800F", borderColor: chartResult && chartResult.outOfRange ? "#E1493F33" : "#5FA98033" }}>
          {chartResult && chartResult.outOfRange ? <AlertTriangle size={12} style={{ flexShrink: 0 }} /> : <Check size={12} color="#5FA980" style={{ flexShrink: 0 }} />}
          {chartResult
            ? `SWL otomatis dari load chart${needsBoom ? ` (boom ${chartResult.boomUsed} m${chartResult.boomUsed !== plan.boom ? ", dibulatkan ke boom terdekat" : ""})` : ""} pada radius ${plan.radius} m: ${chartResult.value} ton${chartResult.outOfRange ? " — di luar jangkauan chart, gunakan dengan hati-hati" : ""}`
            : "Radius di luar data load chart"}
        </div>
      )}
      {needsBoom && !plan.boom && (
        <div style={S.lpWarn}><AlertTriangle size={12} /> Pilih panjang boom dulu supaya SWL bisa dihitung.</div>
      )}

      <div style={S.fieldLabel}>Checklist pre-use</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 6, marginBottom: 10 }}>
        {CHECKLIST_ITEMS.map((c) => (
          <label key={c.id} style={S.lpCheckRow}>
            <input type="checkbox" checked={!!plan.checklist[c.id]} onChange={() => toggleCheck(c.id)} style={{ marginTop: 2 }} />
            <span>{c.label}</span>
          </label>
        ))}
      </div>

      {!dataOk && <div style={S.lpWarn}><AlertTriangle size={12} /> Isi alat, SWL, dan berat beban dulu.</div>}
      {dataOk && !checklistDone && <div style={S.lpWarn}><AlertTriangle size={12} /> Semua checklist harus dicentang.</div>}

      {jenisLift === "generic" && dataOk && (
        <button
          onClick={() => onSaveTemplate({ nama: `${plan.alat} · ${plan.swl} ton`, alat: plan.alat, swl: plan.swl, checklist: plan.checklist })}
          style={S.lpSaveTplBtn}
        >
          Simpan sebagai template generic
        </button>
      )}
    </div>
  );
}

function DailyReport({ requests }) {
  const [date, setDate] = useState(todayISO());
  const items = requests.filter((r) => r.tanggal === date && (r.status === "Diproses" || r.status === "Selesai"));

  return (
    <div style={S.pageWrap}>
      <PageHeader eyebrow="PENGAWAS" title="Laporan Kerja Harian" desc="Rekap pekerjaan rigger pada tanggal terpilih." />

      <div style={{ marginBottom: 18 }}>
        <div style={S.fieldLabel}>Tanggal</div>
        <input type="date" style={S.input} value={date} onChange={(e) => setDate(e.target.value)} />
      </div>

      {items.length === 0 && <EmptyState text="Tidak ada pekerjaan tercatat pada tanggal ini." />}

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {items.map((r) => (
          <div key={r.id} style={S.rowCard2}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: FONT_DISPLAY, fontSize: 15, color: "#EDEBE4" }}>{r.barang}</span>
              <span style={{ ...S.statusPill, color: r.status === "Selesai" ? "#5FA980" : "#F2A31B" }}>{r.status}</span>
            </div>
            <div style={S.miniMeta}>{areaLabel(r.area)} · {r.lokasi}</div>
            <div style={{ ...S.miniMeta, fontFamily: FONT_MONO }}>
              {r.jamMulai || "--:--"} – {r.jamSelesai || "--:--"} · {r.riggers.length ? r.riggers.join(", ") : "belum di-assign"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================== GRAFIK & REKAP ============================== */
const CHART_AMBER = "#F2A31B";
const CHART_MUTED = "#3E4A52";

function Charts({ requests, riggers }) {
  const byArea = AREAS.map((a) => ({ name: areaLabel(a), jumlah: requests.filter((r) => r.area === a).length }));

  const byDay = useMemo(() => {
    const map = {};
    requests.forEach((r) => { map[r.tanggal] = (map[r.tanggal] || 0) + 1; });
    return Object.entries(map).sort(([a], [b]) => a.localeCompare(b)).map(([tanggal, jumlah]) => ({
      tanggal: fmtDate(tanggal).slice(0, 6), jumlah,
    }));
  }, [requests]);

  const byRigger = riggers.map((name) => ({ name: name.split(" ")[0], jumlah: requests.filter((r) => r.riggers.includes(name)).length }));

  return (
    <div style={S.pageWrap}>
      <PageHeader eyebrow="PENGAWAS" title="Grafik & Rekap Permintaan" desc="Data ini menjadi dasar pengajuan adendum kontrak anggota." />

      <ChartCard title="Permintaan per area">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={byArea} margin={{ left: -20 }}>
            <CartesianGrid stroke={CHART_MUTED} vertical={false} />
            <XAxis dataKey="name" tick={{ fill: "#8B98A0", fontSize: 11, fontFamily: FONT_MONO }} axisLine={{ stroke: CHART_MUTED }} tickLine={false} />
            <YAxis tick={{ fill: "#8B98A0", fontSize: 11, fontFamily: FONT_MONO }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip contentStyle={S.tooltipStyle} cursor={{ fill: "#ffffff08" }} />
            <Bar dataKey="jumlah" radius={[3, 3, 0, 0]}>
              {byArea.map((_, i) => <Cell key={i} fill={CHART_AMBER} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Tren permintaan harian">
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={byDay} margin={{ left: -20 }}>
            <CartesianGrid stroke={CHART_MUTED} vertical={false} />
            <XAxis dataKey="tanggal" tick={{ fill: "#8B98A0", fontSize: 10, fontFamily: FONT_MONO }} axisLine={{ stroke: CHART_MUTED }} tickLine={false} />
            <YAxis tick={{ fill: "#8B98A0", fontSize: 11, fontFamily: FONT_MONO }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip contentStyle={S.tooltipStyle} />
            <Line type="monotone" dataKey="jumlah" stroke={CHART_AMBER} strokeWidth={2} dot={{ fill: CHART_AMBER, r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Beban kerja per rigger">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={byRigger} layout="vertical" margin={{ left: 10 }}>
            <CartesianGrid stroke={CHART_MUTED} horizontal={false} />
            <XAxis type="number" tick={{ fill: "#8B98A0", fontSize: 11, fontFamily: FONT_MONO }} axisLine={false} tickLine={false} allowDecimals={false} />
            <YAxis type="category" dataKey="name" tick={{ fill: "#8B98A0", fontSize: 11, fontFamily: FONT_MONO }} axisLine={false} tickLine={false} width={60} />
            <Tooltip contentStyle={S.tooltipStyle} cursor={{ fill: "#ffffff08" }} />
            <Bar dataKey="jumlah" radius={[0, 3, 3, 0]} fill={CHART_AMBER} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div style={S.chartCard}>
      <div style={S.chartTitle}>{title}</div>
      {children}
    </div>
  );
}

/* ============================== JAM LEMBUR ============================== */
function timeToMinutes(t) { if (!t) return null; const [h, m] = t.split(":").map(Number); return h * 60 + m; }

function computeOvertimeMinutes(r) {
  if (r.overtimeOverride !== null && r.overtimeOverride !== undefined) return r.overtimeOverride;
  const start = timeToMinutes(r.jamMulai);
  const end = timeToMinutes(r.jamSelesai);
  if (start === null || end === null || end <= start) return 0;
  const threshold = isWeekend(r.tanggal) ? 8 * 60 : 16 * 60;
  const otStart = Math.max(start, threshold);
  return Math.max(0, end - otStart);
}

function Overtime({ requests, riggers, onUpdate }) {
  const [month, setMonth] = useState(todayISO().slice(0, 7));
  const inMonth = requests.filter((r) => r.tanggal.startsWith(month) && r.riggers.length > 0);

  const perRigger = riggers.map((name) => {
    const items = inMonth.filter((r) => r.riggers.includes(name));
    const totalMin = items.reduce((sum, r) => sum + computeOvertimeMinutes(r), 0);
    return { name, totalMin, items };
  }).filter((p) => p.items.length > 0);

  return (
    <div style={S.pageWrap}>
      <PageHeader eyebrow="PENGAWAS" title="Rekap Jam Lembur" desc="Dihitung otomatis dari jam kerja (>16:00 hari biasa, >08:00 akhir pekan) — bisa dikoreksi manual." />

      <div style={{ marginBottom: 18 }}>
        <div style={S.fieldLabel}>Bulan</div>
        <input type="month" style={S.input} value={month} onChange={(e) => setMonth(e.target.value)} />
      </div>

      {perRigger.length === 0 && <EmptyState text="Belum ada data lembur pada bulan ini." />}

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {perRigger.map((p) => (
          <div key={p.name} style={S.otCard}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontFamily: FONT_DISPLAY, fontSize: 16, color: "#EDEBE4" }}>{p.name}</span>
              <span style={{ fontFamily: FONT_MONO, fontSize: 20, color: "#F2A31B" }}>
                {(p.totalMin / 60).toFixed(1)}<span style={{ fontSize: 12, color: "#8B98A0" }}> jam</span>
              </span>
            </div>
            <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
              {p.items.map((r) => (
                <OvertimeLine key={r.id} r={r} onUpdate={onUpdate} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function OvertimeLine({ r, onUpdate }) {
  const auto = computeOvertimeMinutes({ ...r, overtimeOverride: null });
  const current = computeOvertimeMinutes(r);
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState((current / 60).toFixed(1));

  const save = () => {
    const num = parseFloat(val);
    onUpdate(r.id, { overtimeOverride: isNaN(num) ? null : Math.round(num * 60) });
    setEditing(false);
  };

  return (
    <div style={S.otLine}>
      <div style={{ fontFamily: FONT_MONO, fontSize: 11.5, color: "#8B98A0" }}>
        {fmtDate(r.tanggal).slice(0, 6)} · {r.barang} · {r.jamMulai || "--:--"}–{r.jamSelesai || "--:--"}
      </div>
      {editing ? (
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <input style={S.otInput} value={val} onChange={(e) => setVal(e.target.value)} />
          <button onClick={save} style={S.otSaveBtn}><Check size={12} /></button>
          <button onClick={() => setEditing(false)} style={S.otCancelBtn}><X size={12} /></button>
        </div>
      ) : (
        <button onClick={() => { setVal((current / 60).toFixed(1)); setEditing(true); }} style={S.otEditBtn}>
          {(current / 60).toFixed(1)} jam{r.overtimeOverride !== null && r.overtimeOverride !== undefined ? " ·  dikoreksi" : ""}
        </button>
      )}
    </div>
  );
}

/* ============================== SHARED BITS ============================== */
function PageHeader({ eyebrow, title, desc }) {
  return (
    <div style={{ marginBottom: 26 }}>
      <div style={S.eyebrow}>{eyebrow}</div>
      <h1 style={S.pageTitle}>{title}</h1>
      <div style={S.hazardBar} />
      <p style={S.pageDesc}>{desc}</p>
    </div>
  );
}

/* ============================== STYLES ============================== */
const FONT_DISPLAY = "'Oswald', sans-serif";
const FONT_BODY = "'Inter', sans-serif";
const FONT_MONO = "'JetBrains Mono', monospace";

const fontImports = `@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap');`;

const globalCss = `
  * { box-sizing: border-box; }
  input[type=date]::-webkit-calendar-picker-indicator,
  input[type=time]::-webkit-calendar-picker-indicator,
  input[type=month]::-webkit-calendar-picker-indicator { filter: invert(0.6); cursor: pointer; }
  button { font-family: ${FONT_BODY}; cursor: pointer; }
  ::placeholder { color: #5C666C; }
  input:focus { outline: none; border-color: #F2A31B !important; }
  @media (max-width: 760px) {
    .rigops-shell { flex-direction: column !important; }
    .rigops-sidebar { width: 100% !important; flex-direction: row !important; align-items: center !important; padding: 12px 16px !important; overflow-x: auto; }
  }
  .print-ticket { display: none; }
  @media print {
    @page { size: A5; margin: 8mm; }
    body * { visibility: hidden; }
    .no-print-area { display: none !important; }
    .print-ticket, .print-ticket * { visibility: visible; }
    .print-ticket { display: block !important; position: absolute; top: 0; left: 0; width: 100%; }
  }
`;

const S = {
  appShell: {
    display: "flex", minHeight: "100vh", background: "#14181B", fontFamily: FONT_BODY, color: "#EDEBE4",
    backgroundImage: "radial-gradient(circle, #FFFFFF08 1px, transparent 1px)", backgroundSize: "22px 22px",
  },
  sidebar: {
    width: 220, flexShrink: 0, background: "#1A2024", borderRight: "1px solid #262F34",
    padding: "0 16px 22px", display: "flex", flexDirection: "column", position: "sticky", top: 0, height: "100vh",
    boxShadow: "inset -1px 0 0 #00000030",
  },
  sidebarHazard: { height: 5, margin: "0 -16px 20px", background: "repeating-linear-gradient(135deg, #F2A31B 0px, #F2A31B 7px, #14181B 7px, #14181B 14px)" },
  brand: { display: "flex", alignItems: "center", gap: 10 },
  brandMark: { width: 30, height: 30, borderRadius: 6, background: "linear-gradient(155deg, #FFC24D 0%, #F2A31B 55%, #C97D0E 100%)", boxShadow: "inset 0 1px 0 #FFD98A, inset 0 -2px 3px #8A570688, 0 2px 6px #00000055", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  brandTitle: { fontFamily: FONT_DISPLAY, fontSize: 15, letterSpacing: 1.2, color: "#EDEBE4" },
  brandSub: { fontSize: 10.5, color: "#5C666C", marginTop: 1 },
  roleLabel: { fontSize: 10, letterSpacing: 1, color: "#5C666C", marginTop: 22, marginBottom: 6, fontFamily: FONT_MONO },
  roleBtn: {
    width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
    background: "#20282D", border: "1px solid #2E383F", borderRadius: 8, padding: "9px 11px",
    color: "#EDEBE4", fontSize: 13, fontFamily: FONT_BODY,
  },
  roleMenu: { position: "absolute", top: "100%", left: 0, right: 0, marginTop: 6, background: "#20282D", border: "1px solid #2E383F", borderRadius: 8, padding: 6, zIndex: 20, boxShadow: "0 8px 24px #00000055" },
  roleMenuHeader: { fontSize: 9.5, color: "#5C666C", letterSpacing: 1, padding: "6px 8px 2px", fontFamily: FONT_MONO },
  roleOpt: { display: "block", width: "100%", textAlign: "left", background: "transparent", border: "none", color: "#C9D1D6", fontSize: 13, padding: "7px 8px", borderRadius: 5 },
  navBtn: {
    display: "flex", alignItems: "center", gap: 10, width: "100%", background: "transparent", border: "none", borderLeft: "3px solid transparent",
    color: "#8B98A0", fontSize: 13.5, padding: "9px 10px 9px 8px", borderRadius: 5, marginBottom: 2, textAlign: "left",
  },
  navBtnActive: { background: "linear-gradient(90deg, #F2A31B1F, #F2A31B08)", color: "#F2A31B", borderLeft: "3px solid #F2A31B" },
  sidebarFoot: { marginTop: "auto" },
  footLine: { height: 1, background: "#262F34", marginBottom: 12 },
  main: { flex: 1, padding: "34px 40px", maxWidth: 880, minWidth: 0 },
  pageWrap: { width: "100%" },
  eyebrow: { fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 1.5, color: "#F2A31B" },
  pageTitle: { fontFamily: FONT_DISPLAY, fontSize: 28, fontWeight: 500, margin: "4px 0 12px", color: "#EDEBE4" },
  hazardBar: { height: 6, width: 64, borderRadius: 3, marginBottom: 14, background: "repeating-linear-gradient(135deg, #F2A31B 0px, #F2A31B 8px, #14181B 8px, #14181B 16px)", boxShadow: "0 1px 6px #F2A31B33" },
  pageDesc: { fontSize: 13.5, color: "#8B98A0", margin: 0, maxWidth: 520, lineHeight: 1.5 },

  ticketCard: { position: "relative", background: "linear-gradient(165deg, #232B30, #1B2226)", border: "1px dashed #3A4148", borderRadius: 12, padding: "26px 26px 22px", maxWidth: 480, boxShadow: "0 12px 30px #00000040" },
  ticketHole: { position: "absolute", top: -8, left: "50%", transform: "translateX(-50%)", width: 16, height: 16, borderRadius: 99, background: "#14181B", border: "1px solid #2A333A", boxShadow: "inset 0 2px 3px #00000080" },
  ticketRivet: { position: "absolute", width: 6, height: 6, borderRadius: 99, background: "radial-gradient(circle at 35% 30%, #6B7680, #2A333A)", boxShadow: "0 1px 2px #00000066" },
  ticketHead: { borderBottom: "1px dashed #38434A", paddingBottom: 14, marginBottom: 18 },

  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 },
  field: { display: "block", marginBottom: 14 },
  fieldLabel: { display: "block", fontSize: 11.5, color: "#8B98A0", marginBottom: 6, fontFamily: FONT_MONO, letterSpacing: 0.3 },
  input: { width: "100%", background: "#161B1E", border: "1px solid #2E383F", borderRadius: 7, padding: "9px 10px", color: "#EDEBE4", fontSize: 13.5, fontFamily: FONT_BODY },
  inputSm: { width: 110, background: "#161B1E", border: "1px solid #2E383F", borderRadius: 6, padding: "6px 8px", color: "#EDEBE4", fontSize: 13, fontFamily: FONT_MONO },

  urgChip: { display: "flex", alignItems: "center", gap: 5, border: "1px solid #38434A", borderRadius: 20, padding: "7px 13px", fontSize: 12.5, background: "transparent" },
  ssNote: { display: "flex", alignItems: "center", gap: 6, fontSize: 11.5, color: "#E1493F", marginTop: 8 },
  submitBtn: { width: "100%", background: "#F2A31B", color: "#14181B", border: "none", borderRadius: 8, padding: "12px", fontSize: 14, fontWeight: 600, marginTop: 6, fontFamily: FONT_BODY },

  groupHeader: { display: "flex", alignItems: "center", fontFamily: FONT_MONO, fontSize: 12, letterSpacing: 1, color: "#C9D1D6", marginBottom: 10 },
  groupCount: { marginLeft: 8, color: "#5C666C" },
  cardList: { display: "flex", flexDirection: "column", gap: 8 },
  miniCard: { position: "relative", background: "#1F262A", border: "1px solid #2A333A", borderRadius: 9, padding: "12px 14px", overflow: "hidden" },
  miniMeta: { fontSize: 11.5, color: "#8B98A0", marginTop: 4 },
  ssRibbon: { position: "absolute", top: 0, right: 0, background: "#E1493F", color: "#14181B", fontSize: 9.5, fontWeight: 700, padding: "2px 10px", borderBottomLeftRadius: 8, fontFamily: FONT_MONO, letterSpacing: 0.5 },
  urgTag: { fontSize: 10.5, border: "1px solid", borderRadius: 20, padding: "2px 9px", fontFamily: FONT_MONO },
  areaTag: { fontSize: 10.5, color: "#8B98A0", border: "1px solid #38434A", borderRadius: 20, padding: "2px 8px", fontFamily: FONT_MONO },
  queueNo: { fontFamily: FONT_MONO, fontSize: 14, color: "#F2A31B", background: "#F2A31B14", border: "1px solid #F2A31B40", borderRadius: 7, width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },

  empty: { color: "#5C666C", fontSize: 13, padding: "30px 0", textAlign: "center", border: "1px dashed #2A333A", borderRadius: 10 },

  filterChip: { background: "transparent", border: "1px solid #2E383F", color: "#8B98A0", borderRadius: 20, padding: "6px 14px", fontSize: 12.5 },
  filterChipActive: { background: "#F2A31B1A", borderColor: "#F2A31B", color: "#F2A31B" },

  rowCard: { background: "#1F262A", border: "1px solid #2A333A", borderRadius: 10, overflow: "hidden" },
  rowMain: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 15px", cursor: "pointer" },
  rowExpand: { padding: "0 15px 16px", borderTop: "1px solid #262F34" },
  rowCard2: { background: "#1F262A", border: "1px solid #2A333A", borderRadius: 10, padding: "12px 15px" },
  statusPill: { fontSize: 11, fontFamily: FONT_MONO, border: "1px solid currentColor", borderRadius: 20, padding: "2px 10px" },

  riggerChip: { display: "flex", alignItems: "center", gap: 4, border: "1px solid #38434A", borderRadius: 20, padding: "5px 11px", fontSize: 12, color: "#8B98A0", background: "transparent" },
  riggerChipActive: { borderColor: "#5FA980", color: "#5FA980", background: "#5FA9801A" },

  statusBtn: { border: "1px solid #38434A", borderRadius: 7, padding: "7px 12px", fontSize: 12, color: "#8B98A0", background: "transparent" },
  statusBtnActive: { borderColor: "#F2A31B", color: "#F2A31B", background: "#F2A31B1A" },
  printBtn: { display: "flex", alignItems: "center", gap: 6, border: "1px solid #38434A", borderRadius: 7, padding: "7px 12px", fontSize: 12, color: "#8B98A0", background: "transparent", marginLeft: "auto" },
  printHint: { fontSize: 11, color: "#5C666C", marginLeft: "auto", alignSelf: "center", fontStyle: "italic" },
  deleteBtn: { display: "flex", alignItems: "center", gap: 6, border: "1px solid #38434A", borderRadius: 7, padding: "7px 12px", fontSize: 12, color: "#8B98A0", background: "transparent" },
  deleteConfirmBtn: { border: "1px solid #E1493F", background: "#E1493F1A", color: "#E1493F", borderRadius: 6, padding: "6px 10px", fontSize: 11.5 },
  deleteCancelBtn: { border: "1px solid #38434A", background: "transparent", color: "#8B98A0", borderRadius: 6, padding: "6px 10px", fontSize: 11.5 },

  lpBox: { marginTop: 16, padding: "12px 14px", background: "#1A2024", borderRadius: 9, border: "1px solid #2A333A" },
  lpHeader: { display: "flex", alignItems: "center", gap: 8, marginBottom: 10, flexWrap: "wrap" },
  lpBadge: { fontFamily: FONT_MONO, fontSize: 10, border: "1px solid", borderRadius: 20, padding: "2px 9px" },
  lpTplChip: { border: "1px solid #38434A", background: "#20282D", color: "#C9D1D6", borderRadius: 20, padding: "5px 11px", fontSize: 11.5 },
  lpSelect: { width: "100%", background: "#161B1E", border: "1px solid #2E383F", borderRadius: 6, padding: "8px 9px", color: "#EDEBE4", fontSize: 13, fontFamily: FONT_BODY },
  lpCheckRow: { display: "flex", gap: 8, alignItems: "flex-start", fontSize: 12, color: "#C9D1D6", lineHeight: 1.3 },
  lpWarn: { display: "flex", alignItems: "center", gap: 6, fontSize: 11.5, color: "#F2A31B", marginBottom: 8 },
  lpSaveTplBtn: { border: "1px dashed #5FA980", background: "#5FA9801A", color: "#5FA980", borderRadius: 6, padding: "7px 12px", fontSize: 11.5 },
  lpViewBtn: { border: "1px solid #38434A", background: "transparent", color: "#8B98A0", borderRadius: 20, padding: "3px 10px", fontSize: 10.5 },
  lpDetailBox: { marginTop: 8, padding: "10px 12px", background: "#161B1E", borderRadius: 7, border: "1px solid #2A333A" },
  lpLibNote: { display: "flex", alignItems: "flex-start", gap: 6, fontSize: 11.5, color: "#5FA980", background: "#5FA9800F", border: "1px solid #5FA98033", borderRadius: 6, padding: "8px 10px", marginBottom: 10 },
  memberRow: { display: "flex", justifyContent: "space-between", alignItems: "center", background: "#1F262A", border: "1px solid #2A333A", borderRadius: 8, padding: "10px 14px" },
  memberRemoveBtn: { background: "transparent", border: "1px solid #38434A", color: "#E1493F", borderRadius: 6, padding: "6px 8px" },
  memberRowFull: { display: "flex", alignItems: "center", gap: 12, background: "#1F262A", border: "1px solid #2A333A", borderRadius: 8, padding: "10px 14px" },
  gearRowWrap: { background: "#1F262A", border: "1px solid #2A333A", borderRadius: 8, padding: "10px 14px" },
  lpChartRow: { display: "flex", justifyContent: "space-between", alignItems: "center", background: "#161B1E", borderRadius: 5, padding: "5px 10px" },
  sectionLabel: { fontFamily: FONT_MONO, fontSize: 11.5, letterSpacing: 1.2, color: "#F2A31B", marginBottom: 10 },
  kategoriTag: { fontSize: 10, fontFamily: FONT_MONO, color: "#8B98A0", border: "1px solid #38434A", borderRadius: 20, padding: "1.5px 8px", display: "inline-block" },
  posisiTag: { fontSize: 10, fontFamily: FONT_MONO, color: "#F2A31B", border: "1px solid #F2A31B55", background: "#F2A31B14", borderRadius: 20, padding: "1.5px 8px", display: "inline-block", cursor: "pointer" },
  photoBox: { width: 40, height: 40, border: "1px dashed #38434A", background: "#161B1E center/cover no-repeat", backgroundSize: "cover", backgroundPosition: "center", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 },
  gearKondisi: { fontFamily: FONT_MONO, fontSize: 11, border: "1px solid", borderRadius: 20, padding: "4px 11px", background: "transparent" },
  teamGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(96px, 1fr))", gap: 12, maxWidth: 560 },
  teamCard: { background: "#1F262A", border: "1px solid #2A333A", borderRadius: 10, padding: "12px 8px", display: "flex", flexDirection: "column", alignItems: "center" },
  teamPhoto: { width: 56, height: 56, borderRadius: 99, background: "#161B1E", backgroundSize: "cover", backgroundPosition: "center", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #2A333A" },
  sioBtn: { marginTop: 8, fontSize: 10.5, fontFamily: FONT_MONO, color: "#F2A31B", background: "#F2A31B14", border: "1px solid #F2A31B40", borderRadius: 20, padding: "3px 10px" },
  zoomOverlay: { position: "fixed", inset: 0, background: "#000000CC", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: 24 },
  zoomImg: { maxWidth: "100%", maxHeight: "90vh", borderRadius: 10, border: "2px solid #38434A" },

  chartCard: { background: "#1F262A", border: "1px solid #2A333A", borderRadius: 12, padding: "18px 18px 6px", marginBottom: 18 },
  chartTitle: { fontFamily: FONT_DISPLAY, fontSize: 15, color: "#EDEBE4", marginBottom: 6 },
  tooltipStyle: { background: "#20282D", border: "1px solid #38434A", borderRadius: 6, fontSize: 12, fontFamily: FONT_MONO },

  otCard: { background: "#1F262A", border: "1px solid #2A333A", borderRadius: 10, padding: "14px 16px" },
  otLine: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px 0" },
  otInput: { width: 54, background: "#161B1E", border: "1px solid #F2A31B", borderRadius: 5, padding: "3px 6px", color: "#EDEBE4", fontFamily: FONT_MONO, fontSize: 12 },
  otSaveBtn: { background: "#5FA9801A", border: "1px solid #5FA980", color: "#5FA980", borderRadius: 5, padding: "3px 6px" },
  otCancelBtn: { background: "transparent", border: "1px solid #38434A", color: "#8B98A0", borderRadius: 5, padding: "3px 6px" },
  otEditBtn: { background: "transparent", border: "1px dashed #38434A", color: "#C9D1D6", borderRadius: 6, padding: "3px 9px", fontFamily: FONT_MONO, fontSize: 12 },

  gateWrap: { display: "flex", alignItems: "center", justifyContent: "center", minHeight: "70vh" },
  gateCard: { width: 300, background: "#1F262A", border: "1px solid #2A333A", borderRadius: 14, padding: "28px 26px", textAlign: "center" },
  gateIcon: { width: 44, height: 44, borderRadius: 10, background: "linear-gradient(155deg, #FFC24D, #F2A31B)", boxShadow: "0 0 0 4px #F2A31B14, 0 8px 20px #F2A31B33", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto" },
  logoutBtn: { display: "flex", alignItems: "center", gap: 7, background: "transparent", border: "1px solid #38434A", color: "#8B98A0", borderRadius: 7, padding: "8px 10px", fontSize: 12, marginBottom: 12, width: "100%" },

  toast: { position: "fixed", bottom: 22, left: "50%", transform: "translateX(-50%)", background: "#20282D", border: "1px solid #5FA980", color: "#5FA980", padding: "9px 16px", borderRadius: 8, fontSize: 13, display: "flex", alignItems: "center", gap: 7, boxShadow: "0 8px 24px #00000055" },
};
