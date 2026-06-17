// Minimal router for LipiSetu.
// Only two screens exist (home, camera) — pulling in react-router for
// this would be overkill, same philosophy as choosing Zustand over Redux
// in the state management section. Hash-based so it works correctly
// inside an installed PWA shell with no server-side routing config needed.

import { useEffect, useState, useCallback } from 'react'

function getCurrentPath() {
  const hash = window.location.hash.replace(/^#/, '')
  return hash || '/'
}

export function useNavigate() {
  return useCallback((path) => {
    window.location.hash = path
  }, [])
}

export function useRoute() {
  const [path, setPath] = useState(getCurrentPath())

  useEffect(() => {
    function handleHashChange() {
      setPath(getCurrentPath())
    }
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  return path
}
