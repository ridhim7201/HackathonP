import { useRoute } from './router/useNavigate'
import { useAppStore } from './store/useAppStore'
import HomePage from './pages/HomePage'
import CameraPage from './pages/CameraPage'
import OfflineBanner from './components/OfflineBanner'
import InstallPrompt from './components/InstallPrompt'
import './App.css'

export default function App() {
  const path = useRoute()
  const isOffline = useAppStore((s) => s.isOffline)

  return (
    <div className="app-shell">
      <header className="app-shell__header">
        <span className="app-shell__logo">LipiSetu</span>
        <span className="app-shell__tagline">script bridge</span>
      </header>

      {isOffline && <OfflineBanner cameraAvailableOffline={false} />}

      <main>
        {path === '/camera' ? <CameraPage /> : <HomePage />}
      </main>

      <InstallPrompt />
    </div>
  )
}
