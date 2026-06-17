import { useState } from 'react'
import './Panels.css'

export default function ResultPanel({ value, scriptName, lossy, lossyNotes }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    if (!value) return
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // Clipboard API unavailable — fail quietly, copy is a convenience, not critical path
    }
  }

  return (
    <div className="panel panel--result">
      <div className="panel__header">
        <span className="panel__title">Transliterated — {scriptName}</span>
        <button
          type="button"
          className="panel__copy-btn"
          onClick={handleCopy}
          disabled={!value}
          aria-label="Copy transliterated text"
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      <div className="panel__output script-text" aria-live="polite">
        {value || <span className="panel__placeholder">Result appears here</span>}
      </div>

      {lossy && (
        <div className="panel__lossy-badge" role="status">
          <span aria-hidden="true">⚠</span> Some sounds approximated
          {lossyNotes?.length > 0 && (
            <ul className="panel__lossy-notes">
              {lossyNotes.map((note, i) => (
                <li key={i}>{note}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
