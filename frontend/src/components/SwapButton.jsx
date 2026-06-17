import { useState } from 'react'
import './SwapButton.css'

// Signature element: styled as a literal signpost between the two script
// panels — a nod to the road-sign subject matter rather than a generic
// icon button. Single deliberate 180° rotation on tap, nothing ambient.

export default function SwapButton({ onSwap }) {
  const [spinning, setSpinning] = useState(false)

  function handleClick() {
    setSpinning(true)
    onSwap()
    setTimeout(() => setSpinning(false), 320)
  }

  return (
    <div className="swap-button__wrap">
      <div className="swap-button__post" aria-hidden="true" />
      <button
        type="button"
        className={`swap-button ${spinning ? 'swap-button--spin' : ''}`}
        onClick={handleClick}
        aria-label="Swap source and target scripts"
        title="Swap scripts"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M3 7h11M11 3l3 4-3 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M17 13H6M9 17l-3-4 3-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  )
}
