import { useState, useRef, useEffect } from 'react'
import { SCRIPTS } from '../data/scripts'
import './ScriptSelector.css'

// Large chip selector, not a native <select> — needs to be thumb-friendly
// and show native script glyphs in-line so users recognize their script
// by sight, not just by English name (many users may not know the
// English name "Gurmukhi" but will recognize the glyphs instantly).

export default function ScriptSelector({ label, value, onChange, detectedCode, detectedConfidence }) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)
  const current = SCRIPTS.find((s) => s.code === value)

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="script-selector" ref={containerRef}>
      <span className="script-selector__label">{label}</span>

      <button
        type="button"
        className="script-selector__trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="script-selector__native script-text">{current?.native}</span>
        <span className="script-selector__name">{current?.name}</span>
        <svg className="script-selector__chevron" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {detectedCode && detectedCode !== value && (
        <button
          type="button"
          className="script-selector__detected-chip"
          onClick={() => onChange(detectedCode)}
          title="Use detected script"
        >
          Detected: {SCRIPTS.find((s) => s.code === detectedCode)?.name}
          {detectedConfidence < 0.7 ? ' (uncertain)' : ''}
        </button>
      )}

      {open && (
        <ul className="script-selector__list" role="listbox">
          {SCRIPTS.map((script) => (
            <li key={script.code} role="option" aria-selected={script.code === value}>
              <button
                type="button"
                className="script-selector__option"
                onClick={() => {
                  onChange(script.code)
                  setOpen(false)
                }}
              >
                <span className="script-text script-selector__option-native">{script.native}</span>
                <span className="script-selector__option-name">{script.name}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
