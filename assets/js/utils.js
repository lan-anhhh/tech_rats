export function safeJsonParse(raw, fallback){
  try { return JSON.parse(raw); } catch { return fallback; }
}

export function uuidv4(){
  if (window.crypto && typeof crypto.randomUUID === "function") return crypto.randomUUID();
  const buf = new Uint8Array(16);
  (window.crypto || window.msCrypto).getRandomValues(buf);
  buf[6] = (buf[6] & 0x0f) | 0x40;
  buf[8] = (buf[8] & 0x3f) | 0x80;
  const hex = [...buf].map(b => b.toString(16).padStart(2,"0")).join("");
  return (
    hex.slice(0,8) + "-" +
    hex.slice(8,12) + "-" +
    hex.slice(12,16) + "-" +
    hex.slice(16,20) + "-" +
    hex.slice(20)
  );
}

export function fmtDate(ts){
  const d = new Date(ts);
  return d.toLocaleString(undefined, { year:"numeric", month:"short", day:"2-digit", hour:"2-digit", minute:"2-digit" });
}

export function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, (c) => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"
  }[c]));
}

export function rgbToHex(rgb){
  const m = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
  if (!m) return "#000000";
  const r = Number(m[1]).toString(16).padStart(2,"0");
  const g = Number(m[2]).toString(16).padStart(2,"0");
  const b = Number(m[3]).toString(16).padStart(2,"0");
  return ("#" + r + g + b).toLowerCase();
}
