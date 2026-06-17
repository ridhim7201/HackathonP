import { useRef, useState, useEffect, useCallback } from 'react'
import './CameraCapture.css'

export default function CameraCapture({ onCapture }) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)
  const [permissionDenied, setPermissionDenied] = useState(false)
  const [isStarting, setIsStarting] = useState(true)

  const startCamera = useCallback(async () => {
    setIsStarting(true)
    setPermissionDenied(false)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' } // rear camera — this is for reading signs, not selfies
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (err) {
      console.warn('[CameraCapture] camera unavailable:', err.message)
      setPermissionDenied(true)
    } finally {
      setIsStarting(false)
    }
  }, [])

  useEffect(() => {
    startCamera()
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop())
    }
  }, [startCamera])

  function handleCapture() {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    const base64 = canvas.toDataURL('image/jpeg', 0.85)
    onCapture(base64)
  }

  function handleFileUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => onCapture(reader.result)
    reader.readAsDataURL(file)
  }

  if (permissionDenied) {
    return (
      <div className="camera-capture camera-capture--fallback">
        <p className="camera-capture__message">
          Camera access isn't available. You can still upload a photo of the sign.
        </p>
        <label className="camera-capture__upload-btn">
          Choose a photo
          <input type="file" accept="image/*" capture="environment" onChange={handleFileUpload} hidden />
        </label>
      </div>
    )
  }

  return (
    <div className="camera-capture">
      <div className="camera-capture__viewport">
        <video ref={videoRef} autoPlay playsInline muted className="camera-capture__video" />
        {isStarting && <div className="camera-capture__starting">Starting camera…</div>}
        <canvas ref={canvasRef} hidden />
      </div>

      <button
        type="button"
        className="camera-capture__shutter"
        onClick={handleCapture}
        disabled={isStarting}
        aria-label="Capture photo of signboard"
      />

      <label className="camera-capture__upload-link">
        or upload a photo instead
        <input type="file" accept="image/*" capture="environment" onChange={handleFileUpload} hidden />
      </label>
    </div>
  )
}
