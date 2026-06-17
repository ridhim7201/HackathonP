import { useState, useRef } from 'react'
import { useNavigate } from '../router/useNavigate'
import { useAppStore } from '../store/useAppStore'
import { useTransliteration } from '../hooks/useTransliteration'
import { useScriptDetection } from '../hooks/useScriptDetection'
import { getScriptByCode } from '../data/scripts'
import ScriptSelector from '../components/ScriptSelector'
import SwapButton from '../components/SwapButton'
import TextInputPanel from '../components/TextInputPanel'
import ResultPanel from '../components/ResultPanel'
import './HomePage.css'

export default function HomePage() {
  const navigate = useNavigate()
  const {
    sourceScript, targetScript, inputText, outputText, lossy, lossyNotes,
    setSourceScript, setTargetScript, swapScripts, setInputText, setResult
  } = useAppStore()

  const { transliterate, usingStub } = useTransliteration()
  const { detect } = useScriptDetection()
  const [detected, setDetected] = useState({ script: null, confidence: 0 })

  // Guards against out-of-order async responses: if the user types fast,
  // an older transliterate() call could resolve after a newer one and
  // overwrite fresher output with stale results. Only the latest request
  // is allowed to commit its result.
  const requestSeq = useRef(0)
  const debounceRef = useRef(null)

  async function runTransliterate(text, source, target) {
    const seq = ++requestSeq.current
    const result = await transliterate(text, source, target)
    if (seq === requestSeq.current) {
      setResult(result)
    }
  }

  function handleInputChange(text) {
    // Textarea updates immediately (no debounce) so typing feels responsive.
    // The transliteration call itself IS debounced — firing the engine on
    // every keystroke would be wasteful, and once Part 2's engine is wired
    // in for real (rather than the instant stub), this avoids visible jank.
    setInputText(text)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      runTransliterate(text, sourceScript, targetScript)
    }, 200)
  }

  async function handleDetect(text) {
    const result = await detect(text)
    setDetected(result)
  }

  async function handleSourceChange(code) {
    setSourceScript(code)
    await runTransliterate(inputText, code, targetScript)
  }

  async function handleTargetChange(code) {
    setTargetScript(code)
    await runTransliterate(inputText, sourceScript, code)
  }

  async function handleSwap() {
    swapScripts()
    // swapScripts() swaps scripts AND text in the store, but the swapped
    // input still needs to be re-run through the engine against the new
    // script pair — otherwise outputText is just the old, now-stale result.
    const { sourceScript: newSource, targetScript: newTarget, inputText: newInput } = useAppStore.getState()
    await runTransliterate(newInput, newSource, newTarget)
  }

  return (
    <div className="home-page">
      <section className="home-page__hero">
        <h1 className="home-page__title">Read any script, in the one you know</h1>
        <p className="home-page__subtitle">
          Script conversion, not translation — meaning stays exactly as written.
        </p>
      </section>

      <button type="button" className="home-page__camera-cta" onClick={() => navigate('/camera')}>
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
          <path d="M3 7.5A1.5 1.5 0 0 1 4.5 6h2.1l.7-1.4A1.5 1.5 0 0 1 8.65 4h4.7a1.5 1.5 0 0 1 1.35.6L15.4 6h2.1A1.5 1.5 0 0 1 19 7.5v9A1.5 1.5 0 0 1 17.5 18h-13A1.5 1.5 0 0 1 3 16.5v-9Z" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="11" cy="11.5" r="3.2" stroke="currentColor" strokeWidth="1.6" />
        </svg>
        Read a signboard with your camera
      </button>

      <div className="home-page__selectors">
        <ScriptSelector
          label="Source script"
          value={sourceScript}
          onChange={handleSourceChange}
          detectedCode={detected.script}
          detectedConfidence={detected.confidence}
        />
        <SwapButton onSwap={handleSwap} />
        <ScriptSelector label="Target script" value={targetScript} onChange={handleTargetChange} />
      </div>

      <div className="panel-row">
        <TextInputPanel
          value={inputText}
          onChange={handleInputChange}
          onDetect={handleDetect}
          scriptName={getScriptByCode(sourceScript)?.name}
        />
        <ResultPanel
          value={outputText}
          scriptName={getScriptByCode(targetScript)?.name}
          lossy={lossy}
          lossyNotes={lossyNotes}
        />
      </div>

      {usingStub && (
        <p className="home-page__dev-note">
          Running on stub engine — Part 2's transliteration module isn't connected yet.
        </p>
      )}
    </div>
  )
}
