import { useState, useCallback } from "react";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const MIN_START = 5;
const MAX_START = 11;
const MIN_END = 13;
const MAX_END = 22;
const LUNCH_OPTIONS = [0, 15, 30, 45, 60, 80, 100, 120, 140];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function toTime(h) {
  const totalMins = Math.round(h * 60 / 15) * 15;
  const hh = Math.floor(totalMins / 60);
  const mm = totalMins % 60;
  return String(hh).padStart(2,"0") + ":" + String(mm).padStart(2,"0");
}

function dayHours(start, end, lunch) {
  return Math.max(0, end - start - lunch / 60);
}

function defaultDay() {
  return { start: 8, end: 17, lunch: 30, lunchStart: 12, locked: false, offDay: false, offHours: 8 };
}

function effectiveHours(d) {
  return d.offDay ? d.offHours : dayHours(d.start, d.end, d.lunch);
}

function clampLunchStart(lunchStart, start, end, lunch) {
  const minLS = start + 0.5;
  const maxLS = end - lunch / 60 - 0.25;
  return Math.min(maxLS, Math.max(minLS, lunchStart));
}

function redistribute(days, changedIdx, weeklyTarget) {
  const unlocked = days.map((d, i) => i !== changedIdx && !d.locked && !d.offDay ? i : null).filter(i => i !== null);
  const lockedHours = days.reduce((sum, d, i) => i === changedIdx || d.locked || d.offDay ? sum + effectiveHours(d) : sum, 0);
  if (unlocked.length === 0) return days;
  const remaining = weeklyTarget - lockedHours;
  const perDay = remaining / unlocked.length;
  return days.map((d, i) => {
    if (i === changedIdx || d.locked || d.offDay || !unlocked.includes(i)) return d;
    const newEnd = Math.min(MAX_END, Math.max(MIN_END, d.start + perDay + d.lunch / 60));
    const rounded = Math.round(newEnd * 4) / 4;
    return { ...d, end: rounded, lunchStart: clampLunchStart(d.lunchStart, d.start, rounded, d.lunch) };
  });
}

function getMondayOf(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d;
}

function addDays(date, n) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + n);
}

function formatDateLocal(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return y + "" + m + "" + d;
}

function toICSTime(h, dateStr) {
  const totalMins = Math.round(h * 60 / 15) * 15;
  const hh = Math.floor(totalMins / 60);
  const mm = totalMins % 60;
  return dateStr + "T" + String(hh).padStart(2,"0") + String(mm).padStart(2,"0") + "00";
}

function buildICS(days, startMonday) {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Weeklie//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VTIMEZONE",
    "TZID:Europe/Berlin",
    "BEGIN:STANDARD",
    "DTSTART:19701025T030000",
    "RRULE:FREQ=YEARLY;BYDAY=-1SU;BYMONTH=10",
    "TZOFFSETFROM:+0200",
    "TZOFFSETTO:+0100",
    "TZNAME:CET",
    "END:STANDARD",
    "BEGIN:DAYLIGHT",
    "DTSTART:19700329T020000",
    "RRULE:FREQ=YEARLY;BYDAY=-1SU;BYMONTH=3",
    "TZOFFSETFROM:+0100",
    "TZOFFSETTO:+0200",
    "TZNAME:CEST",
    "END:DAYLIGHT",
    "END:VTIMEZONE",
  ];

  days.forEach(function(d, i) {
    if (d.offDay) return;
    const dayDate = addDays(startMonday, i);
    const dateStr = formatDateLocal(dayDate);
    const lunchEnd = d.lunch > 0 ? d.lunchStart + d.lunch / 60 : null;

    function addEvent(uid, start, end, title, desc) {
      lines.push("BEGIN:VEVENT");
      lines.push("UID:" + uid);
      lines.push("DTSTART;TZID=Europe/Berlin:" + toICSTime(start, dateStr));
      lines.push("DTEND;TZID=Europe/Berlin:" + toICSTime(end, dateStr));
      lines.push("SUMMARY:" + title);
      lines.push("DESCRIPTION:" + desc);
      lines.push("END:VEVENT");
    }

    if (d.lunch > 0) {
      addEvent("weeklie-" + dateStr + "-" + i + "-morning", d.start, d.lunchStart, "Planned Working Block", "Morning block " + dayHours(d.start, d.lunchStart, 0).toFixed(1) + "h");
      addEvent("weeklie-" + dateStr + "-" + i + "-lunch", d.lunchStart, lunchEnd, "Lunch Break", d.lunch + " min lunch break");
      addEvent("weeklie-" + dateStr + "-" + i + "-afternoon", lunchEnd, d.end, "Planned Working Block", "Afternoon block " + dayHours(lunchEnd, d.end, 0).toFixed(1) + "h");
    } else {
      addEvent("weeklie-" + dateStr + "-" + i + "-work", d.start, d.end, "Planned Working Block", "Full day " + dayHours(d.start, d.end, 0).toFixed(1) + "h");
    }
  });

  lines.push("END:VCALENDAR");
  return lines.join("\r\n") + "\r\n";
}

function buildGCalUrl(d, dayDate) {
  const dateStr = formatDateLocal(dayDate);
  const lunchEnd = d.lunch > 0 ? d.lunchStart + d.lunch / 60 : null;
  const urls = [];

  function makeUrl(start, end, title, details) {
    const s = toICSTime(start, dateStr).slice(9);
    const e = toICSTime(end, dateStr).slice(9);
    return "https://calendar.google.com/calendar/render?action=TEMPLATE&text=" + encodeURIComponent(title) + "&dates=" + dateStr + "T" + s + "/" + dateStr + "T" + e + "&details=" + encodeURIComponent(details) + "&ctz=Europe/Berlin";
  }

  if (d.lunch > 0) {
    urls.push(makeUrl(d.start, d.lunchStart, "Planned Working Block", "Morning block " + dayHours(d.start, d.lunchStart, 0).toFixed(1) + "h"));
    urls.push(makeUrl(d.lunchStart, lunchEnd, "Lunch Break", d.lunch + " min lunch break"));
    urls.push(makeUrl(lunchEnd, d.end, "Planned Working Block", "Afternoon block " + dayHours(lunchEnd, d.end, 0).toFixed(1) + "h"));
  } else {
    urls.push(makeUrl(d.start, d.end, "Planned Working Block", "Full day " + dayHours(d.start, d.end, 0).toFixed(1) + "h"));
  }
  return urls;
}

function ICSDownloadLink({ days, startDate, onError }) {
  const [href, setHref] = useState(null);

  function generate() {
    if (!startDate) { onError("Please pick a start date first."); return; }
    const monday = getMondayOf(startDate);
    const ics = buildICS(days, monday);
    const encoded = btoa(unescape(encodeURIComponent(ics)));
    setHref("data:text/calendar;base64," + encoded);
  }

  const baseStyle = {
    border: "none", borderRadius: 10, padding: "10px 18px",
    color: "#fff", fontSize: "0.85rem", cursor: "pointer",
    fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 8
  };

  if (href) {
    return (
      <a href={href} download="weeklie.ics" style={Object.assign({}, baseStyle, { background: "#22c55e", textDecoration: "none" })} onClick={function() { setTimeout(function() { setHref(null); }, 2000); }}>
        Save weeklie.ics
      </a>
    );
  }
  return (
    <button onClick={generate} style={Object.assign({}, baseStyle, { background: "#334155" })}>
      Download .ics file
    </button>
  );
}

export default function App() {
  const [weekly, setWeekly] = useState(40);
  const [carryOver, setCarryOver] = useState(0);
  const [days, setDays] = useState(DAYS.map(defaultDay));
  const [startDate, setStartDate] = useState("");
  const [exportMsg, setExportMsg] = useState("");

  const effectiveTarget = Math.max(0, weekly - carryOver);
  const totalHours = days.reduce((s, d) => s + effectiveHours(d), 0);
  const diff = totalHours - effectiveTarget;
  const pct = Math.min(100, (totalHours / effectiveTarget) * 100);
  const barColor = Math.abs(diff) < 0.1 ? "#22c55e" : diff > 0 ? "#ef4444" : "#f59e0b";

  const updateDay = useCallback((idx, field, value) => {
    setDays(prev => {
      const next = prev.map((d, i) => {
        if (i !== idx) return d;
        const updated = Object.assign({}, d, { [field]: value });
        if (field !== "locked" && field !== "offDay" && field !== "offHours") {
          updated.lunchStart = clampLunchStart(updated.lunchStart, updated.start, updated.end, updated.lunch);
        }
        return updated;
      });
      if (field === "locked") return next;
      return redistribute(next, idx, weekly);
    });
  }, [weekly]);

  const handleWeekly = (val) => {
    const w = Math.max(1, Math.min(80, val));
    setWeekly(w);
    setDays(prev => {
      const fixedHours = prev.reduce((sum, d) => d.locked || d.offDay ? sum + effectiveHours(d) : sum, 0);
      const activeCount = prev.filter(d => !d.locked && !d.offDay).length;
      const perDay = activeCount > 0 ? (w - fixedHours) / activeCount : 0;
      return prev.map(d => {
        if (d.locked || d.offDay) return d;
        const newEnd = Math.min(MAX_END, Math.round((d.start + perDay + d.lunch / 60) * 4) / 4);
        return Object.assign({}, d, { end: newEnd, lunchStart: clampLunchStart(d.lunchStart, d.start, newEnd, d.lunch) });
      });
    });
  };

  const handleGoogleCalendar = () => {
    if (!startDate) { setExportMsg("Please pick a start date first."); setTimeout(() => setExportMsg(""), 4000); return; }
    const monday = getMondayOf(startDate);
    days.forEach((d, i) => {
      if (d.offDay) return;
      buildGCalUrl(d, addDays(monday, i)).forEach(url => window.open(url, "_blank"));
    });
    setExportMsg("Opened Google Calendar tabs!");
    setTimeout(() => setExportMsg(""), 4000);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0f172a", color: "#e2e8f0", fontFamily: "'Inter', sans-serif", padding: "2rem 1rem" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>

        <div style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: 2 }}>
            <h1 style={{ fontSize: "2.4rem", fontWeight: 800, color: "#f8fafc", margin: 0, letterSpacing: "-0.03em" }}>Weeklie</h1>
            <a
              href="https://tally.so/r/zxNrGM"
              target="_blank"
              rel="noopener noreferrer"
              title="Share feedback"
              style={{ display: "flex", alignItems: "center", color: "#475569", transition: "color 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.color = "#94a3b8"}
              onMouseLeave={e => e.currentTarget.style.color = "#475569"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </a>
          </div>
          <p style={{ fontSize: "1rem", color: "#94a3b8", fontWeight: 500, margin: "0 0 8px 0" }}>Weekly Work Planner</p>
          <p style={{ fontSize: "0.88rem", color: "#64748b", margin: 0, maxWidth: 480, lineHeight: 1.6 }}>An easy and simple way to plan your work week schedule, so you always stay on top of your hours.</p>
          <span style={{ display: "inline-block", marginTop: 8, fontSize: "0.72rem", color: "#334155", fontWeight: 600, letterSpacing: "0.05em" }}>v{__APP_VERSION__}</span>
        </div>

        {/* Sticky weekly target */}
        <div style={{ position: "sticky", top: 12, zIndex: 100, background: "linear-gradient(135deg, #1e1b4b 0%, #1e293b 100%)", borderRadius: 16, padding: "1.25rem 1.5rem", marginBottom: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem", boxShadow: "0 8px 32px rgba(0,0,0,0.6), 0 0 0 1.5px #6366f1", backdropFilter: "blur(12px)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>Weekly Target</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <button onClick={() => handleWeekly(weekly - 1)} style={btnStyle}>-</button>
                <span style={{ fontSize: "2rem", fontWeight: 700, color: "#f8fafc", minWidth: 70, textAlign: "center" }}>{weekly}h</span>
                <button onClick={() => handleWeekly(weekly + 1)} style={btnStyle}>+</button>
              </div>
            </div>
            <div style={{ borderLeft: "1px solid #334155", paddingLeft: "1.25rem" }}>
              <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>Carry-over</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <button onClick={() => setCarryOver(v => Math.round((v - 1/60) * 60) / 60)} style={btnStyle}>-</button>
                <span style={{ fontSize: "1.5rem", fontWeight: 700, minWidth: 80, textAlign: "center", color: carryOver > 0 ? "#22c55e" : carryOver < 0 ? "#ef4444" : "#f8fafc" }}>
                  {carryOver > 0 ? "+" : ""}{Math.floor(Math.abs(carryOver))}h {String(Math.round((Math.abs(carryOver) % 1) * 60)).padStart(2,"0")}m{carryOver < 0 ? " owed" : ""}
                </span>
                <button onClick={() => setCarryOver(v => Math.round((v + 1/60) * 60) / 60)} style={btnStyle}>+</button>
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 180 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: 6 }}>
                <span style={{ color: "#94a3b8" }}>Planned: <strong style={{ color: "#f8fafc" }}>{totalHours.toFixed(1)}h</strong>
                  {carryOver !== 0 && <span style={{ color: "#64748b" }}> / needed: <strong style={{ color: "#cbd5e1" }}>{effectiveTarget.toFixed(1)}h</strong></span>}
                </span>
                <span style={{ color: barColor, fontWeight: 600 }}>
                  {Math.abs(diff) < 0.05 ? "On target" : diff > 0 ? "+" + diff.toFixed(1) + "h over" : Math.abs(diff).toFixed(1) + "h to go"}
                </span>
              </div>
              <div style={{ background: "#334155", borderRadius: 99, height: 10, overflow: "hidden" }}>
                <div style={{ width: pct + "%", background: barColor, height: "100%", borderRadius: 99, transition: "all 0.3s" }} />
              </div>
              {carryOver !== 0 && (
                <div style={{ fontSize: "0.72rem", color: "#475569", marginTop: 5 }}>
                  {carryOver > 0 ? "+" + carryOver.toFixed(1) + "h carry-over reduces target to " + effectiveTarget.toFixed(1) + "h" : carryOver.toFixed(1) + "h carry-over increases target to " + effectiveTarget.toFixed(1) + "h"}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Days */}
        {days.map((d, i) => {
          const dh = dayHours(d.start, d.end, d.lunch);
          const lunchEnd = d.lunch > 0 ? d.lunchStart + d.lunch / 60 : null;
          const lunchMinStart = d.start + 0.5;
          const lunchMaxStart = d.end - d.lunch / 60 - 0.25;
          const borderColor = d.offDay ? "1.5px solid #f59e0b" : d.locked ? "1.5px solid #6366f1" : "1.5px solid transparent";
          return (
            <div key={DAYS[i]} style={{ background: "#1e293b", borderRadius: 16, padding: "1.25rem 1.5rem", marginBottom: "1rem", border: borderColor, opacity: d.offDay ? 0.75 : 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: d.offDay ? "0.75rem" : "1rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontWeight: 700, fontSize: "1rem", color: d.offDay ? "#94a3b8" : "#f8fafc" }}>{DAYS[i]}</span>
                  {d.offDay
                    ? <span style={{ background: "#f59e0b22", padding: "2px 10px", borderRadius: 99, fontSize: "0.8rem", color: "#f59e0b", fontWeight: 600 }}>Off</span>
                    : <span style={{ background: "#0f172a", padding: "2px 10px", borderRadius: 99, fontSize: "0.8rem", color: "#94a3b8" }}>{dh.toFixed(1)}h</span>
                  }
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  {!d.offDay && (
                    <button onClick={() => updateDay(i, "locked", !d.locked)} style={{ background: d.locked ? "#6366f1" : "#334155", border: "none", borderRadius: 8, padding: "4px 10px", color: "#f8fafc", cursor: "pointer", fontSize: "0.75rem", fontWeight: 600 }}>
                      {d.locked ? "Locked" : "Lock"}
                    </button>
                  )}
                  <button onClick={() => updateDay(i, "offDay", !d.offDay)} style={{ background: d.offDay ? "#f59e0b" : "#334155", border: "none", borderRadius: 8, padding: "4px 10px", color: d.offDay ? "#0f172a" : "#f8fafc", cursor: "pointer", fontSize: "0.75rem", fontWeight: 600 }}>
                    {d.offDay ? "Off Day" : "Off"}
                  </button>
                </div>
              </div>
              {d.offDay ? (
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <span style={{ fontSize: "0.78rem", color: "#64748b" }}>Counts as</span>
                  <button onClick={() => updateDay(i, "offHours", Math.max(0, Math.round((d.offHours - 0.5) * 2) / 2))} style={btnStyle}>-</button>
                  <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "#f59e0b", minWidth: 46, textAlign: "center" }}>{d.offHours}h</span>
                  <button onClick={() => updateDay(i, "offHours", Math.min(12, Math.round((d.offHours + 0.5) * 2) / 2))} style={btnStyle}>+</button>
                  <span style={{ fontSize: "0.72rem", color: "#475569" }}>· not exported to calendar</span>
                </div>
              ) : (
                <>
                  <SliderRow label="Start" value={d.start} min={MIN_START} max={Math.min(d.end - 1, MAX_START)} step={0.25} display={toTime(d.start)} onChange={v => updateDay(i, "start", v)} color="#6366f1" />
                  <SliderRow label="End" value={d.end} min={Math.max(d.start + 1, MIN_END)} max={MAX_END} step={0.25} display={toTime(d.end)} onChange={v => updateDay(i, "end", v)} color="#818cf8" />
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10, flexWrap: "wrap" }}>
                    <span style={{ fontSize: "0.78rem", color: "#64748b", width: 36 }}>Lunch</span>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {LUNCH_OPTIONS.map(opt => (
                        <button key={opt} onClick={() => updateDay(i, "lunch", opt)} style={{ background: d.lunch === opt ? "#6366f1" : "#0f172a", color: d.lunch === opt ? "#fff" : "#94a3b8", border: "none", borderRadius: 8, padding: "4px 9px", fontSize: "0.75rem", cursor: "pointer", fontWeight: 600 }}>
                          {opt === 0 ? "None" : opt + "m"}
                        </button>
                      ))}
                    </div>
                  </div>
                  {d.lunch > 0 && (
                    <div style={{ marginTop: 8, background: "#0f172a", borderRadius: 10, padding: "10px 12px" }}>
                      <SliderRow label="Lunch" value={d.lunchStart} min={lunchMinStart} max={lunchMaxStart} step={0.25} display={toTime(d.lunchStart) + " - " + toTime(lunchEnd)} onChange={v => updateDay(i, "lunchStart", v)} color="#f59e0b" wide={true} />
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", color: "#475569", marginTop: 4, paddingLeft: 46 }}>
                        <span>Morning: {dayHours(d.start, d.lunchStart, 0).toFixed(1)}h</span>
                        <span>Afternoon: {dayHours(lunchEnd, d.end, 0).toFixed(1)}h</span>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}

        {/* Export */}
        <div style={{ background: "#1e293b", borderRadius: 16, padding: "1.5rem", marginTop: "0.5rem" }}>
          <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#f8fafc", marginBottom: "1rem" }}>Export to Calendar</div>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ fontSize: "0.8rem", color: "#94a3b8", display: "block", marginBottom: 8 }}>Week starting:</label>
            <InlineDatePicker value={startDate} onChange={setStartDate} />
            {startDate && (
              <span style={{ fontSize: "0.78rem", color: "#64748b", display: "block", marginTop: 8 }}>
                {"Week of " + getMondayOf(startDate).toLocaleDateString("en-DE", { day: "numeric", month: "short", year: "numeric" })}
              </span>
            )}
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button onClick={handleGoogleCalendar} style={{ border: "none", borderRadius: 10, padding: "10px 18px", color: "#fff", fontSize: "0.85rem", cursor: "pointer", fontWeight: 600, background: "#4285f4" }}>
              Add to Google Calendar
            </button>
            <ICSDownloadLink days={days} startDate={startDate} onError={msg => { setExportMsg(msg); setTimeout(() => setExportMsg(""), 4000); }} />
          </div>
          {exportMsg && <div style={{ marginTop: 10, fontSize: "0.82rem", color: "#22c55e", fontWeight: 600 }}>{exportMsg}</div>}
          <p style={{ fontSize: "0.75rem", color: "#475569", marginTop: 10, marginBottom: 0 }}>Days with lunch export 3 events: morning block, lunch break, and afternoon block.</p>
        </div>

        <p style={{ textAlign: "center", color: "#334155", fontSize: "0.75rem", marginTop: "1.5rem" }}>Adjust any day — unlocked days auto-balance to meet your weekly target</p>
      </div>
    </div>
  );
}

function SliderRow({ label, value, min, max, step, display, onChange, color, wide }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
      <span style={{ fontSize: "0.78rem", color: "#64748b", width: 36 }}>{label}</span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(parseFloat(e.target.value))} style={{ flex: 1, accentColor: color, cursor: "pointer" }} />
      <span style={{ fontSize: "0.82rem", color: "#cbd5e1", width: wide ? 90 : 44, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{display}</span>
    </div>
  );
}

function InlineDatePicker({ value, onChange }) {
  const today = new Date();
  const init = value ? new Date(value + "T00:00:00") : today;
  const [view, setView] = useState({ month: init.getMonth(), year: init.getFullYear() });
  const firstDay = new Date(view.year, view.month, 1);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(view.year, view.month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  const prevMonth = () => setView(v => v.month === 0 ? { month: 11, year: v.year - 1 } : { month: v.month - 1, year: v.year });
  const nextMonth = () => setView(v => v.month === 11 ? { month: 0, year: v.year + 1 } : { month: v.month + 1, year: v.year });
  const selectDay = (d) => onChange(view.year + "-" + String(view.month + 1).padStart(2,"0") + "-" + String(d).padStart(2,"0"));
  return (
    <div style={{ background: "#0f172a", borderRadius: 12, padding: "12px", display: "inline-block", border: "1.5px solid #334155" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <button onClick={prevMonth} style={navBtn}>&#8249;</button>
        <span style={{ fontWeight: 700, fontSize: "0.85rem", color: "#f8fafc" }}>{MONTHS[view.month]} {view.year}</span>
        <button onClick={nextMonth} style={navBtn}>&#8250;</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 32px)", gap: 2 }}>
        {["Mo","Tu","We","Th","Fr","Sa","Su"].map(d => <div key={d} style={{ textAlign: "center", fontSize: "0.7rem", color: "#475569", fontWeight: 700, padding: "2px 0" }}>{d}</div>)}
        {cells.map((d, i) => {
          if (!d) return <div key={"e" + i} />;
          const dateStr = view.year + "-" + String(view.month + 1).padStart(2,"0") + "-" + String(d).padStart(2,"0");
          const isSelected = value === dateStr;
          const isToday = today.getFullYear() === view.year && today.getMonth() === view.month && today.getDate() === d;
          return <button key={d} onClick={() => selectDay(d)} style={{ width: 32, height: 32, borderRadius: 8, border: "none", background: isSelected ? "#6366f1" : isToday ? "#1e3a5f" : "transparent", color: isSelected ? "#fff" : isToday ? "#93c5fd" : "#cbd5e1", fontWeight: isSelected || isToday ? 700 : 400, fontSize: "0.82rem", cursor: "pointer" }}>{d}</button>;
        })}
      </div>
    </div>
  );
}

const navBtn = { background: "#1e293b", border: "none", borderRadius: 8, width: 28, height: 28, color: "#f8fafc", fontSize: "1.1rem", cursor: "pointer", fontWeight: 700 };
const btnStyle = { background: "#334155", border: "none", borderRadius: 8, width: 32, height: 32, color: "#f8fafc", fontSize: "1.1rem", cursor: "pointer", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" };
