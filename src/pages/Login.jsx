import { useState } from 'react'
import { supabase } from '../supabaseClient'
import { useIsMobile } from '../useIsMobile'
import { useTheme } from '../ThemeContext'

// Restrict registration to your company domain.
// Set VITE_ALLOWED_EMAIL_DOMAIN=@yourcompany.com in .env
// Leave it empty to allow any email (not recommended for production)
const ALLOWED_DOMAIN = import.meta.env.VITE_ALLOWED_EMAIL_DOMAIN || ''

function domainOk(email) {
  if (!ALLOWED_DOMAIN) return true
  return email.toLowerCase().endsWith(ALLOWED_DOMAIN.toLowerCase())
}

const font = "'Inter','system-ui',-apple-system,'Segoe UI',sans-serif"

/* ── Sun / Moon SVG icons ── */
const SunIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
)
const MoonIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
)

function buildStyles(C) {
  return {
    wrap: {
      minHeight: '100vh', background: C.bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px', fontFamily: font, transition: 'background 0.3s ease',
    },
    card: {
      width: '100%', maxWidth: 420, position: 'relative',
      background: C.surface,
      border: `1px solid ${C.border}`,
      borderRadius: 16, padding: '40px 36px',
      boxShadow: C.shadow, transition: 'background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
    },
    themeToggle: {
      position: 'absolute', top: 16, right: 16,
      width: 36, height: 36, borderRadius: 10,
      border: `1px solid ${C.border}`,
      background: C.surfaceHover,
      color: C.muted, cursor: 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      transition: 'background 0.2s, border-color 0.2s, color 0.2s',
    },
    logo: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 },
    logoBadge: { width: 32, height: 32, borderRadius: 8, background: C.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 13 },
    logoText: { fontWeight: 700, fontSize: 20, color: C.heading, letterSpacing: '-0.01em', transition: 'color 0.3s' },
    tagline: { fontSize: 14, color: C.muted, marginBottom: 28, transition: 'color 0.3s' },
    tabs: {
      display: 'flex', gap: 4, marginBottom: 28,
      background: C.tabBg, borderRadius: 10, padding: 4,
      transition: 'background 0.3s',
    },
    tab: { flex: 1, padding: '9px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500, fontFamily: font, transition: 'background 0.2s, color 0.2s, box-shadow 0.2s' },
    tabActive: { background: C.accent, color: 'white', boxShadow: `0 1px 3px ${C.accentShadow}` },
    tabInactive: { background: 'transparent', color: C.muted },
    label: {
      display: 'block', fontSize: 12, fontWeight: 600,
      color: C.text, marginBottom: 6, fontFamily: font, transition: 'color 0.3s',
    },
    input: {
      width: '100%', background: C.inputBg,
      border: `1px solid ${C.border}`, borderRadius: 8,
      padding: '10px 12px', color: C.heading, fontSize: 14, outline: 'none',
      boxSizing: 'border-box', marginBottom: 14, fontFamily: font,
      transition: 'background 0.3s, border-color 0.3s, color 0.3s',
    },
    inputErr: { border: `1px solid ${C.red}` },
    btn: { width: '100%', padding: '12px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, marginTop: 4, fontFamily: font, transition: 'background 0.2s, color 0.2s, box-shadow 0.2s' },
    btnPrimary: { background: C.accent, color: 'white', boxShadow: `0 1px 3px ${C.accentShadow}` },
    btnSecondary: { background: C.surfaceHover, color: C.muted, marginTop: 8, border: `1px solid ${C.border}` },
    divider: { display: 'flex', alignItems: 'center', gap: 12, margin: '18px 0' },
    divLine: { flex: 1, height: 1, background: C.border, transition: 'background 0.3s' },
    divText: { fontSize: 12, color: C.subtle, fontWeight: 500, transition: 'color 0.3s' },
    msgErr: {
      background: C.redBg, border: `1px solid ${C.redBorder}`,
      borderRadius: 8, padding: '10px 12px', fontSize: 13, color: C.red, marginBottom: 14,
      transition: 'background 0.3s, border-color 0.3s, color 0.3s',
    },
    msgOk: {
      background: C.greenBg, border: `1px solid ${C.greenBorder}`,
      borderRadius: 8, padding: '10px 12px', fontSize: 13, color: C.green, marginBottom: 14,
      transition: 'background 0.3s, border-color 0.3s, color 0.3s',
    },
    forgotBtn: {
      background: 'none', border: 'none', color: C.accent, cursor: 'pointer',
      fontSize: 13, fontWeight: 500, padding: 0, marginTop: 12, width: '100%', textAlign: 'center', fontFamily: font,
    },
    domainTag: {
      display: 'inline-block', fontSize: 11, fontWeight: 600,
      padding: '2px 10px', borderRadius: 20, letterSpacing: '0.02em',
      background: C.domainBg, color: C.accent, border: `1px solid ${C.domainBorder}`,
      transition: 'background 0.3s, border-color 0.3s, color 0.3s',
    },
  }
}

export default function Login() {
  const mob = useIsMobile()
  const { C, isDark, toggleTheme } = useTheme()
  const S = buildStyles(C)

  const [tab, setTab] = useState('login')        // 'login' | 'signup'
  const [mode, setMode] = useState('password')   // 'password' | 'magic' | 'reset'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const clear = () => { setError(''); setMessage('') }

  const checkDomain = (val) => {
    if (!domainOk(val)) {
      setError(`Only ${ALLOWED_DOMAIN} email addresses can register.`)
      return false
    }
    return true
  }

  const switchTab = (t) => {
    setTab(t); setMode('password'); clear()
    setEmail(''); setPassword(''); setConfirmPw(''); setFullName('')
  }

  // ── Sign up ──────────────────────────────────────────────
  const handleSignUp = async (e) => {
    e.preventDefault(); clear()
    if (!checkDomain(email)) return
    if (password !== confirmPw) { setError('Passwords do not match.'); return }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return }
    setLoading(true)
    const { error: err } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: fullName } },
    })
    if (err) setError(err.message)
    else setMessage('Account created! Check your email to confirm, then sign in.')
    setLoading(false)
  }

  // ── Sign in with password ────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault(); clear(); setLoading(true)
    const { error: err } = await supabase.auth.signInWithPassword({ email, password })
    if (err) setError(err.message)
    setLoading(false)
  }

  // ── Magic link ───────────────────────────────────────────
  const handleMagicLink = async (e) => {
    e.preventDefault(); clear()
    if (tab === 'signup' && !checkDomain(email)) return
    setLoading(true)
    const { error: err } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin,
        ...(tab === 'signup' && fullName ? { data: { full_name: fullName } } : {}),
      },
    })
    if (err) setError(err.message)
    else setMessage('Magic link sent! Check your email.')
    setLoading(false)
  }

  // ── Password reset ───────────────────────────────────────
  const handleReset = async (e) => {
    e.preventDefault(); clear(); setLoading(true)
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    })
    if (err) setError(err.message)
    else setMessage('Password reset link sent to your email.')
    setLoading(false)
  }

  return (
    <div style={S.wrap}>
      <style>{`
        input:focus { border-color: ${C.accent} !important; box-shadow: 0 0 0 3px ${C.accentRing}; background: ${C.inputFocusBg} !important; }
        button:not(:disabled):hover { opacity: 0.88; }
        button:disabled { opacity: 0.5; cursor: not-allowed; }
      `}</style>

      <div style={{ ...S.card, ...(mob ? { padding: '28px 20px', borderRadius: 12 } : {}) }}>
        {/* Theme toggle */}
        <button style={S.themeToggle} onClick={toggleTheme} title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
          {isDark ? <SunIcon /> : <MoonIcon />}
        </button>

        <div style={S.logo}>
          <div style={S.logoBadge}>AI</div>
          <span style={S.logoText}>Sprint Tracker</span>
        </div>
        <div style={S.tagline}>
          {mode === 'reset' ? 'Reset your password' : '6-Month AI Upskilling Program'}
        </div>

        {/* Domain badge */}
        {ALLOWED_DOMAIN && mode !== 'reset' && (
          <div style={{ marginBottom: 18, fontSize: 13, color: C.muted }}>
            Open to <span style={S.domainTag}>{ALLOWED_DOMAIN}</span> employees
          </div>
        )}

        {/* Tabs */}
        {mode !== 'reset' && (
          <div style={S.tabs}>
            {[['login', 'Sign In'], ['signup', 'Create Account']].map(([t, l]) => (
              <button key={t} onClick={() => switchTab(t)}
                style={{ ...S.tab, ...(tab === t ? S.tabActive : S.tabInactive) }}>
                {l}
              </button>
            ))}
          </div>
        )}

        {error && <div style={S.msgErr}>{error}</div>}
        {message && <div style={S.msgOk}>{message}</div>}

        {/* ── CREATE ACCOUNT — password ── */}
        {tab === 'signup' && mode === 'password' && !message && (
          <form onSubmit={handleSignUp}>
            <label style={S.label}>Full Name</label>
            <input style={S.input} value={fullName} onChange={e => setFullName(e.target.value)}
              placeholder="Jane Smith" required />
            <label style={S.label}>Work Email{ALLOWED_DOMAIN ? ` (${ALLOWED_DOMAIN})` : ''}</label>
            <input
              style={{ ...S.input, ...(error && email && !domainOk(email) ? S.inputErr : {}) }}
              type="email" value={email}
              onChange={e => { setEmail(e.target.value); clear() }}
              placeholder={`you${ALLOWED_DOMAIN || '@company.com'}`} required />
            <label style={S.label}>Password</label>
            <input style={S.input} type="password" value={password}
              onChange={e => setPassword(e.target.value)} placeholder="Min 8 characters" required />
            <label style={S.label}>Confirm Password</label>
            <input
              style={{ ...S.input, ...(confirmPw && password !== confirmPw ? S.inputErr : {}) }}
              type="password" value={confirmPw}
              onChange={e => setConfirmPw(e.target.value)} placeholder="Repeat password" required />
            <button type="submit" style={{ ...S.btn, ...S.btnPrimary }} disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
            <div style={S.divider}>
              <div style={S.divLine} /><span style={S.divText}>or</span><div style={S.divLine} />
            </div>
            <button type="button" style={{ ...S.btn, ...S.btnSecondary }}
              onClick={() => { clear(); setMode('magic') }}>
              Sign up with Magic Link instead
            </button>
          </form>
        )}

        {/* ── CREATE ACCOUNT — magic link ── */}
        {tab === 'signup' && mode === 'magic' && !message && (
          <form onSubmit={handleMagicLink}>
            <label style={S.label}>Full Name</label>
            <input style={S.input} value={fullName} onChange={e => setFullName(e.target.value)}
              placeholder="Jane Smith" required />
            <label style={S.label}>Work Email</label>
            <input style={S.input} type="email" value={email}
              onChange={e => { setEmail(e.target.value); clear() }}
              placeholder={`you${ALLOWED_DOMAIN || '@company.com'}`} required />
            <button type="submit" style={{ ...S.btn, ...S.btnPrimary }} disabled={loading}>
              {loading ? 'Sending...' : 'Send Magic Link'}
            </button>
            <button type="button" style={{ ...S.btn, ...S.btnSecondary }}
              onClick={() => { clear(); setMode('password') }}>
              Use Password Instead
            </button>
          </form>
        )}

        {/* ── SIGN IN — password ── */}
        {tab === 'login' && mode === 'password' && (
          <form onSubmit={handleLogin}>
            <label style={S.label}>Email</label>
            <input style={S.input} type="email" value={email}
              onChange={e => setEmail(e.target.value)} placeholder="you@company.com" required />
            <label style={S.label}>Password</label>
            <input style={S.input} type="password" value={password}
              onChange={e => setPassword(e.target.value)} placeholder="Your password" required />
            <button type="submit" style={{ ...S.btn, ...S.btnPrimary }} disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
            <div style={S.divider}>
              <div style={S.divLine} /><span style={S.divText}>or</span><div style={S.divLine} />
            </div>
            <button type="button" style={{ ...S.btn, ...S.btnSecondary }}
              onClick={() => { clear(); setMode('magic') }}>
              Sign in with Magic Link
            </button>
            <button type="button" style={S.forgotBtn}
              onClick={() => { clear(); setMode('reset') }}>
              Forgot password?
            </button>
          </form>
        )}

        {/* ── SIGN IN — magic link ── */}
        {tab === 'login' && mode === 'magic' && (
          <form onSubmit={handleMagicLink}>
            <label style={S.label}>Email</label>
            <input style={S.input} type="email" value={email}
              onChange={e => setEmail(e.target.value)} placeholder="you@company.com" required />
            <button type="submit" style={{ ...S.btn, ...S.btnPrimary }} disabled={loading}>
              {loading ? 'Sending...' : 'Send Magic Link'}
            </button>
            <button type="button" style={{ ...S.btn, ...S.btnSecondary }}
              onClick={() => { clear(); setMode('password') }}>
              Use Password Instead
            </button>
          </form>
        )}

        {/* ── PASSWORD RESET ── */}
        {mode === 'reset' && (
          <form onSubmit={handleReset}>
            <label style={S.label}>Email</label>
            <input style={S.input} type="email" value={email}
              onChange={e => setEmail(e.target.value)} placeholder="you@company.com" required />
            <button type="submit" style={{ ...S.btn, ...S.btnPrimary }} disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
            <button type="button" style={{ ...S.btn, ...S.btnSecondary }}
              onClick={() => { clear(); setMode('password'); setTab('login') }}>
              Back to Sign In
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
