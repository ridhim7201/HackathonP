import { create } from 'zustand'
import { DEFAULT_SOURCE, DEFAULT_TARGET } from '../data/scripts'

const STORAGE_KEY = 'lipisetu:last-script-pair'

function loadPersisted() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

const persisted = loadPersisted()

export const useAppStore = create((set, get) => ({
  sourceScript: persisted?.sourceScript || DEFAULT_SOURCE,
  targetScript: persisted?.targetScript || DEFAULT_TARGET,
  inputText: '',
  outputText: '',
  lossy: false,
  lossyNotes: [],
  isOffline: !navigator.onLine,

  setSourceScript: (code) => {
    set({ sourceScript: code })
    get()._persist()
  },

  setTargetScript: (code) => {
    set({ targetScript: code })
    get()._persist()
  },

  swapScripts: () => {
    const { sourceScript, targetScript, inputText, outputText } = get()
    set({
      sourceScript: targetScript,
      targetScript: sourceScript,
      // swap content too, per the explicit requirement that swap
      // exchanges both the selected scripts AND the text
      inputText: outputText,
      outputText: inputText
    })
    get()._persist()
  },

  setInputText: (text) => set({ inputText: text }),

  setResult: ({ output, lossy, notes }) =>
    set({ outputText: output, lossy: !!lossy, lossyNotes: notes || [] }),

  setOffline: (isOffline) => set({ isOffline }),

  _persist: () => {
    const { sourceScript, targetScript } = get()
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ sourceScript, targetScript }))
    } catch {
      // localStorage unavailable (private mode etc.) — non-fatal, just skip persistence
    }
  }
}))

// Wire up online/offline listeners once, outside the store body
window.addEventListener('online', () => useAppStore.getState().setOffline(false))
window.addEventListener('offline', () => useAppStore.getState().setOffline(true))
