import { useNavigate } from 'react-router-dom';

const ACCENT = '#6366f1';
const BG = '#0f172a';
const CARD = '#1e293b';
const CARD2 = '#334155';
const TEXT = '#f8fafc';
const TEXT2 = '#cbd5e1';
const TEXT3 = '#94a3b8';
const TEXT4 = '#64748b';

function Logo() {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate('/')}
      style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', width: 'fit-content' }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none" width="32" height="32" aria-hidden="true">
        <defs>
          <linearGradient id="privacy-logo-bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#4f46e5" />
          </linearGradient>
        </defs>
        <rect width="32" height="32" rx="8" fill="url(#privacy-logo-bg)" />
        <text x="16" y="23" fontFamily="Inter, system-ui, -apple-system, sans-serif" fontSize="20" fontWeight="800" textAnchor="middle" letterSpacing="-0.04em" fill="#ffffff">W</text>
      </svg>
      <span style={{ fontSize: '1.2rem', fontWeight: 800, color: TEXT, letterSpacing: '-0.03em' }}>Weeklie</span>
    </div>
  );
}

function SectionHeading({ children }) {
  return (
    <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: TEXT, margin: '32px 0 10px 0', letterSpacing: '-0.01em' }}>
      {children}
    </h2>
  );
}

function P({ children }) {
  return (
    <p style={{ fontSize: '0.95rem', color: TEXT2, lineHeight: 1.7, margin: '0 0 12px 0' }}>
      {children}
    </p>
  );
}

export default function PrivacyPolicy() {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: '100vh', background: BG, color: TEXT2, fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}>
      <nav style={{ padding: '1.25rem 2rem', maxWidth: 1100, margin: '0 auto' }}>
        <Logo />
      </nav>

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '1rem 1.5rem 5rem' }}>
        <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', fontWeight: 800, color: TEXT, margin: '1rem 0 6px 0', letterSpacing: '-0.03em' }}>
          Privacy Policy
        </h1>
        <p style={{ fontSize: '0.85rem', color: TEXT4, margin: '0 0 24px 0' }}>Last updated: 12 July 2026</p>

        <P>
          Weeklie is a free work-week planning tool. It doesn't require an account, and it doesn't collect
          or store your schedule data on any server — everything you plan stays in your browser for the
          length of your session.
        </P>

        <SectionHeading>Analytics</SectionHeading>
        <P>
          Weeklie uses <a href="https://usefathom.com" target="_blank" rel="noopener noreferrer" style={{ color: ACCENT }}>Fathom Analytics</a>,
          a privacy-friendly analytics service, to understand how many people visit the site and which
          features are popular. Fathom doesn't use cookies, doesn't track you across other websites, and
          doesn't collect or store any personally identifiable information. Visitor data is aggregated and
          anonymized — for example, IP addresses are used only to derive a coarse location (country/region)
          and are then discarded, never stored.
        </P>
        <P>
          In aggregate, Fathom may record: page views, referring site, approximate location (country/region),
          and browser/device type. This information can't be used to identify you individually, and Weeklie
          has no way to tie it back to a specific visitor.
        </P>
        <P>
          For full details on how Fathom handles data, see{' '}
          <a href="https://usefathom.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: ACCENT }}>
            Fathom's own privacy policy
          </a>.
        </P>

        <SectionHeading>Calendar export</SectionHeading>
        <P>
          When you export your plan to Google Calendar or as an .ics file, that happens entirely in your
          browser — your calendar events are generated locally and either downloaded directly or handed off
          to Google's own calendar page, which is governed by Google's privacy policy. Weeklie itself never
          sees or stores this data.
        </P>

        <SectionHeading>Contact</SectionHeading>
        <P>
          Questions about this policy or how Weeklie handles data? Reach out via the{' '}
          <a href="https://tally.so/r/zxNrGM" target="_blank" rel="noopener noreferrer" style={{ color: ACCENT }}>
            feedback form
          </a>.
        </P>

        <div style={{ marginTop: 40, borderTop: `1px solid ${CARD2}`, paddingTop: 24 }}>
          <button
            onClick={() => navigate('/')}
            style={{
              background: CARD,
              border: 'none',
              borderRadius: 10,
              padding: '10px 20px',
              color: TEXT,
              fontSize: '0.88rem',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            ← Back to Weeklie
          </button>
        </div>
      </div>
    </div>
  );
}
