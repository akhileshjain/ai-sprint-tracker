import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { SPRINTS, STATUS } from '../data'
import { useIsMobile } from '../useIsMobile'
import { useTheme } from '../ThemeContext'

// ── constants ────────────────────────────────────────────────────────────────

const allStories = SPRINTS.flatMap(s => s.stories)
const totalPts = allStories.reduce((a, s) => a + s.points, 0)
const totalTasks = allStories.length

const font = "'Inter','system-ui',-apple-system,'Segoe UI',sans-serif"

// ── theme toggle icons ───────────────────────────────────────────────────────

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  )
}

// ── helpers ──────────────────────────────────────────────────────────────────

function calcStats(progress) {
  const done = progress.filter(r => r.status === STATUS.DONE).length
  const inprog = progress.filter(r => r.status === STATUS.INPROG).length
  const pct = Math.round(done / totalTasks * 100)
  const pts = progress
    .filter(r => r.status === STATUS.DONE)
    .reduce((a, r) => {
      const story = allStories.find(s => s.id === r.task_id)
      return a + (story?.points || 0)
    }, 0)
  let currentSprint = 1
  for (const sp of SPRINTS) {
    const spDone = progress.filter(r => sp.stories.find(s => s.id === r.task_id) && r.status === STATUS.DONE).length
    if (spDone < sp.stories.length) { currentSprint = sp.num; break }
    currentSprint = sp.num
  }
  return { done, inprog, pct, pts, currentSprint }
}

function getRisk(pct, C) {
  if (pct === 0)   return { label: 'Not Started', color: C.muted,  bg: C.grayBg,  border: C.border }
  if (pct < 15)    return { label: 'At Risk',     color: C.red,    bg: C.redBg,   border: C.redBorder }
  if (pct < 40)    return { label: 'Behind',      color: C.amber,  bg: C.amberBg, border: C.amberBorder }
  if (pct < 75)    return { label: 'On Track',    color: C.green,  bg: C.greenBg, border: C.greenBorder }
  return             { label: 'Ahead',            color: C.cyan,   bg: C.cyanBg,  border: C.cyanBorder }
}

// ── ring chart ───────────────────────────────────────────────────────────────

function Ring({ pct, size = 48, stroke = 4, color, trackColor }) {
  const { C } = useTheme()
  const ringColor = color || C.green
  const track = trackColor || C.border
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', flexShrink: 0 }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={ringColor} strokeWidth={stroke}
        strokeDasharray={`${circ * pct / 100} ${circ}`} strokeLinecap="round"
        style={{ transition: 'stroke-dasharray 0.6s ease' }} />
    </svg>
  )
}

// ── progress bar ─────────────────────────────────────────────────────────────

function ProgressBar({ pct, color, height = 6, trackColor }) {
  const { C } = useTheme()
  const barColor = color || C.accent
  const track = trackColor || C.border
  return (
    <div style={{ height, width: '100%', background: track, borderRadius: height / 2, overflow: 'hidden' }}>
      <div style={{ height: '100%', width: `${pct}%`, background: barColor, borderRadius: height / 2, transition: 'width 0.5s ease' }} />
    </div>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
//  ADMIN DASHBOARD
// ═════════════════════════════════════════════════════════════════════════════

export default function AdminDashboard({ profile, onSignOut }) {
  const [employees, setEmployees]       = useState([])
  const [loading, setLoading]           = useState(true)
  const [selectedUser, setSelectedUser] = useState(null)
  const [sortBy, setSortBy]             = useState('risk')
  const [exportMsg, setExportMsg]       = useState('')
  const [refreshing, setRefreshing]     = useState(false)
  const [searchQuery, setSearchQuery]   = useState('')
  const mob = useIsMobile()
  const { C, isDark, toggleTheme } = useTheme()

  useEffect(() => { fetchData() }, [])

  async function fetchData(soft = false) {
    if (soft) setRefreshing(true)
    else setLoading(true)

    const [{ data: profiles }, { data: progress }] = await Promise.all([
      supabase.from('profiles').select('id, email, full_name, is_admin, created_at').order('full_name'),
      supabase.from('task_progress').select('user_id, task_id, status'),
    ])

    if (profiles && progress) {
      const enriched = profiles
        .filter(p => !p.is_admin)
        .map(p => ({
          ...p,
          progress: progress.filter(r => r.user_id === p.id),
          stats: calcStats(progress.filter(r => r.user_id === p.id)),
        }))
      setEmployees(enriched)
      // Refresh selected user data too
      if (selectedUser) {
        const updated = enriched.find(e => e.id === selectedUser.id)
        if (updated) setSelectedUser(updated)
      }
    }
    setLoading(false)
    setRefreshing(false)
  }

  function exportCSV() {
    const rows = [['Name', 'Email', 'Overall %', 'Tasks Done', 'Points Earned', 'Current Sprint', 'Status', 'Joined']]
    employees.forEach(e => {
      const risk = getRisk(e.stats.pct, C)
      rows.push([
        e.full_name || '',
        e.email,
        `${e.stats.pct}%`,
        `${e.stats.done}/${totalTasks}`,
        `${e.stats.pts}/${totalPts}`,
        `Sprint ${e.stats.currentSprint}`,
        risk.label,
        new Date(e.created_at).toLocaleDateString('en-IN'),
      ])
    })
    const csv = rows.map(r => r.map(v => `"${v}"`).join(',')).join('\n')
    const a = Object.assign(document.createElement('a'), {
      href: URL.createObjectURL(new Blob([csv], { type: 'text/csv' })),
      download: `ai-tracker-${new Date().toISOString().split('T')[0]}.csv`,
    })
    a.click(); URL.revokeObjectURL(a.href)
    setExportMsg('Downloaded!'); setTimeout(() => setExportMsg(''), 2000)
  }

  const searchFiltered = employees.filter(e =>
    !searchQuery ||
    (e.full_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const sorted = [...searchFiltered].sort((a, b) => {
    if (sortBy === 'pct')  return b.stats.pct - a.stats.pct
    if (sortBy === 'risk') return a.stats.pct - b.stats.pct
    return (a.full_name || a.email).localeCompare(b.full_name || b.email)
  })

  // Aggregate stats
  const teamPct    = employees.length ? Math.round(employees.reduce((a, e) => a + e.stats.pct, 0) / employees.length) : 0
  const atRisk     = employees.filter(e => e.stats.pct < 15).length
  const onTrack    = employees.filter(e => e.stats.pct >= 40).length
  const notStarted = employees.filter(e => e.stats.pct === 0).length
  const behind     = employees.filter(e => e.stats.pct >= 15 && e.stats.pct < 40).length

  // Sprint distribution
  const sprintDist = SPRINTS.map(sp => ({
    ...sp,
    count: employees.filter(e => e.stats.currentSprint === sp.num).length,
  }))

  // ── Loading state ──────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: font, transition: 'background 0.3s ease' }}>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 36, height: 36, border: `3px solid ${C.border}`, borderTopColor: C.accent, borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
          <div style={{ fontSize: 13, fontWeight: 500, color: C.muted, letterSpacing: '0.02em' }}>Loading team data…</div>
        </div>
      </div>
    )
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: font, transition: 'background 0.3s ease, color 0.3s ease' }}>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
        button { transition: all 0.15s ease; font-family: ${font}; }
        button:not(:disabled):hover { opacity: 0.88; }
        button:disabled { opacity: 0.5; cursor: not-allowed; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 3px; }
      `}</style>

      {/* ═══════════ NAV BAR ═══════════ */}
      <header style={{
        background: C.nav, color: C.navText, padding: mob ? '0 12px' : '0 32px',
        display: 'flex', alignItems: 'center', height: 56,
        position: 'sticky', top: 0, zIndex: 100,
        boxShadow: isDark ? '0 1px 3px rgba(0,0,0,0.4)' : '0 1px 3px rgba(0,0,0,0.12)', gap: mob ? 8 : 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: mob ? 8 : 10, marginRight: mob ? 8 : 24 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 7,
            background: 'linear-gradient(135deg,#3b82f6,#1d4ed8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em',
          }}>AI</div>
          {!mob && <span style={{ fontSize: 15, fontWeight: 600, color: C.navActive, letterSpacing: '-0.01em' }}>Sprint Tracker</span>}
        </div>

        <span style={{ fontSize: 11, fontWeight: 500, padding: '3px 10px', borderRadius: 4, background: 'rgba(255,255,255,0.1)', color: '#a5b4fc', letterSpacing: '0.03em' }}>
          Admin{!mob && ' Console'}
        </span>

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: mob ? 6 : 12 }}>
          <button onClick={() => fetchData(true)} disabled={refreshing}
            style={{
              fontSize: 12, fontWeight: 500, padding: mob ? '6px 8px' : '6px 14px', borderRadius: 6,
              border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.06)',
              color: refreshing ? '#6b7d9b' : '#c7d0e0', cursor: 'pointer',
            }}>
            {refreshing ? '…' : '⟳'}{!mob && (refreshing ? ' Refreshing…' : ' Refresh')}
          </button>
          <button onClick={exportCSV}
            style={{
              fontSize: 12, fontWeight: 500, padding: mob ? '6px 8px' : '6px 14px', borderRadius: 6,
              border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.06)',
              color: exportMsg ? '#34d399' : '#c7d0e0', cursor: 'pointer',
            }}>
            {exportMsg || (mob ? '↓' : '↓ Export CSV')}
          </button>
          {!mob && <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.1)' }} />}
          {!mob && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, color: '#fff' }}>
                {(profile.full_name || profile.email || '?')[0].toUpperCase()}
              </div>
              <span style={{ fontSize: 12, color: '#c7d0e0', maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{profile.full_name || profile.email}</span>
            </div>
          )}
          <button onClick={toggleTheme} title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            style={{
              background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 6, padding: mob ? '4px 6px' : '5px 8px', cursor: 'pointer',
              color: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.2s',
            }}>{isDark ? <SunIcon /> : <MoonIcon />}</button>
          <button onClick={onSignOut}
            style={{
              fontSize: mob ? 11 : 12, fontWeight: 500, padding: mob ? '5px 8px' : '6px 12px', borderRadius: 6,
              border: '1px solid rgba(255,255,255,0.12)', background: 'transparent',
              color: '#94a3b8', cursor: 'pointer',
            }}>
            Sign Out
          </button>
        </div>
      </header>

      {/* ═══════════ PAGE CONTENT ═══════════ */}
      <main style={{ maxWidth: 1260, margin: '0 auto', padding: mob ? '16px 14px 32px' : '28px 32px 48px' }}>

        {/* Page header */}
        <div style={{ marginBottom: mob ? 20 : 28, display: 'flex', flexDirection: mob ? 'column' : 'row', justifyContent: 'space-between', alignItems: mob ? 'flex-start' : 'flex-end', gap: mob ? 4 : 0 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: C.heading, margin: '0 0 4px', letterSpacing: '-0.02em' }}>Team Progress Dashboard</h1>
            <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>
              AI Upskilling Program · {employees.length} enrolled · {totalTasks} tasks across {SPRINTS.length} sprints
            </p>
          </div>
          <div style={{ fontSize: 12, color: C.subtle }}>
            Last refreshed: {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>

        {/* ═══════════ KPI CARDS ═══════════ */}
        <div style={{ display: 'grid', gridTemplateColumns: mob ? 'repeat(2, 1fr)' : 'repeat(5, 1fr)', gap: mob ? 10 : 14, marginBottom: 24 }}>
          {[
            { label: 'Total Enrolled', value: employees.length, icon: '👥', color: C.accent, bg: C.accentLight },
            { label: 'Avg Completion', value: `${teamPct}%`, icon: '📊', color: C.green, bg: C.greenBg },
            { label: 'On Track / Ahead', value: onTrack, icon: '✅', color: C.green, bg: C.greenBg },
            { label: 'At Risk', value: atRisk, icon: '⚠️', color: C.red, bg: C.redBg },
            { label: 'Not Started', value: notStarted, icon: '⏸', color: C.muted, bg: C.grayBg },
          ].map(card => (
            <div key={card.label} style={{
              background: C.surface, borderRadius: 10, padding: '20px 18px',
              border: `1px solid ${C.border}`,
              boxShadow: isDark ? '0 1px 2px rgba(0,0,0,0.2)' : '0 1px 2px rgba(0,0,0,0.04)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <span style={{ fontSize: 12, fontWeight: 500, color: C.muted, lineHeight: 1.3 }}>{card.label}</span>
                <span style={{ fontSize: 16 }}>{card.icon}</span>
              </div>
              <div style={{ fontSize: 28, fontWeight: 700, color: C.heading, letterSpacing: '-0.03em', lineHeight: 1 }}>{card.value}</div>
            </div>
          ))}
        </div>

        {/* ═══════════ MIDDLE ROW: Sprint Distribution + Team Health ═══════════ */}
        <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr' : '1fr 320px', gap: 16, marginBottom: 24 }}>

          {/* Sprint distribution */}
          <div style={{
            background: C.surface, borderRadius: 10, padding: '22px 24px',
            border: `1px solid ${C.border}`, boxShadow: isDark ? '0 1px 2px rgba(0,0,0,0.2)' : '0 1px 2px rgba(0,0,0,0.04)',
          }}>
            <h2 style={{ fontSize: 14, fontWeight: 600, color: C.heading, margin: '0 0 18px', letterSpacing: '-0.01em' }}>Sprint Distribution</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {sprintDist.map(sp => {
                const pct = employees.length ? Math.round(sp.count / employees.length * 100) : 0
                return (
                  <div key={sp.id} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 7, flexShrink: 0,
                      background: sp.count > 0 ? `${sp.color}18` : C.grayBg,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 11, fontWeight: 700, color: sp.count > 0 ? sp.color : C.subtle,
                      border: `1px solid ${sp.count > 0 ? sp.color + '30' : C.border}`,
                    }}>S{sp.num}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: 12, fontWeight: 500, color: C.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{sp.title}</span>
                        <span style={{ fontSize: 12, fontWeight: 600, color: sp.count > 0 ? C.heading : C.subtle, flexShrink: 0, marginLeft: 8 }}>{sp.count} <span style={{ fontWeight: 400, color: C.subtle }}>({pct}%)</span></span>
                      </div>
                      <ProgressBar pct={pct} color={sp.count > 0 ? sp.color : C.subtle} height={5} trackColor={C.borderLight} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Team health */}
          <div style={{
            background: C.surface, borderRadius: 10, padding: '22px 24px',
            border: `1px solid ${C.border}`, boxShadow: isDark ? '0 1px 2px rgba(0,0,0,0.2)' : '0 1px 2px rgba(0,0,0,0.04)',
            display: 'flex', flexDirection: 'column',
          }}>
            <h2 style={{ fontSize: 14, fontWeight: 600, color: C.heading, margin: '0 0 18px', letterSpacing: '-0.01em' }}>Team Health</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
              <Ring pct={teamPct} size={60} stroke={5} color={teamPct >= 40 ? C.green : teamPct > 0 ? C.amber : C.muted} trackColor={C.borderLight} />
              <div>
                <div style={{ fontSize: 32, fontWeight: 700, color: C.heading, letterSpacing: '-0.03em', lineHeight: 1 }}>{teamPct}%</div>
                <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>Average completion</div>
              </div>
            </div>
            <div style={{ height: 1, background: C.border, margin: '0 0 14px' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
              {[
                { label: 'On Track / Ahead', count: onTrack, color: C.green, bg: C.greenBg },
                { label: 'Behind (15–39%)', count: behind, color: C.amber, bg: C.amberBg },
                { label: 'At Risk (<15%)', count: atRisk, color: C.red, bg: C.redBg },
                { label: 'Not Started', count: notStarted, color: C.muted, bg: C.grayBg },
              ].map(r => (
                <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 2, background: r.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: C.text }}>{r.label}</span>
                  </div>
                  <span style={{
                    fontSize: 13, fontWeight: 600, color: r.color,
                    minWidth: 28, textAlign: 'right',
                  }}>{r.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ═══════════ EMPLOYEE TABLE ═══════════ */}
        <div style={{
          background: C.surface, borderRadius: 10, overflow: 'hidden',
          border: `1px solid ${C.border}`, boxShadow: isDark ? '0 1px 2px rgba(0,0,0,0.2)' : '0 1px 2px rgba(0,0,0,0.04)',
        }}>

          {/* Table toolbar */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '16px 20px', borderBottom: `1px solid ${C.border}`, flexWrap: 'wrap', gap: 12,
          }}>
            <div>
              <h2 style={{ fontSize: 14, fontWeight: 600, color: C.heading, margin: 0 }}>Employees</h2>
              {searchQuery && <span style={{ fontSize: 12, color: C.subtle }}>{sorted.length} of {employees.length} shown</span>}
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 13, color: C.subtle, pointerEvents: 'none' }}>🔍</span>
                <input
                  value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search name or email…"
                  style={{
                    background: C.grayBg, border: `1px solid ${C.border}`, borderRadius: 7,
                    padding: '7px 12px 7px 30px', color: C.heading, fontSize: 13, outline: 'none',
                    width: mob ? 160 : 210, fontFamily: font,
                  }}
                />
              </div>
              <span style={{ fontSize: 12, color: C.subtle, marginLeft: 4 }}>Sort:</span>
              {[['risk', 'At Risk First'], ['pct', 'Progress'], ['name', 'Name']].map(([v, l]) => (
                <button key={v} onClick={() => setSortBy(v)}
                  style={{
                    fontSize: 12, fontWeight: 500, padding: '6px 12px', borderRadius: 6, cursor: 'pointer',
                    border: `1px solid ${sortBy === v ? C.accent : C.border}`,
                    background: sortBy === v ? C.accentLight : C.surface,
                    color: sortBy === v ? C.accent : C.muted,
                  }}>
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Column headers */}
          {!mob && (
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 160px 80px 80px 80px 110px',
              padding: '10px 20px', background: C.grayBg, borderBottom: `1px solid ${C.border}`,
            }}>
              {['Employee', 'Progress', 'Done', 'Points', 'Sprint', 'Status'].map(h => (
                <span key={h} style={{ fontSize: 11, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</span>
              ))}
            </div>
          )}

          {/* Empty state */}
          {sorted.length === 0 && (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: C.subtle, fontSize: 13 }}>
              {employees.length === 0
                ? 'No employees have registered yet. Share the app URL with your team.'
                : 'No results match your search.'}
            </div>
          )}

          {/* Rows */}
          {sorted.map((emp, idx) => {
            const risk = getRisk(emp.stats.pct, C)
            const isSelected = selectedUser?.id === emp.id
            const isLast = idx === sorted.length - 1
            return (
              <div key={emp.id}>
                <div
                  onClick={() => setSelectedUser(isSelected ? null : emp)}
                  style={{
                    ...(mob ? { padding: '14px 16px' } : { display: 'grid', gridTemplateColumns: '1fr 160px 80px 80px 80px 110px', padding: '14px 20px' }),
                    borderBottom: isSelected || isLast ? 'none' : `1px solid ${C.borderLight}`,
                    cursor: 'pointer', transition: 'background 0.12s',
                    background: isSelected ? C.accentLight : 'transparent',
                  }}
                  onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = C.grayBg }}
                  onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'transparent' }}
                >
                  {mob ? (
                    <>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                        <div style={{
                          width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                          background: isSelected ? C.selectedBg : C.grayBg,
                          border: `1px solid ${isSelected ? C.selectedBorder : C.border}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 12, fontWeight: 600, color: isSelected ? C.accent : C.muted,
                        }}>
                          {(emp.full_name || emp.email || '?')[0].toUpperCase()}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: C.heading }}>{emp.full_name || '—'}</div>
                          <div style={{ fontSize: 11, color: C.subtle, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{emp.email}</div>
                        </div>
                        <span style={{ fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 20, background: risk.bg, color: risk.color, border: `1px solid ${risk.border}`, flexShrink: 0 }}>{risk.label}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                        <div style={{ flex: 1 }}>
                          <ProgressBar pct={emp.stats.pct} color={emp.stats.pct >= 40 ? C.green : emp.stats.pct > 0 ? C.amber : C.subtle} height={5} trackColor={C.borderLight} />
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 600, color: C.text, minWidth: 30 }}>{emp.stats.pct}%</span>
                      </div>
                      <div style={{ display: 'flex', gap: 16, fontSize: 11, color: C.muted }}>
                        <span>{emp.stats.done}/{totalTasks} done</span>
                        <span>{emp.stats.pts}/{totalPts} pts</span>
                        <span style={{ color: SPRINTS[emp.stats.currentSprint - 1]?.color }}>Sprint {emp.stats.currentSprint}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Name */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                          background: isSelected ? C.selectedBg : C.grayBg,
                          border: `1px solid ${isSelected ? C.selectedBorder : C.border}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 12, fontWeight: 600, color: isSelected ? C.accent : C.muted,
                        }}>
                          {(emp.full_name || emp.email || '?')[0].toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: C.heading, marginBottom: 1 }}>{emp.full_name || '—'}</div>
                          <div style={{ fontSize: 11, color: C.subtle }}>{emp.email}</div>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ flex: 1, maxWidth: 100 }}>
                          <ProgressBar pct={emp.stats.pct} color={emp.stats.pct >= 40 ? C.green : emp.stats.pct > 0 ? C.amber : C.subtle} height={5} trackColor={C.borderLight} />
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 600, color: C.text, flexShrink: 0, minWidth: 30 }}>{emp.stats.pct}%</span>
                      </div>

                      {/* Done */}
                      <div style={{ fontSize: 13, color: C.text, display: 'flex', alignItems: 'center' }}>
                        {emp.stats.done}<span style={{ color: C.subtle }}>/{totalTasks}</span>
                      </div>

                      {/* Points */}
                      <div style={{ fontSize: 13, color: C.text, display: 'flex', alignItems: 'center' }}>
                        {emp.stats.pts}<span style={{ color: C.subtle }}>/{totalPts}</span>
                      </div>

                      {/* Sprint */}
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{
                          fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 5,
                          background: `${SPRINTS[emp.stats.currentSprint - 1]?.color || C.muted}14`,
                          color: SPRINTS[emp.stats.currentSprint - 1]?.color || C.muted,
                          border: `1px solid ${SPRINTS[emp.stats.currentSprint - 1]?.color || C.muted}28`,
                        }}>Sprint {emp.stats.currentSprint}</span>
                      </div>

                      {/* Status badge */}
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{
                          fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 20,
                          background: risk.bg, color: risk.color, border: `1px solid ${risk.border}`,
                        }}>{risk.label}</span>
                      </div>
                    </>
                  )}
                </div>

                {/* ── Expanded sprint breakdown ── */}
                {isSelected && (
                  <div style={{
                    background: C.expandedBg, padding: mob ? '14px 16px' : '18px 20px 18px 62px',
                    borderBottom: `1px solid ${C.border}`, borderTop: `1px solid ${C.expandedBorder}`,
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: mob ? 'flex-start' : 'center', flexDirection: mob ? 'column' : 'row', gap: mob ? 4 : 0, marginBottom: 16 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: C.accent }}>
                        {emp.full_name || emp.email} — Sprint Breakdown
                      </span>
                      <span style={{ fontSize: 12, color: C.subtle }}>
                        Joined {new Date(emp.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr' : 'repeat(3, 1fr)', gap: 10 }}>
                      {SPRINTS.map(sp => {
                        const spProg = emp.progress.filter(r => sp.stories.find(s => s.id === r.task_id))
                        const spDone = spProg.filter(r => r.status === STATUS.DONE).length
                        const spInprog = spProg.filter(r => r.status === STATUS.INPROG).length
                        const spPct = Math.round(spDone / sp.stories.length * 100)
                        const complete = spPct === 100
                        return (
                          <div key={sp.id} style={{
                            padding: '14px 14px', borderRadius: 8, background: C.surface,
                            border: `1px solid ${complete ? C.greenBorder : C.border}`,
                          }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                              <span style={{ fontSize: 12, fontWeight: 600, color: complete ? C.green : C.heading }}>Sprint {sp.num}</span>
                              <span style={{ fontSize: 12, fontWeight: 600, color: complete ? C.green : C.text }}>{spPct}%</span>
                            </div>
                            <ProgressBar pct={spPct} color={complete ? C.green : sp.color} height={4} trackColor={C.borderLight} />
                            <div style={{ fontSize: 11, color: C.muted, marginTop: 8 }}>
                              <span style={{ color: C.green, fontWeight: 500 }}>{spDone} done</span>
                              {' · '}
                              <span style={{ color: C.amber, fontWeight: 500 }}>{spInprog} active</span>
                              {' · '}
                              {sp.stories.length - spDone - spInprog} remaining
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* ═══════════ FOOTER LEGEND ═══════════ */}
        <div style={{ display: 'flex', gap: 10, marginTop: 18, flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: 12, fontWeight: 500, color: C.subtle, marginRight: 4 }}>Status Key:</span>
          {[
            { label: 'Not Started', color: C.muted, bg: C.grayBg, border: C.border },
            { label: 'At Risk',     color: C.red,   bg: C.redBg,  border: C.redBorder },
            { label: 'Behind',      color: C.amber, bg: C.amberBg, border: C.amberBorder },
            { label: 'On Track',    color: C.green, bg: C.greenBg, border: C.greenBorder },
            { label: 'Ahead',       color: C.cyan,  bg: C.cyanBg,  border: C.cyanBorder },
          ].map(r => (
            <span key={r.label} style={{ fontSize: 11, fontWeight: 500, padding: '3px 10px', borderRadius: 20, background: r.bg, color: r.color, border: `1px solid ${r.border}` }}>{r.label}</span>
          ))}
          <span style={{ marginLeft: mob ? 0 : 'auto', fontSize: 12, color: C.subtle }}>{mob ? 'Tap' : 'Click'} any row to expand sprint details</span>
        </div>
      </main>
    </div>
  )
}
