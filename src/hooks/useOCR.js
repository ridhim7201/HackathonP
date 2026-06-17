// useOCR
// Calls Part 3's POST /api/ocr endpoint. Defines the API contract Part 1
// depends on (see PART_3_OCR_BACKEND.md, section 3.5) and provides a stub
// response so the camera flow is fully clickable/testable before the
// backend exists.
//
// Expected real contract:
//   POST /api/ocr  { image: base64String }
//   -> {
//        blocks: [{ text, confidence, boundingBox: {x,y,width,height} }],
//        engineUsed: "tesseract" | "cloud-vision"
//      }

import { useCallback, useState } from 'react'

async function stubOCR(imageBase64) {
  // Simulate network latency so loading states can be built/tested for real.
  await new Promise((r) => setTimeout(r, 900))
  return {
    blocks: [
      {
        text: 'स्वागत है',
        confidence: 0.91,
        boundingBox: { x: 40, y: 120, width: 220, height: 60 }
      }
    ],
    engineUsed: 'stub'
  }
}

export function useOCR() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const runOCR = useCallback(async (imageBase64) => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/ocr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageBase64 })
      })

      if (!res.ok) {
        throw new Error(`OCR request failed: ${res.status}`)
      }

      const data = await res.json()
      setIsLoading(false)
      return data
    } catch (err) {
      // Backend not running yet (Part 3 in progress) or genuinely offline.
      // Fall back to the stub so the camera UI remains demoable either way.
      console.warn('[useOCR] live endpoint unavailable, using stub:', err.message)
      const stub = await stubOCR(imageBase64)
      setIsLoading(false)
      return stub
    }
  }, [])

  return { runOCR, isLoading, error }
}
