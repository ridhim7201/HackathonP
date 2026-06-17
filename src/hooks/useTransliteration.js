// useTransliteration
// Thin wrapper around Part 2's engine. Part 1 does not implement any
// script-conversion logic itself — this hook is the ONLY place that
// boundary is crossed, so when Part 2 ships their real module, only
// this file needs to change.
//
// Expected real contract (per PART_2_TRANSLITERATION_ENGINE.md):
//   transliterate(text, sourceScript, targetScript)
//     -> { output, lossy, notes, confidence }
//
// Until that module lands, we fall back to a clearly-labeled stub so
// the rest of the UI can be built and tested end-to-end right now.

import { useCallback, useState } from 'react'

let engineModule = null

async function loadEngine() {
  if (engineModule) return engineModule
  try {
    // Part 2 should export from src/engine/transliterate.js with this
    // exact named export. If it's not there yet, we fall through to stub.
    engineModule = await import('../engine/transliterate.js')
  } catch {
    engineModule = null
  }
  return engineModule
}

function stubTransliterate(text, sourceScript, targetScript) {
  // Visibly fake, on purpose — never silently pretend this is real output.
  return {
    output: text ? `[stub:${sourceScript}→${targetScript}] ${text}` : '',
    lossy: false,
    notes: [],
    confidence: 0
  }
}

export function useTransliteration() {
  const [isReady, setIsReady] = useState(false)
  const [usingStub, setUsingStub] = useState(true)

  const transliterate = useCallback(async (text, sourceScript, targetScript) => {
    if (!text) {
      return { output: '', lossy: false, notes: [], confidence: 1 }
    }

    const mod = await loadEngine()
    if (mod && typeof mod.transliterate === 'function') {
      setUsingStub(false)
      setIsReady(true)
      return mod.transliterate(text, sourceScript, targetScript)
    }

    setUsingStub(true)
    setIsReady(true)
    return stubTransliterate(text, sourceScript, targetScript)
  }, [])

  return { transliterate, isReady, usingStub }
}
