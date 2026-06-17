import { useEffect, useState } from 'react'
import './InstallPrompt.css'

// Custom install banner since native browser prompts are inconsistent
// across Android Chrome and iOS Safari (iOS has no beforeinstallprompt
// event at all — needs manual "Add to Home Screen" instructions instead).

const DISMISSED_KEY = 'lipisetu:install-dismissed'

function isIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
}

export default function InstallPrompt() {
  const [deferredEvent, setDeferredEvent] = useState(null)
  const [visible, setVisible] = useState(false)
  const [showIOSSteps, setShowIOSSteps] = useState(false)

  useEffect(() => {
    if (localStorage.getItem(DISMISSED_KEY)) return

    function handleBeforeInstall(e) {
      e.preventDefault()
      setDeferredEvent(e)
      setVisible(true)
    }
    window.addEventListener('beforeinstallprompt', handleBeforeInstall)

    // iOS never fires beforeinstallprompt — show manual steps instead,
    // but only if not already installed (display-mode: standalone)
    if (isIOS() && !window.navigator.standalone) {
      setVisible(true)
    }

    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall)
  }, [])

  function handleDismiss() {
    setVisible(false)
    try {
      localStorage.setItem(DISMISSED_KEY, '1')
    } catch {
      /* non-fatal */
    }
  }

  async function handleInstallClick() {
    if (isIOS()) {
      setShowIOSSteps(true)
      return
    }
    if (deferredEvent) {
      deferredEvent.prompt()
      await deferredEvent.userChoice
      setVisible(false)
    }
  }

  if (!visible) return null

  return (
    <div className="install-prompt">
      <div className="install-prompt__text">
        <strong>Install LipiSetu</strong>
        <span>Use it offline, straight from your home screen.</span>
      </div>

      {showIOSSteps ? (
        <p className="install-prompt__ios-steps">
          Tap the Share icon, then "Add to Home Screen".
        </p>
      ) : (
        <button type="button" className="install-prompt__btn" onClick={handleInstallClick}>
          Install
        </button>
      )}

      <button type="button" className="install-prompt__dismiss" onClick={handleDismiss} aria-label="Dismiss">
        ✕
      </button>
    </div>
  )
}
