import { useState } from 'react'
import { useNavigate } from '../router/useNavigate'
import { useAppStore } from '../store/useAppStore'
import { useOCR } from '../hooks/useOCR'
import { useTransliteration } from '../hooks/useTransliteration'
import { useScriptDetection } from '../hooks/useScriptDetection'
import { getScriptByCode } from '../data/scripts'
import CameraCapture from '../components/CameraCapture'
import OverlayResult from '../components/OverlayResult'
import './CameraPage.css'

export default function CameraPage() {
  const navigate = useNavigate()
  const { targetScript, isOffline } = useAppStore()
  const { runOCR } = useOCR()
  const { transliterate } = useTransliteration()
  const { detect } = useScriptDetection()

  const [capturedImage, setCapturedImage] = useState(null)
  const [blocks, setBlocks] = useState(null)
  const [processing, setProcessing] = useState(false)

  async function handleCapture(imageBase64) {
    setCapturedImage(imageBase64)
    setBlocks(null)
    setProcessing(true)

    const ocrResult = await runOCR(imageBase64)

    // For each OCR block, run it through the transliteration engine
    // independently — a signboard may contain mixed scripts, so each
    // block is converted on its own rather than assuming one script
    // applies to the whole image.
    const enriched = await Promise.all(
      ocrResult.blocks.map(async (block) => {
        const detected = await detect(block.text)
        const result = await transliterate(block.text, detected.script, targetScript)
        return {
          ...block,
          detectedScript: detected.script,
          transliterated: result.output,
          lossy: result.lossy
        }
      })
    )

    setBlocks(enriched)
    setProcessing(false)
  }

  function handleRetake() {
    setCapturedImage(null)
    setBlocks(null)
    setProcessing(false)
  }

  return (
    <div className="camera-page">
      <button type="button" className="camera-page__back" onClick={() => navigate('/')}>
        ← Back
      </button>

      <h2 className="camera-page__title">
        Point at a sign — we'll show it in {getScriptByCode(targetScript)?.name}
      </h2>

      {!capturedImage && <CameraCapture onCapture={handleCapture} />}

      {capturedImage && processing && (
        <div className="camera-page__scanning">
          <img src={capturedImage} alt="Captured signboard" className="camera-page__scanning-img" />
          <p>Reading the sign…</p>
        </div>
      )}

      {capturedImage && !processing && blocks && (
        <OverlayResult image={capturedImage} blocks={blocks} onRetake={handleRetake} />
      )}

      {isOffline && (
        <p className="camera-page__offline-note">
          You're offline — using on-device text recognition. Results may be less accurate than online mode.
        </p>
      )}
    </div>
  )
}
