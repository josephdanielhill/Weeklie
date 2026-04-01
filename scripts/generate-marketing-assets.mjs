import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { writeFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.join(__dirname, '../public/marketing-assets');
mkdirSync(OUTPUT_DIR, { recursive: true });

// ── Design tokens ──────────────────────────────────────────────────────────
const C = {
  bg:      '#0f172a',
  card:    '#1e293b',
  card2:   '#334155',
  accent:  '#6366f1',
  accentL: '#818cf8',
  indigo:  '#4f46e5',
  text1:   '#f8fafc',
  text2:   '#cbd5e1',
  text3:   '#94a3b8',
  text4:   '#64748b',
  green:   '#22c55e',
  amber:   '#f59e0b',
  red:     '#ef4444',
};

// ── Shared CSS ─────────────────────────────────────────────────────────────
const BASE_CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: 1200px; height: 630px; overflow: hidden;
    background: ${C.bg};
    font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
    color: ${C.text1};
    -webkit-font-smoothing: antialiased;
  }
  .root { width: 1200px; height: 630px; position: relative; overflow: hidden; }

  /* glow helpers */
  .glow-tl { position:absolute; top:-180px; left:-180px; width:520px; height:520px;
    background: radial-gradient(circle, #6366f130 0%, transparent 70%); pointer-events:none; }
  .glow-br { position:absolute; bottom:-180px; right:-180px; width:520px; height:520px;
    background: radial-gradient(circle, #6366f128 0%, transparent 70%); pointer-events:none; }
  .glow-center { position:absolute; top:50%; left:50%; transform:translate(-50%,-50%);
    width:700px; height:700px;
    background: radial-gradient(ellipse, #6366f114 0%, transparent 65%); pointer-events:none; }

  /* logo mark */
  .logo-wrap { display:flex; align-items:center; gap:10px; }
  .logo-text  { font-size:20px; font-weight:800; letter-spacing:-0.04em; color:${C.text1}; }

  /* pill label */
  .pill {
    display:inline-flex; align-items:center;
    background: #6366f122; color:${C.accentL};
    border-radius:99px; padding:5px 14px;
    font-size:12px; font-weight:700; letter-spacing:0.06em; text-transform:uppercase;
  }

  /* gradient text */
  .grad { background: linear-gradient(135deg, ${C.accentL}, #a78bfa);
    -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }

  /* card */
  .card {
    background: ${C.card}; border-radius:16px;
    border: 1px solid #334155;
    box-shadow: 0 8px 32px rgba(0,0,0,0.55);
  }
`;

// ── Logo SVG inline ────────────────────────────────────────────────────────
const LOGO_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none" width="36" height="36">
  <defs>
    <linearGradient id="logo-bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#6366f1"/>
      <stop offset="100%" stop-color="#4f46e5"/>
    </linearGradient>
  </defs>
  <rect width="32" height="32" rx="8" fill="url(#logo-bg)"/>
  <text x="16" y="23" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="800" text-anchor="middle" letter-spacing="-0.04em" fill="#ffffff">W</text>
</svg>`;

// Large decorative W mark for backgrounds
const BIG_W_SVG = (size = 320, opacity = 0.06) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none" width="${size}" height="${size}" style="opacity:${opacity}">
  <defs>
    <linearGradient id="big-w-bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#6366f1"/>
      <stop offset="100%" stop-color="#4f46e5"/>
    </linearGradient>
  </defs>
  <rect width="32" height="32" rx="8" fill="url(#big-w-bg)"/>
  <text x="16" y="23" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="800" text-anchor="middle" letter-spacing="-0.04em" fill="#ffffff">W</text>
</svg>`;

// ── Asset definitions ──────────────────────────────────────────────────────

const assets = [

  // ── 1. General / OG card ────────────────────────────────────────────────
  {
    name: '1-general',
    html: `<!DOCTYPE html><html><head><meta charset="utf-8">
<style>
${BASE_CSS}
.root {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0;
  background: ${C.bg};
}
.top-rule {
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 3px;
  background: linear-gradient(90deg, ${C.accent} 0%, #a78bfa 50%, ${C.accent} 100%);
}
.big-w {
  position: absolute;
  right: -40px; bottom: -40px;
}
.glow-tr {
  position:absolute; top:-120px; right:-100px; width:450px; height:450px;
  background: radial-gradient(circle, #6366f128 0%, transparent 65%);
}
.glow-bl {
  position:absolute; bottom:-120px; left:-60px; width:380px; height:380px;
  background: radial-gradient(circle, #818cf818 0%, transparent 65%);
}
.center-content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 28px;
}
.headline {
  font-size: 68px;
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1.05;
  text-align: center;
}
.sub {
  font-size: 22px;
  color: ${C.text2};
  text-align: center;
  letter-spacing: -0.01em;
  max-width: 640px;
  line-height: 1.5;
}
.badge-row {
  display: flex;
  gap: 12px;
  align-items: center;
}
.badge {
  display: flex; align-items: center; gap: 7px;
  background: #6366f118; border: 1px solid #6366f140;
  border-radius: 99px; padding: 7px 16px;
  font-size: 14px; font-weight: 600; color: ${C.text2};
}
.dot { width:7px; height:7px; border-radius:50%; background:${C.green}; }
.logo-row {
  display: flex; align-items: center; gap: 10px;
  margin-bottom: 8px;
}
.logo-row-text {
  font-size: 28px; font-weight: 800; letter-spacing: -0.04em; color:${C.text1};
}
/* mini week strip */
.week-strip {
  position: absolute;
  bottom: 36px;
  display: flex; gap: 10px;
  left: 50%; transform: translateX(-50%);
}
.day-chip {
  background: ${C.card};
  border: 1px solid #334155;
  border-radius: 10px;
  padding: 10px 16px;
  display: flex; flex-direction: column; align-items: center; gap: 5px;
  min-width: 88px;
}
.day-chip.accent-border { border-color: ${C.accent}; }
.day-name { font-size: 11px; font-weight: 700; color: ${C.text4}; letter-spacing:0.06em; text-transform:uppercase; }
.day-hours { font-size: 18px; font-weight: 700; color: ${C.text1}; }
.day-bar-bg { width: 56px; height: 5px; background: #334155; border-radius: 99px; overflow:hidden; }
.day-bar { height:100%; border-radius:99px; }
</style>
</head><body>
<div class="root">
  <div class="top-rule"></div>
  <div class="glow-tr"></div>
  <div class="glow-bl"></div>
  <div class="big-w">${BIG_W_SVG(380, 0.055)}</div>

  <div class="center-content">
    <div class="logo-row">
      ${LOGO_SVG}
      <span class="logo-row-text">Weeklie</span>
    </div>

    <div class="headline">
      Plan your work week.<br><span class="grad">Hit your hours every time.</span>
    </div>

    <div class="sub">
      A free, browser-based weekly work planner — no sign-up, no spreadsheets, no stress.
    </div>

    <div class="badge-row">
      <div class="badge"><span class="dot"></span> Free &amp; no sign-up required</div>
      <div class="badge"><span style="font-size:15px">🗓</span> Calendar export</div>
      <div class="badge"><span style="font-size:15px">⚡</span> Auto-balance</div>
    </div>
  </div>

  <!-- mini week strip at bottom -->
  <div class="week-strip">
    ${[
      { d:'MON', h:'8.0h', w:100, c:C.green },
      { d:'TUE', h:'7.5h', w:94,  c:C.green },
      { d:'WED', h:'8.0h', w:100, c:C.green },
      { d:'THU', h:'6.5h', w:81,  c:C.amber },
      { d:'FRI', h:'8.0h', w:100, c:C.green },
    ].map((day, i) => `
    <div class="day-chip ${i===2?'accent-border':''}">
      <span class="day-name">${day.d}</span>
      <span class="day-hours">${day.h}</span>
      <div class="day-bar-bg"><div class="day-bar" style="width:${day.w}%;background:${day.c}"></div></div>
    </div>`).join('')}
  </div>
</div>
</body></html>`,
  },

  // ── 2. Auto-balance ──────────────────────────────────────────────────────
  {
    name: '2-auto-balance',
    html: `<!DOCTYPE html><html><head><meta charset="utf-8">
<style>
${BASE_CSS}
.root {
  display: flex;
  align-items: center;
  padding: 0 80px;
  gap: 64px;
  background: linear-gradient(135deg, #0d1526 0%, ${C.bg} 50%, #110d24 100%);
}
.top-rule {
  position: absolute; top:0; left:0; right:0; height:3px;
  background: linear-gradient(90deg, ${C.accent}, #a78bfa, ${C.accent});
}
.glow-left {
  position:absolute; top:50%; left:-80px; transform:translateY(-50%);
  width:400px; height:400px;
  background:radial-gradient(circle, #6366f122 0%, transparent 65%);
}
/* Left: copy */
.copy { flex: 0 0 460px; display:flex; flex-direction:column; gap:20px; z-index:2; }
.headline { font-size:52px; font-weight:800; letter-spacing:-0.04em; line-height:1.1; }
.desc { font-size:17px; color:${C.text2}; line-height:1.6; max-width:380px; }
.logo-row { display:flex; align-items:center; gap:8px; margin-top:8px; }
.logo-small { font-size:14px; font-weight:700; color:${C.text4}; letter-spacing:-0.02em; }

/* Right: mockup */
.mockup { flex:1; display:flex; flex-direction:column; gap:10px; z-index:2; }
.mock-label { font-size:11px; font-weight:700; color:${C.text4}; letter-spacing:0.08em; text-transform:uppercase; margin-bottom:2px; }

.mock-card {
  background:${C.card}; border-radius:14px; padding:14px 18px;
  border:1px solid #334155;
  display:flex; align-items:center; justify-content:space-between;
  gap:12px;
}
.mock-card.highlight { border-color: ${C.accent}; background: linear-gradient(135deg, #1e1b4b 0%, ${C.card} 100%); }
.mock-card.changed { border-color: ${C.accentL}; }
.day-info { display:flex; flex-direction:column; gap:3px; }
.day-tag { font-size:11px; font-weight:700; letter-spacing:0.06em; text-transform:uppercase; color:${C.text4}; }
.day-val { font-size:22px; font-weight:800; color:${C.text1}; letter-spacing:-0.03em; }
.bar-wrap { flex:1; }
.bar-track { height:8px; background:#334155; border-radius:99px; overflow:hidden; }
.bar-fill { height:100%; border-radius:99px; }
.hours-badge { font-size:13px; font-weight:700; color:${C.text3}; white-space:nowrap; }
.arrow-col {
  display:flex; flex-direction:column; align-items:center; justify-content:center;
  gap:6px; padding: 0 8px;
}
.arrow-badge {
  background:#6366f122; color:${C.accentL}; border-radius:8px;
  padding:4px 10px; font-size:12px; font-weight:700;
}
.updated-chip {
  background:#22c55e1a; color:${C.green}; border-radius:99px;
  padding:3px 10px; font-size:11px; font-weight:700; letter-spacing:0.04em;
}
</style>
</head><body>
<div class="root">
  <div class="top-rule"></div>
  <div class="glow-left"></div>

  <!-- copy -->
  <div class="copy">
    <span class="pill">Smart Scheduling</span>
    <div class="headline">Auto-balance<br><span class="grad">across the week</span></div>
    <div class="desc">Update one day and Weeklie automatically redistributes the remaining hours across the rest of your week.</div>
    <div class="logo-row">
      ${LOGO_SVG}
      <span class="logo-small">Weeklie</span>
    </div>
  </div>

  <!-- mockup: before/after style day cards -->
  <div class="mockup">
    <div class="mock-label">Before → After redistribution</div>

    ${[
      { d:'MON', before:'8.0h', after:'8.0h', pct:100, color:C.green, locked:true, changed:false },
      { d:'TUE', before:'8.0h', after:'6.0h', pct:75,  color:C.amber, locked:false, changed:true },
      { d:'WED', before:'6.0h', after:'7.5h', pct:94,  color:C.green, locked:false, changed:true },
      { d:'THU', before:'6.0h', after:'7.5h', pct:94,  color:C.green, locked:false, changed:true },
      { d:'FRI', before:'8.0h', after:'9.0h', pct:100, color:C.green, locked:false, changed:true },
    ].map(day => `
    <div class="mock-card ${day.locked?'highlight':''} ${day.changed?'changed':''}">
      <div class="day-info">
        <span class="day-tag">${day.d}${day.locked?' 🔒':''}</span>
        <span class="day-val">${day.after}</span>
      </div>
      <div class="bar-wrap">
        <div class="bar-track">
          <div class="bar-fill" style="width:${day.pct}%;background:${day.color}"></div>
        </div>
      </div>
      ${day.changed ? `<span class="updated-chip">adjusted</span>` : `<span class="hours-badge">locked</span>`}
    </div>`).join('')}
  </div>
</div>
</body></html>`,
  },

  // ── 3. See your week at a glance ────────────────────────────────────────
  {
    name: '3-week-at-a-glance',
    html: `<!DOCTYPE html><html><head><meta charset="utf-8">
<style>
${BASE_CSS}
.root {
  display: flex;
  align-items: center;
  padding: 0 72px;
  gap: 56px;
  background: ${C.bg};
}
.top-rule {
  position:absolute; top:0; left:0; right:0; height:3px;
  background:linear-gradient(90deg,${C.accent},#a78bfa,${C.accent});
}
.glow-right {
  position:absolute; top:50%; right:-60px; transform:translateY(-50%);
  width:420px; height:420px;
  background:radial-gradient(circle, #818cf81a 0%, transparent 65%);
}
/* Left: mockup — progress panel + day grid */
.mockup { flex:1; display:flex; flex-direction:column; gap:12px; z-index:2; }

/* Progress panel */
.progress-panel {
  background:${C.card}; border-radius:16px; padding:20px 22px;
  border:1.5px solid ${C.accent};
  box-shadow: 0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px #6366f120;
}
.panel-top { display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; }
.panel-title { font-size:14px; font-weight:700; color:${C.text1}; }
.panel-val { font-size:26px; font-weight:800; letter-spacing:-0.03em; color:${C.text1}; }
.panel-sub { font-size:12px; color:${C.text3}; margin-top:2px; }
.prog-bar-bg { height:10px; background:#334155; border-radius:99px; overflow:hidden; margin-bottom:8px; }
.prog-bar { height:100%; border-radius:99px; background:linear-gradient(90deg,${C.green},#16a34a); }
.prog-meta { display:flex; justify-content:space-between; }
.prog-meta span { font-size:12px; color:${C.text3}; }

/* Day row */
.day-row { display:flex; gap:10px; }
.day-card {
  flex:1; background:${C.card}; border-radius:14px; padding:14px 12px;
  border:1px solid #334155;
  display:flex; flex-direction:column; gap:8px;
}
.day-card.accent { border-color:${C.accent}; background:linear-gradient(180deg,#1e1b4b 0%,${C.card} 100%); }
.day-card.off { opacity:0.5; }
.dc-name { font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.06em; color:${C.text4}; }
.dc-hours { font-size:19px; font-weight:800; letter-spacing:-0.03em; color:${C.text1}; }
.dc-time { font-size:11px; color:${C.text3}; }
.dc-bar-bg { height:5px; background:#334155; border-radius:99px; overflow:hidden; }
.dc-bar { height:100%; border-radius:99px; }

/* Right: copy */
.copy { flex:0 0 400px; display:flex; flex-direction:column; gap:20px; z-index:2; }
.headline { font-size:50px; font-weight:800; letter-spacing:-0.04em; line-height:1.1; }
.desc { font-size:17px; color:${C.text2}; line-height:1.6; }
.feature-list { display:flex; flex-direction:column; gap:10px; margin-top:4px; }
.feat-item { display:flex; align-items:center; gap:10px; font-size:15px; color:${C.text2}; }
.feat-dot { width:6px; height:6px; border-radius:50%; background:${C.accent}; flex-shrink:0; }
.logo-row { display:flex; align-items:center; gap:8px; margin-top:4px; }
.logo-small { font-size:14px; font-weight:700; color:${C.text4}; letter-spacing:-0.02em; }
</style>
</head><body>
<div class="root">
  <div class="top-rule"></div>
  <div class="glow-right"></div>

  <!-- mockup left -->
  <div class="mockup">
    <!-- progress panel -->
    <div class="progress-panel">
      <div class="panel-top">
        <div>
          <div class="panel-title">Weekly Target</div>
          <div class="panel-sub">40h target · 5 days</div>
        </div>
        <div style="text-align:right">
          <div class="panel-val">38.5h</div>
          <div class="panel-sub" style="color:${C.green}">96% complete</div>
        </div>
      </div>
      <div class="prog-bar-bg"><div class="prog-bar" style="width:96%"></div></div>
      <div class="prog-meta">
        <span>38.5h logged</span>
        <span>1.5h to go</span>
      </div>
    </div>

    <!-- day row -->
    <div class="day-row">
      ${[
        { d:'MON', h:'8.0h', t:'09:00–17:00', pct:100, color:C.green, cls:'accent' },
        { d:'TUE', h:'7.5h', t:'09:00–16:30', pct:94,  color:C.green, cls:'' },
        { d:'WED', h:'8.0h', t:'09:00–17:00', pct:100, color:C.green, cls:'' },
        { d:'THU', h:'7.0h', t:'09:00–16:00', pct:88,  color:C.amber, cls:'' },
        { d:'FRI', h:'8.0h', t:'09:00–17:00', pct:100, color:C.green, cls:'' },
      ].map(day => `
      <div class="day-card ${day.cls}">
        <span class="dc-name">${day.d}</span>
        <span class="dc-hours">${day.h}</span>
        <span class="dc-time">${day.t}</span>
        <div class="dc-bar-bg"><div class="dc-bar" style="width:${day.pct}%;background:${day.color}"></div></div>
      </div>`).join('')}
    </div>
  </div>

  <!-- copy right -->
  <div class="copy">
    <span class="pill">Weekly Overview</span>
    <div class="headline">See your week<br><span class="grad">at a glance</span></div>
    <div class="desc">All five days, your target hours, and real-time progress — laid out clearly so you always know where you stand.</div>
    <div class="feature-list">
      <div class="feat-item"><span class="feat-dot"></span>Live progress bar updates as you plan</div>
      <div class="feat-item"><span class="feat-dot"></span>Colour-coded status: on track, behind, over</div>
      <div class="feat-item"><span class="feat-dot"></span>Start &amp; end times with break deductions</div>
    </div>
    <div class="logo-row">${LOGO_SVG}<span class="logo-small">Weeklie</span></div>
  </div>
</div>
</body></html>`,
  },

  // ── 4. Send it straight to your calendar ────────────────────────────────
  {
    name: '4-calendar-export',
    html: `<!DOCTYPE html><html><head><meta charset="utf-8">
<style>
${BASE_CSS}
.root {
  display: flex;
  align-items: center;
  padding: 0 72px;
  gap: 64px;
  background: linear-gradient(135deg, #0a0e1a 0%, ${C.bg} 60%, #0e0f22 100%);
}
.top-rule {
  position:absolute; top:0; left:0; right:0; height:3px;
  background:linear-gradient(90deg,${C.accent},#a78bfa,${C.accent});
}
.glow-tl { position:absolute; top:-100px; left:-80px; width:380px; height:380px;
  background:radial-gradient(circle,#6366f120 0%,transparent 65%); }
.glow-br { position:absolute; bottom:-100px; right:-80px; width:380px; height:380px;
  background:radial-gradient(circle,#818cf818 0%,transparent 65%); }

/* Left: copy */
.copy { flex:0 0 420px; display:flex; flex-direction:column; gap:20px; z-index:2; }
.headline { font-size:50px; font-weight:800; letter-spacing:-0.04em; line-height:1.1; }
.desc { font-size:17px; color:${C.text2}; line-height:1.6; }
.feature-list { display:flex; flex-direction:column; gap:10px; margin-top:4px; }
.feat-item { display:flex; align-items:center; gap:10px; font-size:15px; color:${C.text2}; }
.feat-dot { width:6px; height:6px; border-radius:50%; background:${C.accent}; flex-shrink:0; }
.logo-row { display:flex; align-items:center; gap:8px; margin-top:4px; }
.logo-small { font-size:14px; font-weight:700; color:${C.text4}; letter-spacing:-0.02em; }

/* Right: export mockup */
.mockup { flex:1; display:flex; flex-direction:column; gap:14px; z-index:2; }
.export-panel {
  background:${C.card}; border-radius:16px; padding:24px 26px;
  border:1.5px solid ${C.accent};
  box-shadow:0 8px 32px rgba(0,0,0,0.55);
}
.ep-title { font-size:15px; font-weight:700; color:${C.text1}; margin-bottom:18px; display:flex; align-items:center; gap:8px; }
.ep-title-icon { font-size:18px; }
.cw-row { display:flex; align-items:center; justify-content:space-between; margin-bottom:20px; }
.cw-label { font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:0.06em; color:${C.text4}; margin-bottom:4px; }
.cw-value { font-size:28px; font-weight:800; letter-spacing:-0.03em; color:${C.text1}; }
.cw-dates { font-size:13px; color:${C.text3}; margin-top:2px; }
.cw-nav { display:flex; gap:8px; }
.cw-btn {
  width:36px; height:36px; border-radius:10px;
  background:#334155; border:1px solid #475569;
  display:flex; align-items:center; justify-content:center;
  font-size:16px; color:${C.text2}; font-weight:600;
}
.divider { height:1px; background:#334155; margin-bottom:20px; }
.export-btns { display:flex; flex-direction:column; gap:10px; }
.btn-gcal {
  display:flex; align-items:center; gap:12px;
  background:linear-gradient(135deg,#1d4ed8,#1e40af);
  border-radius:12px; padding:14px 20px;
  font-size:15px; font-weight:700; color:#fff;
  box-shadow:0 4px 16px rgba(37,99,235,0.4);
}
.btn-ics {
  display:flex; align-items:center; gap:12px;
  background:linear-gradient(135deg,#15803d,#166534);
  border-radius:12px; padding:14px 20px;
  font-size:15px; font-weight:700; color:#fff;
  box-shadow:0 4px 16px rgba(22,163,74,0.4);
}
.btn-icon { font-size:20px; }
.btn-text { display:flex; flex-direction:column; gap:1px; }
.btn-sub { font-size:11px; font-weight:500; opacity:0.8; }

/* small preview cards */
.preview-row { display:flex; gap:10px; }
.prev-card {
  flex:1; background:${C.card}; border-radius:12px; padding:12px 14px;
  border:1px solid #334155;
}
.pc-name { font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.06em; color:${C.text4}; margin-bottom:4px; }
.pc-time { font-size:13px; font-weight:600; color:${C.text2}; }
.pc-dot { width:4px; height:36px; border-radius:99px; background:${C.accent}; }
.pc-inner { display:flex; gap:10px; align-items:center; }
</style>
</head><body>
<div class="root">
  <div class="top-rule"></div>
  <div class="glow-tl"></div>
  <div class="glow-br"></div>

  <!-- copy left -->
  <div class="copy">
    <span class="pill">Calendar Export</span>
    <div class="headline">Send it straight<br><span class="grad">to your calendar</span></div>
    <div class="desc">Export your planned week directly to Google Calendar or download as a standard .ics file — one click, zero friction.</div>
    <div class="feature-list">
      <div class="feat-item"><span class="feat-dot"></span>Add directly to Google Calendar</div>
      <div class="feat-item"><span class="feat-dot"></span>Download .ics for any calendar app</div>
      <div class="feat-item"><span class="feat-dot"></span>Pick any calendar week to export</div>
    </div>
    <div class="logo-row">${LOGO_SVG}<span class="logo-small">Weeklie</span></div>
  </div>

  <!-- export mockup right -->
  <div class="mockup">
    <!-- export panel -->
    <div class="export-panel">
      <div class="ep-title"><span class="ep-title-icon">📤</span> Export to Calendar</div>
      <div class="cw-row">
        <div>
          <div class="cw-label">Calendar Week</div>
          <div class="cw-value">CW 14</div>
          <div class="cw-dates">31 Mar – 4 Apr 2025</div>
        </div>
        <div class="cw-nav">
          <div class="cw-btn">‹</div>
          <div class="cw-btn">›</div>
        </div>
      </div>
      <div class="divider"></div>
      <div class="export-btns">
        <div class="btn-gcal">
          <span class="btn-icon">📅</span>
          <div class="btn-text">
            <span>Add to Google Calendar</span>
            <span class="btn-sub">Opens Google Calendar in a new tab</span>
          </div>
        </div>
        <div class="btn-ics">
          <span class="btn-icon">⬇</span>
          <div class="btn-text">
            <span>Download .ics File</span>
            <span class="btn-sub">Import into Outlook, Apple Calendar &amp; more</span>
          </div>
        </div>
      </div>
    </div>

    <!-- mini preview row -->
    <div class="preview-row">
      ${[
        { d:'MON', t:'09:00 – 17:00' },
        { d:'TUE', t:'09:00 – 16:30' },
        { d:'WED', t:'09:00 – 17:00' },
        { d:'THU', t:'09:00 – 16:00' },
        { d:'FRI', t:'09:00 – 17:00' },
      ].map(day => `
      <div class="prev-card">
        <div class="pc-name">${day.d}</div>
        <div class="pc-inner">
          <div class="pc-dot"></div>
          <div class="pc-time">${day.t}</div>
        </div>
      </div>`).join('')}
    </div>
  </div>
</div>
</body></html>`,
  },
];

// ── Render with Playwright ─────────────────────────────────────────────────
(async () => {
  const browser = await chromium.launch();
  const page    = await browser.newPage();
  await page.setViewportSize({ width: 1200, height: 630 });

  for (const asset of assets) {
    console.log(`Rendering: ${asset.name}…`);
    await page.setContent(asset.html, { waitUntil: 'domcontentloaded' });
    // Extra wait for font load
    await page.waitForTimeout(1200);
    const outPath = path.join(OUTPUT_DIR, `${asset.name}.png`);
    await page.screenshot({ path: outPath, type: 'png', clip: { x:0, y:0, width:1200, height:630 } });
    console.log(`  → saved ${outPath}`);
  }

  await browser.close();
  console.log('\nAll 4 marketing assets generated.');
})();
