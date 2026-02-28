import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '../supabaseClient'
import { SPRINTS, TYPE_META, STATUS, STATUS_META } from '../data'
import { useIsMobile } from '../useIsMobile'
import { useTheme } from '../ThemeContext'

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

function buildDefaults() {
  const s = {}
  const n = {}
  SPRINTS.forEach(sp => sp.stories.forEach(t => { s[t.id] = STATUS.TODO; n[t.id] = '' }))
  return { s, n }
}

// ── sub-components ────────────────────────────────────────────────────────────

function Ring({ pct, size = 32, stroke = 3, color }) {
  const { C } = useTheme()
  const ringColor = color || C.green
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', flexShrink: 0 }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={C.border} strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={ringColor} strokeWidth={stroke}
        strokeDasharray={`${c * pct / 100} ${c}`} strokeLinecap="round"
        style={{ transition: 'stroke-dasharray 0.5s ease' }} />
    </svg>
  )
}

function ProgressBar({ pct, color, height = 5 }) {
  const { C } = useTheme()
  const barColor = color || C.accent
  return (
    <div style={{ height, width: '100%', background: C.borderLight, borderRadius: height / 2, overflow: 'hidden' }}>
      <div style={{ height: '100%', width: `${pct}%`, background: barColor, borderRadius: height / 2, transition: 'width 0.5s ease' }} />
    </div>
  )
}

function SprintCard({ sprint, taskState, active, onClick }) {
  const { C } = useTheme()
  const done = sprint.stories.filter(s => taskState[s.id] === STATUS.DONE).length
  const pct = Math.round(done / sprint.stories.length * 100)
  const dPts = sprint.stories.filter(s => taskState[s.id] === STATUS.DONE).reduce((a, s) => a + s.points, 0)
  const tPts = sprint.stories.reduce((a, s) => a + s.points, 0)
  return (
    <button onClick={onClick} style={{
      width: '100%', textAlign: 'left', cursor: 'pointer', marginBottom: 6,
      background: active ? C.accentLight : C.surface,
      border: `1.5px solid ${active ? C.accent : C.border}`,
      borderRadius: 10, padding: '14px 16px', transition: 'all 0.2s',
      boxShadow: active ? `0 1px 3px ${C.accentRing}` : 'none',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', flexShrink: 0, background: pct === 100 ? C.green : pct > 0 ? sprint.color : C.border }} />
        <span style={{ fontSize: 11, fontWeight: 600, color: active ? C.accent : C.muted, letterSpacing: '0.02em' }}>Sprint {sprint.num}</span>
        {pct === 100 && <span style={{ marginLeft: 'auto', fontSize: 11, color: C.green }}>✓</span>}
      </div>
      <div style={{ fontSize: 13, fontWeight: 600, color: active ? C.heading : C.text, lineHeight: 1.3, marginBottom: 8 }}>{sprint.title}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ flex: 1 }}>
          <ProgressBar pct={pct} color={pct === 100 ? C.green : sprint.color} height={4} />
        </div>
        <span style={{ fontSize: 11, color: C.subtle, flexShrink: 0 }}>{dPts}/{tPts}pt</span>
      </div>
    </button>
  )
}

function StoryCard({ story, status, onStatusChange, note, onNoteChange }) {
  const { C } = useTheme()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(note)
  const tm = TYPE_META[story.type]
  const sm = STATUS_META[status]
  const isDone = status === STATUS.DONE
  const isInProg = status === STATUS.INPROG

  // corporate-friendly status colors
  const statusColor = isDone ? C.green : isInProg ? C.amber : C.subtle
  const cardBg = isDone ? C.greenBg : isInProg ? C.amberBg : C.surface
  const cardBorder = isDone ? C.greenBorder : isInProg ? C.amberBorder : C.border

  const cycle = (e) => {
    e.stopPropagation()
    const order = [STATUS.TODO, STATUS.INPROG, STATUS.DONE]
    onStatusChange(order[(order.indexOf(status) + 1) % order.length])
  }

  return (
    <div style={{
      background: cardBg,
      border: `1px solid ${cardBorder}`,
      borderRadius: 10, marginBottom: 8, overflow: 'hidden',
      boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
    }}>
      <div onClick={() => setOpen(o => !o)} style={{ padding: '12px 14px', cursor: 'pointer', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <button onClick={cycle} style={{
          width: 20, height: 20, borderRadius: 5, border: `2px solid ${statusColor}`,
          background: isDone ? statusColor : isInProg ? `${statusColor}30` : 'transparent',
          cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 1,
        }}>
          {isDone && <svg width="10" height="10" viewBox="0 0 12 12"><polyline points="1,6 4,9 11,2" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" /></svg>}
          {isInProg && <div style={{ width: 6, height: 6, borderRadius: 1, background: statusColor }} />}
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: isDone ? C.muted : C.heading, textDecoration: isDone ? 'line-through' : 'none', marginBottom: 4 }}>{story.title}</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, background: `${tm.color}14`, color: tm.color, border: `1px solid ${tm.color}28`, fontWeight: 600, letterSpacing: '0.02em' }}>{tm.label}</span>
            <span style={{ fontSize: 11, color: C.subtle }}>{story.points}pt</span>
            {note && !open && <span style={{ fontSize: 10, color: C.subtle }}>📝</span>}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          <span style={{ fontSize: 10, fontWeight: 500, padding: '2px 9px', borderRadius: 20, background: `${statusColor}18`, color: statusColor, border: `1px solid ${statusColor}30` }}>{sm.label}</span>
          <span style={{ color: C.subtle, fontSize: 11, display: 'inline-block', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▾</span>
        </div>
      </div>

      {open && (
        <div style={{ padding: '0 14px 14px', borderTop: `1px solid ${C.borderLight}` }}>
          <p style={{ fontSize: 13, color: C.text, lineHeight: 1.65, margin: '12px 0' }}>{story.desc}</p>
          {story.links.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
              {story.links.map((l, i) => (
                <a key={i} href={l.url} target="_blank" rel="noreferrer" style={{ fontSize: 12, padding: '5px 12px', borderRadius: 6, background: C.accentLight, color: C.accent, textDecoration: 'none', border: `1px solid ${C.accentBorder}`, fontWeight: 500 }}>
                  🔗 {l.label}
                </a>
              ))}
            </div>
          )}
          <div style={{ marginTop: 4 }}>
            {editing ? (
              <div>
                <textarea value={draft} onChange={e => setDraft(e.target.value)} placeholder="Add your notes..."
                  style={{ width: '100%', minHeight: 70, background: C.grayBg, border: `1px solid ${C.border}`, borderRadius: 6, padding: '8px 10px', color: C.heading, fontSize: 13, fontFamily: font, resize: 'vertical', outline: 'none', boxSizing: 'border-box' }} />
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  <button onClick={() => { onNoteChange(draft); setEditing(false) }} style={{ fontSize: 12, fontWeight: 500, padding: '6px 14px', borderRadius: 6, background: C.accent, color: 'white', border: 'none', cursor: 'pointer' }}>Save</button>
                  <button onClick={() => { setDraft(note); setEditing(false) }} style={{ fontSize: 12, fontWeight: 500, padding: '6px 14px', borderRadius: 6, background: C.grayBg, color: C.muted, border: `1px solid ${C.border}`, cursor: 'pointer' }}>Cancel</button>
                </div>
              </div>
            ) : (
              <div onClick={() => setEditing(true)} style={{ minHeight: 32, padding: '8px 10px', borderRadius: 6, background: C.grayBg, border: `1px dashed ${C.border}`, cursor: 'text', fontSize: 13, color: note ? C.text : C.subtle, lineHeight: 1.5 }}>
                {note || 'Click to add notes...'}
              </div>
            )}
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
            {[STATUS.TODO, STATUS.INPROG, STATUS.DONE].map(s => {
              const sc = STATUS_META[s].color
              const active = status === s
              return (
                <button key={s} onClick={() => onStatusChange(s)} style={{
                  fontSize: 11, fontWeight: 500, padding: '5px 12px', borderRadius: 6, cursor: 'pointer',
                  background: active ? `${sc}14` : C.surface,
                  color: active ? sc : C.muted,
                  border: `1px solid ${active ? sc + '40' : C.border}`,
                }}>
                  {STATUS_META[s].label}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

// ── main tracker ──────────────────────────────────────────────────────────────

export default function Tracker({ profile, onSignOut }) {
  const [taskState, setTaskState] = useState(() => buildDefaults().s)
  const [notes, setNotes] = useState(() => buildDefaults().n)
  const [activeSprint, setActiveSprint] = useState('s1')
  const [view, setView] = useState('sprint')
  const [filter, setFilter] = useState('ALL')
  const [showDone, setShowDone] = useState(true)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [sideOpen, setSideOpen] = useState(false)
  const mob = useIsMobile()
  const { C, isDark, toggleTheme } = useTheme()
  const saveQueue = useRef({})
  const saveTimer = useRef(null)

  // Load progress from Supabase
  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from('task_progress')
        .select('task_id, status, note')
        .eq('user_id', profile.id)
      if (!error && data) {
        const s = { ...buildDefaults().s }
        const n = { ...buildDefaults().n }
        data.forEach(row => {
          if (s[row.task_id] !== undefined) s[row.task_id] = row.status
          if (n[row.task_id] !== undefined) n[row.task_id] = row.note || ''
        })
        setTaskState(s)
        setNotes(n)
      }
      setLoading(false)
    }
    load()
  }, [profile.id])

  // Debounced save to Supabase
  const scheduleSave = useCallback((taskId, status, note) => {
    saveQueue.current[taskId] = { status, note }
    clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(async () => {
      const batch = { ...saveQueue.current }
      saveQueue.current = {}
      setSaving(true)
      const upserts = Object.entries(batch).map(([task_id, val]) => ({
        user_id: profile.id, task_id, status: val.status, note: val.note, updated_at: new Date().toISOString(),
      }))
      await supabase.from('task_progress').upsert(upserts, { onConflict: 'user_id,task_id' })
      setSaving(false)
    }, 800)
  }, [profile.id])

  const updateStatus = useCallback((id, status) => {
    setTaskState(prev => {
      const next = { ...prev, [id]: status }
      scheduleSave(id, status, notes[id] || '')
      return next
    })
  }, [notes, scheduleSave])

  const updateNote = useCallback((id, note) => {
    setNotes(prev => {
      const next = { ...prev, [id]: note }
      scheduleSave(id, taskState[id] || STATUS.TODO, note)
      return next
    })
  }, [taskState, scheduleSave])

  // Stats
  const allStories = SPRINTS.flatMap(s => s.stories)
  const totalDone = allStories.filter(s => taskState[s.id] === STATUS.DONE).length
  const totalInProg = allStories.filter(s => taskState[s.id] === STATUS.INPROG).length
  const totalPct = Math.round(totalDone / allStories.length * 100)

  const sp = SPRINTS.find(s => s.id === activeSprint)
  const spStories = sp ? sp.stories : []
  const spDone = spStories.filter(s => taskState[s.id] === STATUS.DONE).length
  const spPct = spStories.length ? Math.round(spDone / spStories.length * 100) : 0
  const spPts = spStories.reduce((a, s) => a + s.points, 0)
  const spDonePts = spStories.filter(s => taskState[s.id] === STATUS.DONE).reduce((a, s) => a + s.points, 0)

  const filtered = spStories
    .filter(s => filter === 'ALL' || s.type === filter)
    .filter(s => showDone || taskState[s.id] !== STATUS.DONE)

  const weekGroups = sp ? sp.weeks.map((w, wi) => ({
    label: w,
    stories: filtered.filter(s => s.week === (sp.num - 1) * 4 + wi + 1),
  })) : []

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: font, transition: 'background 0.3s ease' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 10 }}>Loading your progress…</div>
          <div style={{ width: 32, height: 32, border: `3px solid ${C.border}`, borderTopColor: C.accent, borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto' }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: C.bg, color: C.text, fontFamily: font, display: 'flex', flexDirection: 'column', transition: 'background 0.3s ease, color 0.3s ease' }}>
      <style>{`::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-thumb{background:${C.border};border-radius:2px} *{box-sizing:border-box;-webkit-tap-highlight-color:transparent} button{transition:all 0.15s} a:hover{opacity:0.85}`}</style>

      {/* Nav */}
      <div style={{ borderBottom: `1px solid ${C.border}`, padding: mob ? '0 10px' : '0 20px', display: 'flex', alignItems: 'center', gap: mob ? 6 : 16, height: 56, background: C.nav, position: 'sticky', top: 0, zIndex: 100, flexShrink: 0 }}>
        {mob && (
          <button onClick={() => setSideOpen(o => !o)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 20, cursor: 'pointer', padding: '4px 2px', lineHeight: 1 }}>☰</button>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: mob ? 6 : 10, flexShrink: 0 }}>
          <div style={{ width: 28, height: 28, borderRadius: 6, background: C.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 12 }}>AI</span>
          </div>
          {!mob && <span style={{ fontWeight: 700, fontSize: 15, color: '#fff', letterSpacing: '-0.01em' }}>Sprint Tracker</span>}
        </div>
        {!mob && <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.15)', margin: '0 4px' }} />}
        {[['sprint', 'Sprint'], ['board', 'Board'], ['overview', 'Overview']].map(([v, l]) => (
          <button key={v} onClick={() => { setView(v); if (mob) setSideOpen(false) }} style={{ fontSize: mob ? 12 : 13, fontWeight: view === v ? 600 : 400, padding: mob ? '5px 8px' : '6px 14px', borderRadius: 6, border: 'none', cursor: 'pointer', background: view === v ? 'rgba(255,255,255,0.12)' : 'transparent', color: view === v ? '#fff' : 'rgba(255,255,255,0.55)' }}>{l}</button>
        ))}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: mob ? 8 : 14 }}>
          {saving && <span style={{ fontSize: 11, fontWeight: 500, color: C.amber }}>{mob ? '•••' : 'Saving…'}</span>}
          {!saving && <span style={{ fontSize: 11, fontWeight: 500, color: '#6ee7b7' }}>{mob ? '✓' : '✓ Synced'}</span>}
          {!mob && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Ring pct={totalPct} color="#6ee7b7" />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{totalPct}%</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)' }}>Overall</div>
                </div>
              </div>
              <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.15)' }} />
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>{profile.full_name || profile.email}</div>
            </>
          )}
          <button onClick={toggleTheme} title={isDark ? 'Switch to light mode' : 'Switch to dark mode'} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 6, padding: mob ? '4px 6px' : '5px 8px', cursor: 'pointer', color: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}>{isDark ? <SunIcon /> : <MoonIcon />}</button>
          <button onClick={onSignOut} style={{ fontSize: mob ? 11 : 12, fontWeight: 500, padding: mob ? '4px 10px' : '5px 14px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.18)', background: 'transparent', color: 'rgba(255,255,255,0.7)', cursor: 'pointer' }}>Sign Out</button>
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', maxHeight: 'calc(100vh - 56px)', position: 'relative' }}>
        {mob && sideOpen && <div onClick={() => setSideOpen(false)} style={{ position: 'fixed', inset: 0, background: isDark ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.2)', zIndex: 200 }} />}
        {/* Sidebar */}
        <div style={{
          width: mob ? 280 : 240, flexShrink: 0,
          borderRight: `1px solid ${C.border}`, overflowY: 'auto', padding: '16px 12px', background: C.surface,
          ...(mob ? { position: 'fixed', top: 56, left: 0, bottom: 0, zIndex: 201, transform: sideOpen ? 'translateX(0)' : 'translateX(-100%)', transition: 'transform 0.25s ease', boxShadow: sideOpen ? `4px 0 20px rgba(0,0,0,${isDark ? '0.3' : '0.08'})` : 'none' } : {}),
        }}>
          {mob ? (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: C.heading }}>Sprints</span>
              <button onClick={() => setSideOpen(false)} style={{ background: 'none', border: 'none', fontSize: 18, color: C.muted, cursor: 'pointer', padding: '2px 6px' }}>✕</button>
            </div>
          ) : (
            <div style={{ fontSize: 11, fontWeight: 600, color: C.subtle, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10, paddingLeft: 4 }}>6 Sprints</div>
          )}
          {SPRINTS.map(s => (
            <SprintCard key={s.id} sprint={s} taskState={taskState} active={s.id === activeSprint}
              onClick={() => { setActiveSprint(s.id); setView('sprint'); if (mob) setSideOpen(false) }} />
          ))}
          <div style={{ marginTop: 12, padding: 14, borderRadius: 10, background: C.grayBg, border: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: C.subtle, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Velocity</div>
            {SPRINTS.map(s => {
              const d = s.stories.filter(t => taskState[t.id] === STATUS.DONE).length
              const p = Math.round(d / s.stories.length * 100)
              return (
                <div key={s.id} style={{ marginBottom: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                    <span style={{ fontSize: 11, fontWeight: 500, color: C.muted }}>S{s.num}</span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: p === 100 ? C.green : p > 0 ? C.accent : C.subtle }}>{d}/{s.stories.length}</span>
                  </div>
                  <ProgressBar pct={p} color={p === 100 ? C.green : C.accent} bg={C.borderLight} />
                </div>
              )
            })}
          </div>
        </div>

        {/* Main */}
        <div style={{ flex: 1, overflowY: 'auto', padding: mob ? '16px' : '24px 28px' }}>

          {/* Sprint View */}
          {view === 'sprint' && sp && (
            <>
              <div style={{ marginBottom: 20, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: C.accent }}>Sprint {sp.num} · Month {sp.num}</span>
                    <span style={{ fontSize: 11, fontWeight: 500, padding: '2px 10px', borderRadius: 20, background: C.accentLight, color: C.accent, border: `1px solid ${C.accentBorder}` }}>{spPct}% complete</span>
                  </div>
                  <h1 style={{ fontWeight: 700, fontSize: 22, color: C.heading, marginBottom: 6, letterSpacing: '-0.01em' }}>{sp.title}</h1>
                  <p style={{ fontSize: 14, color: C.muted, maxWidth: 500, lineHeight: 1.55 }}>{sp.goal}</p>
                </div>
                <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
                  <div style={{ textAlign: 'center', padding: '12px 18px', borderRadius: 10, background: C.surface, border: `1px solid ${C.border}`, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                    <div style={{ fontSize: 20, fontWeight: 700, color: C.accent }}>{spDonePts}<span style={{ fontSize: 12, fontWeight: 400, color: C.subtle }}>/{spPts}</span></div>
                    <div style={{ fontSize: 11, fontWeight: 500, color: C.muted, marginTop: 2 }}>Story Points</div>
                  </div>
                  <div style={{ textAlign: 'center', padding: '12px 18px', borderRadius: 10, background: C.surface, border: `1px solid ${C.border}`, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                    <div style={{ fontSize: 20, fontWeight: 700, color: C.heading }}>{spDone}<span style={{ fontSize: 12, fontWeight: 400, color: C.subtle }}>/{spStories.length}</span></div>
                    <div style={{ fontSize: 11, fontWeight: 500, color: C.muted, marginTop: 2 }}>Tasks</div>
                  </div>
                </div>
              </div>
              <div style={{ marginBottom: 20 }}><ProgressBar pct={spPct} color={C.accent} height={6} /></div>
              <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: C.subtle, textTransform: 'uppercase', letterSpacing: '0.04em', marginRight: 4 }}>Filter</span>
                {['ALL', 'COURSE', 'PROJECT', 'CERT', 'TASK', 'SETUP'].map(f => {
                  const active = filter === f
                  const fc = f !== 'ALL' && TYPE_META[f] ? TYPE_META[f].color : C.accent
                  return (
                    <button key={f} onClick={() => setFilter(f)} style={{
                      fontSize: 11, fontWeight: 500, padding: '5px 12px', borderRadius: 6, cursor: 'pointer',
                      border: `1px solid ${active ? fc + '40' : C.border}`,
                      background: active ? `${fc}10` : C.surface,
                      color: active ? fc : C.muted,
                    }}>{f === 'ALL' ? 'All' : TYPE_META[f]?.label || f}</button>
                  )
                })}
                <button onClick={() => setShowDone(p => !p)} style={{ marginLeft: mob ? 0 : 'auto', fontSize: 11, fontWeight: 500, padding: '5px 12px', borderRadius: 6, cursor: 'pointer', border: `1px solid ${showDone ? C.border : C.green + '40'}`, background: showDone ? C.surface : C.greenBg, color: showDone ? C.muted : C.green }}>{showDone ? 'Hide Done' : 'Show Done'}</button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr' : 'repeat(2,1fr)', gap: mob ? 16 : 20 }}>
                {weekGroups.map(({ label, stories }) => (
                  <div key={label}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, paddingBottom: 8, borderBottom: `1px solid ${C.border}` }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: C.heading }}>{label}</span>
                      <span style={{ fontSize: 11, fontWeight: 500, padding: '1px 8px', borderRadius: 20, background: C.grayBg, color: C.muted, border: `1px solid ${C.borderLight}` }}>{stories.filter(s => taskState[s.id] === STATUS.DONE).length}/{stories.length}</span>
                    </div>
                    {stories.length === 0
                      ? <div style={{ fontSize: 13, color: C.subtle, fontStyle: 'italic' }}>No matching tasks</div>
                      : stories.map(s => (
                        <StoryCard key={s.id} story={s} status={taskState[s.id] || STATUS.TODO}
                          onStatusChange={st => updateStatus(s.id, st)}
                          note={notes[s.id] || ''} onNoteChange={n => updateNote(s.id, n)} />
                      ))
                    }
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Board View */}
          {view === 'board' && (
            <>
              <div style={{ marginBottom: 20 }}>
                <h1 style={{ fontWeight: 700, fontSize: 22, color: C.heading, marginBottom: 4, letterSpacing: '-0.01em' }}>Board View</h1>
              </div>
              <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
                {SPRINTS.map(s => {
                  const active = s.id === activeSprint
                  return (
                    <button key={s.id} onClick={() => setActiveSprint(s.id)} style={{ fontSize: 12, fontWeight: active ? 600 : 400, padding: '5px 14px', borderRadius: 6, cursor: 'pointer', border: `1px solid ${active ? C.accent + '40' : C.border}`, background: active ? C.accentLight : C.surface, color: active ? C.accent : C.muted }}>S{s.num}</button>
                  )
                })}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr' : 'repeat(3,1fr)', gap: mob ? 12 : 16 }}>
                {[STATUS.TODO, STATUS.INPROG, STATUS.DONE].map(st => {
                  const col = spStories.filter(s => taskState[s.id] === st)
                  const sm2 = STATUS_META[st]
                  return (
                    <div key={st}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, padding: '10px 12px', borderRadius: 8, background: C.surface, border: `1px solid ${C.border}`, boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: sm2.color }} />
                        <span style={{ fontSize: 12, fontWeight: 600, color: sm2.color }}>{sm2.label}</span>
                        <span style={{ fontSize: 12, fontWeight: 500, color: C.subtle, marginLeft: 'auto' }}>{col.length}</span>
                      </div>
                      {col.map(s => <StoryCard key={s.id} story={s} status={taskState[s.id] || STATUS.TODO} onStatusChange={ns => updateStatus(s.id, ns)} note={notes[s.id] || ''} onNoteChange={n => updateNote(s.id, n)} />)}
                      {col.length === 0 && <div style={{ fontSize: 13, color: C.subtle, textAlign: 'center', padding: '24px 0', border: `1px dashed ${C.border}`, borderRadius: 10, background: C.grayBg }}>Empty</div>}
                    </div>
                  )
                })}
              </div>
            </>
          )}

          {/* Overview */}
          {view === 'overview' && (
            <>
              <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontWeight: 700, fontSize: 22, color: C.heading, marginBottom: 4, letterSpacing: '-0.01em' }}>My Overview</h1>
                <p style={{ fontSize: 14, color: C.muted }}>6-Month Program · {allStories.length} tasks · {allStories.reduce((a, s) => a + s.points, 0)} story points</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: mob ? 'repeat(2,1fr)' : 'repeat(4,1fr)', gap: 12, marginBottom: 24 }}>
                {[{ label: 'Completion', value: `${totalPct}%`, color: C.green }, { label: 'Done', value: totalDone, color: C.green }, { label: 'In Progress', value: totalInProg, color: C.amber }, { label: 'Points Earned', value: `${allStories.filter(s => taskState[s.id] === STATUS.DONE).reduce((a, s) => a + s.points, 0)}/${allStories.reduce((a, s) => a + s.points, 0)}`, color: C.accent }].map(stat => (
                  <div key={stat.label} style={{ padding: '16px 18px', borderRadius: 10, background: C.surface, border: `1px solid ${C.border}`, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                    <div style={{ fontSize: 24, fontWeight: 700, color: stat.color, marginBottom: 4 }}>{stat.value}</div>
                    <div style={{ fontSize: 12, fontWeight: 500, color: C.muted }}>{stat.label}</div>
                  </div>
                ))}
              </div>
              <div style={{ border: `1px solid ${C.border}`, borderRadius: 10, overflow: 'hidden', background: C.surface }}>
                {SPRINTS.map(s => {
                  const d = s.stories.filter(t => taskState[t.id] === STATUS.DONE).length
                  const p = Math.round(d / s.stories.length * 100)
                  return (
                    <div key={s.id} onClick={() => { setActiveSprint(s.id); setView('sprint') }} style={{ display: 'grid', gridTemplateColumns: mob ? '24px 1fr 50px' : '40px 1fr 120px 80px', padding: mob ? '12px 14px' : '14px 18px', borderBottom: `1px solid ${C.borderLight}`, cursor: 'pointer' }}
                      onMouseEnter={e => e.currentTarget.style.background = C.grayBg}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ width: mob ? 8 : 10, height: mob ? 8 : 10, borderRadius: '50%', background: p === 100 ? C.green : p > 0 ? C.accent : C.border }} />
                      </div>
                      <div>
                        <div style={{ fontSize: mob ? 13 : 14, fontWeight: 600, color: C.heading, marginBottom: 2 }}>Sprint {s.num}: {s.title}</div>
                        <div style={{ fontSize: 12, color: C.muted }}>Month {s.num} · {s.stories.length} tasks</div>
                      </div>
                      {!mob && (
                        <div style={{ display: 'flex', alignItems: 'center', paddingRight: 12 }}>
                          <ProgressBar pct={p} color={p === 100 ? C.green : C.accent} height={4} />
                        </div>
                      )}
                      <div style={{ fontSize: 13, fontWeight: 700, color: p === 100 ? C.green : p > 0 ? C.accent : C.subtle, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{p}%</div>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
