// useScriptDetection
// Calls Part 2's detectScript() when available. Includes a basic
// Unicode-range stub so the "Detected: X" chip works immediately
// during Part 1 development, without waiting on Part 2.

import { useCallback } from 'react'

// Same reasoning as useTransliteration.js — keep the real-module probe
// in one place so swapping in Part 2's actual code is a one-line change.
let engineModule = null
async function loadEngine() {
  if (engineModule) return engineModule
  try {
    engineModule = await import('../engine/transliterate.js')
  } catch {
    engineModule = null
  }
  return engineModule
}

// Minimal Unicode block ranges — good enough for a dev-time stub.
// Part 2 owns the authoritative version of this table.
const RANGES = [
  { code: 'deva', test: (c) => c >= 0x0900 && c <= 0x097f },
  { code: 'beng', test: (c) => c >= 0x0980 && c <= 0x09ff },
  { code: 'guru', test: (c) => c >= 0x0a00 && c <= 0x0a7f },
  { code: 'gujr', test: (c) => c >= 0x0a80 && c <= 0x0aff },
  { code: 'orya', test: (c) => c >= 0x0b00 && c <= 0x0b7f },
  { code: 'taml', test: (c) => c >= 0x0b80 && c <= 0x0bff },
  { code: 'telu', test: (c) => c >= 0x0c00 && c <= 0x0c7f },
  { code: 'knda', test: (c) => c >= 0x0c80 && c <= 0x0cff },
  { code: 'mlym', test: (c) => c >= 0x0d00 && c <= 0x0d7f },
  { code: 'mtei', test: (c) => c >= 0xaae0 && c <= 0xaaff }
]

function stubDetect(text) {
  if (!text) return { script: null, confidence: 0 }

  const counts = {}
  for (const ch of text) {
    const cp = ch.codePointAt(0)
    const match = RANGES.find((r) => r.test(cp))
    if (match) counts[match.code] = (counts[match.code] || 0) + 1
  }

  const entries = Object.entries(counts)
  if (entries.length === 0) {
    // No Indic ranges matched at all -> default fallback is Latin/romanized
    return { script: 'latn', confidence: 0.5 }
  }

  entries.sort((a, b) => b[1] - a[1])
  const [topScript, topCount] = entries[0]
  const totalIndicChars = entries.reduce((sum, [, n]) => sum + n, 0)
  return { script: topScript, confidence: topCount / totalIndicChars }
}

export function useScriptDetection() {
  const detect = useCallback(async (text) => {
    const mod = await loadEngine()
    if (mod && typeof mod.detectScript === 'function') {
      return mod.detectScript(text)
    }
    return stubDetect(text)
  }, [])

  return { detect }
}
