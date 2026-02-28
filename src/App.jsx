import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import { useTheme } from './ThemeContext'
import Login from './pages/Login'
import Tracker from './pages/Tracker'
import AdminDashboard from './pages/AdminDashboard'

export default function App() {
  const { C } = useTheme()
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) loadProfile(session.user.id)
      else setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) loadProfile(session.user.id)
      else { setProfile(null); setLoading(false) }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function loadProfile(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, full_name, is_admin')
      .eq('id', userId)
      .single()

    if (error || !data) {
      // Profile may not exist yet — try to create it
      const user = (await supabase.auth.getUser()).data.user
      if (user) {
        const { error: upsertError } = await supabase.from('profiles').upsert({
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || '',
          is_admin: false,
        })
        if (upsertError) {
          console.error('Failed to create profile:', upsertError.message)
          setLoading(false)
          return
        }
        const { data: newProfile, error: fetchError } = await supabase.from('profiles').select('*').eq('id', user.id).single()
        if (fetchError) console.error('Failed to fetch new profile:', fetchError.message)
        setProfile(newProfile)
      }
    } else {
      setProfile(data)
    }
    setLoading(false)
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    setSession(null)
    setProfile(null)
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.3s' }}>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        <div style={{ width: 32, height: 32, border: `3px solid ${C.border}`, borderTopColor: C.accent, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      </div>
    )
  }

  if (!session) return <Login />

  if (!profile) {
    return (
      <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.muted, fontFamily: "'Inter','system-ui',-apple-system,'Segoe UI',sans-serif", fontSize: 14, transition: 'background 0.3s, color 0.3s' }}>
        Setting up your account…
      </div>
    )
  }

  if (profile.is_admin) return <AdminDashboard profile={profile} onSignOut={handleSignOut} />

  return <Tracker profile={profile} onSignOut={handleSignOut} />
}
