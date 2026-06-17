import './OfflineBanner.css'

export default function OfflineBanner({ cameraAvailableOffline }) {
  return (
    <div className="offline-banner" role="status">
      <span aria-hidden="true">⚡</span>
      {cameraAvailableOffline
        ? "You're offline — text transliteration still works."
        : "You're offline — camera reading unavailable, text transliteration still works."}
    </div>
  )
}
