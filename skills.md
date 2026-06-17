# Skills & Tech Stack — LipiSetu

A reference for what each part of the project uses, so anyone picking up a piece of the codebase knows what they need to know going in.

## Part 1 — Frontend & PWA (Ridhi M)

- **React + Vite** — component structure, hooks, state via Zustand
- **PWA fundamentals** — Web App Manifest, service workers, Workbox caching strategies (`vite-plugin-pwa`)
- **CSS** — custom design tokens (CSS variables), responsive/mobile-first layout, no framework dependency
- **Browser APIs** — `navigator.mediaDevices.getUserMedia` (camera), Canvas API (image capture), Clipboard API, `localStorage`
- **Accessibility basics** — focus states, `aria-live`, semantic roles for the script selector listbox

## Part 2 — Transliteration Engine (Siri M)

- **Sanscript.js** — the base Indic transliteration library this engine extends
- **ISO-15919 / IAST** — the common phonetic intermediate representation used for hub-and-spoke script conversion
- **Unicode block ranges** — for script auto-detection (each Brahmic script occupies a distinct range)
- **Linguistics fundamentals specific to this project**: schwa deletion, vocalic consonants, anusvara/chandrabindu nasalization, conjunct consonants, and script-specific quirks (Tamil's lack of voiced/aspirated consonant distinctions, Malayalam chillu letters)
- **JS module design** — building a dependency-free, offline-capable engine with a clean exported function signature (`transliterate()`, `detectScript()`)

## Part 3 — OCR & Backend (Sharanya B)

- **Node.js + Express** — thin REST API design, route structure, environment-based config
- **Tesseract.js** — in-browser OCR via WebAssembly, Indic-trained language packs, confidence scoring
- **Google Cloud Vision API** — `TEXT_DETECTION` / `DOCUMENT_TEXT_DETECTION` endpoints, server-side API key handling
- **Image preprocessing** — grayscale conversion, contrast/adaptive thresholding, perspective correction, using `sharp`/`jimp` or the Canvas API
- **API design under real-world constraints** — handling low-confidence results, empty detections, mixed-script images, and rate limiting

## Shared across all three parts

- **Git workflow** — feature branches, pull requests (this repo currently allows direct pushes to `main`, but branch protection may be added later — see CONTRIBUTIONS.md)
- **The core constraint**: this is transliteration, not translation. No part of the system should call an LLM to change meaning — only script/sound mapping is in scope.
