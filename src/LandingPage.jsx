import { useNavigate } from 'react-router-dom';

const ACCENT = '#6366f1';
const ACCENT_LIGHT = '#818cf8';
const BG = '#0f172a';
const CARD = '#1e293b';
const CARD2 = '#334155';
const TEXT = '#f8fafc';
const TEXT2 = '#cbd5e1';
const TEXT3 = '#94a3b8';
const TEXT4 = '#64748b';
const GREEN = '#22c55e';
const AMBER = '#f59e0b';
const RED = '#ef4444';

function CTAButton({ children, large }) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate('/app')}
      style={{
        background: `linear-gradient(135deg, ${ACCENT} 0%, #4f46e5 100%)`,
        border: 'none',
        borderRadius: large ? 14 : 10,
        padding: large ? '16px 40px' : '12px 28px',
        color: '#fff',
        fontSize: large ? '1.1rem' : '0.95rem',
        fontWeight: 700,
        cursor: 'pointer',
        fontFamily: 'inherit',
        boxShadow: `0 4px 24px rgba(99,102,241,0.4)`,
        transition: 'transform 0.15s, box-shadow 0.15s',
        letterSpacing: '-0.01em',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 32px rgba(99,102,241,0.5)`; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 4px 24px rgba(99,102,241,0.4)`; }}
    >
      {children}
    </button>
  );
}

/* ── Mockup UI pieces ─────────────────────────────────────────────── */

function MockProgressPanel({ planned, target, carryOver }) {
  const pct = Math.min(100, (planned / target) * 100);
  const diff = planned - target;
  const barColor = Math.abs(diff) < 0.1 ? GREEN : diff > 0 ? RED : AMBER;
  const status = Math.abs(diff) < 0.1 ? 'On target' : diff > 0 ? `+${diff.toFixed(1)}h over` : `${Math.abs(diff).toFixed(1)}h to go`;

  return (
    <div style={{
      background: 'linear-gradient(135deg, #1e1b4b 0%, #1e293b 100%)',
      borderRadius: 16,
      padding: '1.25rem 1.5rem',
      border: `1.5px solid ${ACCENT}`,
      boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: '0.7rem', color: TEXT3, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Weekly Target</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <MockBtn>-</MockBtn>
            <span style={{ fontSize: '2rem', fontWeight: 700, color: TEXT, minWidth: 64, textAlign: 'center' }}>40h</span>
            <MockBtn>+</MockBtn>
          </div>
        </div>
        {carryOver && (
          <div style={{ borderLeft: `1px solid ${CARD2}`, paddingLeft: '1.25rem' }}>
            <div style={{ fontSize: '0.7rem', color: TEXT3, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Carry-over</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <MockBtn>-</MockBtn>
              <span style={{ fontSize: '1.4rem', fontWeight: 700, minWidth: 76, textAlign: 'center', color: GREEN }}>+2h 00m</span>
              <MockBtn>+</MockBtn>
            </div>
          </div>
        )}
        <div style={{ flex: 1, minWidth: 180 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: 6 }}>
            <span style={{ color: TEXT3 }}>Planned: <strong style={{ color: TEXT }}>{planned.toFixed(1)}h</strong></span>
            <span style={{ color: barColor, fontWeight: 600 }}>{status}</span>
          </div>
          <div style={{ background: CARD2, borderRadius: 99, height: 10, overflow: 'hidden' }}>
            <div style={{ width: pct + '%', background: barColor, height: '100%', borderRadius: 99 }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function MockBtn({ children }) {
  return (
    <div style={{
      background: CARD2,
      borderRadius: 8,
      width: 32,
      height: 32,
      color: TEXT,
      fontSize: '1.1rem',
      fontWeight: 700,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      userSelect: 'none',
    }}>{children}</div>
  );
}

function MockSlider({ label, pct, display, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
      <span style={{ fontSize: '0.75rem', color: TEXT4, width: 36 }}>{label}</span>
      <div style={{ flex: 1, height: 4, background: CARD2, borderRadius: 99, position: 'relative' }}>
        <div style={{ width: pct + '%', height: '100%', background: color, borderRadius: 99 }} />
        <div style={{
          position: 'absolute',
          left: `calc(${pct}% - 7px)`,
          top: -4,
          width: 12,
          height: 12,
          borderRadius: '50%',
          background: color,
          border: '2px solid #fff',
        }} />
      </div>
      <span style={{ fontSize: '0.82rem', color: TEXT2, width: 44, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{display}</span>
    </div>
  );
}

function MockPausePills({ selected }) {
  const opts = ['None', '15m', '30m', '45m', '60m'];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6, flexWrap: 'wrap' }}>
      <span style={{ fontSize: '0.75rem', color: TEXT4, width: 36 }}>Pause</span>
      <div style={{ display: 'flex', gap: 5 }}>
        {opts.map(o => (
          <div key={o} style={{
            background: o === selected ? ACCENT : BG,
            color: o === selected ? '#fff' : TEXT3,
            borderRadius: 8,
            padding: '3px 9px',
            fontSize: '0.73rem',
            fontWeight: 600,
          }}>{o}</div>
        ))}
      </div>
    </div>
  );
}

function MockDayCard({ day, hours, locked, offDay, offHours, startPct, endPct, pause, dimmed }) {
  const borderColor = offDay ? `1.5px solid ${AMBER}` : locked ? `1.5px solid ${ACCENT}` : '1.5px solid transparent';
  return (
    <div style={{
      background: CARD,
      borderRadius: 16,
      padding: '1.1rem 1.25rem',
      border: borderColor,
      opacity: dimmed ? 0.45 : offDay ? 0.8 : 1,
      transition: 'opacity 0.3s',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: offDay ? '0.6rem' : '0.9rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontWeight: 700, fontSize: '0.95rem', color: offDay ? TEXT3 : TEXT }}>{day}</span>
          {offDay
            ? <span style={{ background: '#f59e0b22', padding: '2px 10px', borderRadius: 99, fontSize: '0.76rem', color: AMBER, fontWeight: 600 }}>Off</span>
            : <span style={{ background: BG, padding: '2px 10px', borderRadius: 99, fontSize: '0.76rem', color: TEXT3 }}>{hours}h</span>
          }
        </div>
        <div style={{ display: 'flex', gap: 5 }}>
          {!offDay && (
            <div style={{ background: locked ? ACCENT : CARD2, borderRadius: 8, padding: '3px 10px', color: '#f8fafc', fontSize: '0.72rem', fontWeight: 600 }}>
              {locked ? 'Locked' : 'Lock'}
            </div>
          )}
          <div style={{ background: offDay ? AMBER : CARD2, borderRadius: 8, padding: '3px 10px', color: offDay ? BG : TEXT, fontSize: '0.72rem', fontWeight: 600 }}>
            {offDay ? 'Off Day' : 'Off'}
          </div>
        </div>
      </div>
      {offDay ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: '0.75rem', color: TEXT4 }}>Counts as</span>
          <MockBtn>-</MockBtn>
          <span style={{ fontSize: '1rem', fontWeight: 700, color: AMBER, minWidth: 40, textAlign: 'center' }}>{offHours}h</span>
          <MockBtn>+</MockBtn>
          <span style={{ fontSize: '0.7rem', color: TEXT4 }}>· not exported to calendar</span>
        </div>
      ) : (
        <>
          <MockSlider label="Start" pct={startPct ?? 40} display="08:00" color={ACCENT} />
          <MockSlider label="End" pct={endPct ?? 75} display="17:00" color={ACCENT_LIGHT} />
          {pause && <MockPausePills selected="30m" />}
        </>
      )}
    </div>
  );
}

function MockCWExport() {
  return (
    <div style={{ background: CARD, borderRadius: 16, padding: '1.5rem' }}>
      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: TEXT, marginBottom: '1rem' }}>Export to Calendar</div>
      <div style={{ marginBottom: '1rem' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 14,
          background: BG,
          borderRadius: 12,
          padding: '10px 14px',
          border: `1.5px solid ${CARD2}`,
        }}>
          <div style={{ background: CARD, borderRadius: 8, width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', color: TEXT, fontSize: '1.1rem', fontWeight: 700 }}>‹</div>
          <div style={{ textAlign: 'center', minWidth: 170 }}>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: TEXT }}>CW 14</div>
            <div style={{ fontSize: '0.75rem', color: TEXT4, marginTop: 3 }}>31 Mar – 4 Apr 2025</div>
          </div>
          <div style={{ background: CARD, borderRadius: 8, width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', color: TEXT, fontSize: '1.1rem', fontWeight: 700 }}>›</div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <div style={{ background: '#4285f4', borderRadius: 10, padding: '10px 18px', color: '#fff', fontSize: '0.82rem', fontWeight: 600 }}>
          Add to Google Calendar
        </div>
        <div style={{ background: GREEN, borderRadius: 10, padding: '10px 18px', color: '#fff', fontSize: '0.82rem', fontWeight: 600 }}>
          Save weeklie.ics
        </div>
      </div>
      <p style={{ fontSize: '0.72rem', color: TEXT4, marginTop: 10, marginBottom: 0 }}>
        Days with a pause export 3 events: morning block, pause, and afternoon block.
      </p>
    </div>
  );
}

/* ── Section wrapper ──────────────────────────────────────────────── */
function Section({ children, style }) {
  return (
    <section style={{ padding: '80px 1rem', ...style }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        {children}
      </div>
    </section>
  );
}

function FeatureLabel({ text }) {
  return (
    <div style={{
      display: 'inline-block',
      background: `${ACCENT}22`,
      color: ACCENT_LIGHT,
      borderRadius: 99,
      padding: '4px 14px',
      fontSize: '0.75rem',
      fontWeight: 700,
      letterSpacing: '0.05em',
      textTransform: 'uppercase',
      marginBottom: 16,
    }}>{text}</div>
  );
}

function FeatureHeading({ children }) {
  return (
    <h2 style={{
      fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)',
      fontWeight: 800,
      color: TEXT,
      margin: '0 0 12px 0',
      letterSpacing: '-0.03em',
      lineHeight: 1.2,
    }}>{children}</h2>
  );
}

function FeatureBody({ children }) {
  return (
    <p style={{
      fontSize: '1rem',
      color: TEXT3,
      lineHeight: 1.7,
      margin: '0 0 32px 0',
      maxWidth: 420,
    }}>{children}</p>
  );
}

/* ── Main component ───────────────────────────────────────────────── */
export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', background: BG, color: TEXT2, fontFamily: "'Inter', system-ui, -apple-system, sans-serif", overflowX: 'hidden' }}>

      {/* Nav */}
      <nav style={{ padding: '1.25rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: '1.2rem', fontWeight: 800, color: TEXT, letterSpacing: '-0.03em' }}>Weeklie</span>
        </div>
        <CTAButton>Open App</CTAButton>
      </nav>

      {/* Hero */}
      <section style={{ padding: 'clamp(60px, 10vw, 120px) 1rem clamp(60px, 8vw, 100px)', textAlign: 'center' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <div style={{
            display: 'inline-block',
            background: `${ACCENT}18`,
            border: `1px solid ${ACCENT}44`,
            borderRadius: 99,
            padding: '5px 16px',
            fontSize: '0.8rem',
            color: ACCENT_LIGHT,
            fontWeight: 600,
            marginBottom: 24,
            letterSpacing: '0.02em',
          }}>
            Free &amp; no sign-up required
          </div>

          <h1 style={{
            fontSize: 'clamp(2.4rem, 6vw, 3.8rem)',
            fontWeight: 800,
            color: TEXT,
            margin: '0 0 20px 0',
            letterSpacing: '-0.04em',
            lineHeight: 1.1,
          }}>
            Plan your work week.<br />
            <span style={{ background: `linear-gradient(135deg, ${ACCENT} 0%, #a78bfa 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Hit your hours every time.
            </span>
          </h1>

          <p style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.15rem)',
            color: TEXT3,
            lineHeight: 1.7,
            margin: '0 0 40px 0',
          }}>
            Weeklie balances your Monday–Friday schedule automatically so you always hit your weekly hour target — no spreadsheets, no stress.
          </p>

          <CTAButton large>Start planning for free →</CTAButton>

          <p style={{ fontSize: '0.8rem', color: TEXT4, marginTop: 16 }}>
            No account needed · Works in your browser
          </p>
        </div>

        {/* Hero mockup */}
        <div style={{ maxWidth: 720, margin: '64px auto 0', position: 'relative' }}>
          <div style={{
            position: 'absolute',
            inset: -40,
            background: `radial-gradient(ellipse at 50% 80%, ${ACCENT}28 0%, transparent 70%)`,
            pointerEvents: 'none',
          }} />
          <MockProgressPanel planned={37.5} target={40} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.75rem' }}>
            <MockDayCard day="Monday" hours="8.0" startPct={40} endPct={78} pause />
            <MockDayCard day="Tuesday" hours="7.5" startPct={40} endPct={72} locked />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginTop: '0.75rem' }}>
            <MockDayCard day="Wednesday" hours="8.0" startPct={40} endPct={78} dimmed />
            <MockDayCard day="Thursday" hours="8.0" startPct={40} endPct={78} dimmed />
            <MockDayCard day="Friday" hours="6.0" offDay offHours={6} dimmed />
          </div>
        </div>
      </section>

      {/* Feature 1: Smart Auto-Balance */}
      <Section style={{ background: `${CARD}55` }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'center' }}>
          <div>
            <FeatureLabel text="Smart Scheduling" />
            <FeatureHeading>Auto-balance across the week</FeatureHeading>
            <FeatureBody>
              Change your hours for one day and Weeklie instantly redistributes the remaining hours across your other days — keeping you right on target without any manual maths.
            </FeatureBody>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { label: 'Monday changed to 6h', color: ACCENT },
                { label: 'Tuesday auto-adjusted → 8.5h', color: GREEN },
                { label: 'Wednesday auto-adjusted → 8.5h', color: GREEN },
                { label: 'Thursday auto-adjusted → 9h', color: GREEN },
              ].map(({ label, color }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />
                  <span style={{ fontSize: '0.88rem', color: TEXT2 }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <MockDayCard day="Monday" hours="6.0" startPct={40} endPct={56} pause />
            <MockDayCard day="Tuesday" hours="8.5" startPct={40} endPct={83} />
            <MockDayCard day="Wednesday" hours="8.5" startPct={40} endPct={83} />
            <MockDayCard day="Thursday" hours="9.0" startPct={40} endPct={89} dimmed />
          </div>
        </div>
      </Section>

      {/* Feature 2: Progress Tracking */}
      <Section>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'center' }}>
          <div style={{ order: 2 }}>
            <FeatureLabel text="Progress Tracking" />
            <FeatureHeading>See your week at a glance</FeatureHeading>
            <FeatureBody>
              A sticky progress bar at the top always shows how many hours you've planned versus your target. It turns green when you're on track, amber when you have hours to fill, and red if you've gone over.
            </FeatureBody>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { label: 'On target', color: GREEN, pct: 100 },
                { label: '2.5h to go', color: AMBER, pct: 88 },
                { label: '1h over', color: RED, pct: 102 },
              ].map(({ label, color, pct }) => (
                <div key={label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: 5 }}>
                    <span style={{ color: TEXT3 }}>Planned: <strong style={{ color: TEXT }}>40.0h</strong></span>
                    <span style={{ color, fontWeight: 600 }}>{label}</span>
                  </div>
                  <div style={{ background: CARD2, borderRadius: 99, height: 10, overflow: 'hidden' }}>
                    <div style={{ width: Math.min(pct, 100) + '%', background: color, height: '100%', borderRadius: 99 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ order: 1 }}>
            <MockProgressPanel planned={40} target={40} />
          </div>
        </div>
      </Section>

      {/* Feature 3: Carry-over */}
      <Section style={{ background: `${CARD}55` }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'center' }}>
          <div>
            <FeatureLabel text="Carry-over" />
            <FeatureHeading>Bank hours from last week</FeatureHeading>
            <FeatureBody>
              Worked extra last week? Log it as a carry-over and this week's target automatically adjusts downwards. Owe hours? Add a negative carry-over to top up your target.
            </FeatureBody>
          </div>
          <div>
            <MockProgressPanel planned={38} target={38} carryOver />
          </div>
        </div>
      </Section>

      {/* Feature 4: Lock & Off days */}
      <Section>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <FeatureLabel text="Flexible Days" />
          <FeatureHeading>Lock days. Take days off.</FeatureHeading>
          <p style={{ fontSize: '1rem', color: TEXT3, lineHeight: 1.7, margin: '0 auto', maxWidth: 520 }}>
            Lock a day to stop it being touched by auto-balance. Mark a day as off and decide how many hours it counts — useful for bank holidays or partial days.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.75rem' }}>
          <div>
            <div style={{ fontSize: '0.72rem', color: ACCENT_LIGHT, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8, paddingLeft: 4 }}>Locked — won't auto-adjust</div>
            <MockDayCard day="Monday" hours="8.0" startPct={40} endPct={78} locked pause />
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', color: AMBER, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8, paddingLeft: 4 }}>Off day — counts toward target</div>
            <MockDayCard day="Friday" hours="0" offDay offHours={8} />
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', color: TEXT4, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8, paddingLeft: 4 }}>Regular — auto-balances freely</div>
            <MockDayCard day="Wednesday" hours="8.0" startPct={40} endPct={78} pause />
          </div>
        </div>
      </Section>

      {/* Feature 5: Calendar export */}
      <Section style={{ background: `${CARD}55` }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'center' }}>
          <div style={{ order: 2 }}>
            <FeatureLabel text="Calendar Export" />
            <FeatureHeading>Send it straight to your calendar</FeatureHeading>
            <FeatureBody>
              Once your week is planned, pick the calendar week with the CW picker and export directly to Google Calendar or download an .ics file for any other app. Morning blocks, pauses, and afternoon sessions are created as separate events.
            </FeatureBody>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { icon: '📅', text: 'Add to Google Calendar — one click, all events' },
                { icon: '📥', text: 'Download .ics for Apple Calendar, Outlook & more' },
                { icon: '☕', text: 'Pauses exported as separate events' },
              ].map(({ icon, text }) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: '1.1rem' }}>{icon}</span>
                  <span style={{ fontSize: '0.88rem', color: TEXT2 }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ order: 1 }}>
            <MockCWExport />
          </div>
        </div>
      </Section>

      {/* Feature grid — quick wins */}
      <Section>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <FeatureLabel text="Everything you need" />
          <FeatureHeading>Built for real work weeks</FeatureHeading>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
          {[
            { icon: '⏱', title: '15-min precision', body: 'Start, end, and pause times snap to 15-minute increments so your schedule stays clean.' },
            { icon: '🔒', title: 'Granular locks', body: 'Lock any combination of days. Unlocked days auto-balance around them.' },
            { icon: '🌍', title: 'Timezone-aware', body: 'Calendar exports include full timezone data — no appointments shifting on you.' },
            { icon: '📱', title: 'Mobile-friendly', body: 'Plan on your phone as easily as on your desktop. No app to download.' },
            { icon: '⚡', title: 'Instant', body: 'No sign-up, no loading spinner. Just open the page and start planning.' },
            { icon: '🔓', title: 'Free & open', body: 'No subscription, no ads, no tracking. Just a tool that does one thing well.' },
          ].map(({ icon, title, body }) => (
            <div key={title} style={{ background: CARD, borderRadius: 16, padding: '1.5rem' }}>
              <div style={{ fontSize: '1.6rem', marginBottom: 12 }}>{icon}</div>
              <div style={{ fontWeight: 700, color: TEXT, fontSize: '0.95rem', marginBottom: 8 }}>{title}</div>
              <div style={{ fontSize: '0.85rem', color: TEXT3, lineHeight: 1.6 }}>{body}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* Final CTA */}
      <section style={{ padding: 'clamp(60px, 8vw, 100px) 1rem', textAlign: 'center', background: `linear-gradient(180deg, ${BG} 0%, #1a1040 50%, ${BG} 100%)` }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <h2 style={{
            fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
            fontWeight: 800,
            color: TEXT,
            margin: '0 0 16px 0',
            letterSpacing: '-0.03em',
            lineHeight: 1.15,
          }}>
            Ready to plan a better week?
          </h2>
          <p style={{ fontSize: '1rem', color: TEXT3, lineHeight: 1.7, margin: '0 0 40px 0' }}>
            Takes less than a minute to set up. No account needed.
          </p>
          <CTAButton large>Open Weeklie →</CTAButton>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: `1px solid ${CARD2}`, padding: '1.5rem 2rem', textAlign: 'center', fontSize: '0.8rem', color: TEXT4 }}>
        <span style={{ fontWeight: 700, color: TEXT3 }}>Weeklie</span>
        {' '}· Weekly Work Planner ·{' '}
        <a href="https://tally.so/r/zxNrGM" target="_blank" rel="noopener noreferrer" style={{ color: TEXT4, textDecoration: 'underline' }}>Send feedback</a>
      </footer>

    </div>
  );
}
