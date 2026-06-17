import { useEffect, useRef, useState } from 'react'
import './Panels.css'

// Large textarea with debounced auto-detection as the user types.
// Debounce avoids calling detectScript() on every keystroke.

export default function TextInputPanel({ value, onChange, onDetect, scriptName }) {
  const timeoutRef = useRef(null)

  useEffect(() => {
    clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      onDetect(value)
    }, 350)
    return () => clearTimeout(timeoutRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return (
    <div className="panel panel--input">
      <div className="panel__header">
        <span className="panel__title">Original — {scriptName}</span>
      </div>
      <textarea
        className="panel__textarea script-text"
        placeholder="Type or paste text here…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={6}
        aria-label="Text to transliterate"
      />
    </div>
  )
}
