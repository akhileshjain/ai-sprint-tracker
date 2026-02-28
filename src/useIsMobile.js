import { useState, useEffect } from 'react'

export function useIsMobile(breakpoint = 768) {
  const [mobile, setMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < breakpoint : false
  )

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`)
    const handler = (e) => setMobile(e.matches)
    mql.addEventListener('change', handler)
    setMobile(mql.matches)
    return () => mql.removeEventListener('change', handler)
  }, [breakpoint])

  return mobile
}
