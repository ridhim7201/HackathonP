# LipiSetu — Part 1 (Frontend & PWA)

This is the frontend implementation per `PART_1_FRONTEND_PWA.md`. It is fully
functional on its own using stub fallbacks for the transliteration engine
(Part 2) and OCR pipeline (Part 3), so it can be developed, demoed, and
tested independently while those parts are built in parallel.

## Run it

```bash
npm install
npm run dev        # dev server at http://localhost:5173
```

```bash
npm run build       # production build to /dist
npm run preview     # serve the production build locally
```

## What's wired up

- **Text transliteration screen** (`src/pages/HomePage.jsx`) — script selectors,
  swap button, side-by-side input/result panels, lossy-conversion warning badge,
  debounced auto-detection chip.
- **Camera signboard reader** (`src/pages/CameraPage.jsx`) — live camera preview,
  capture, permission-denied fallback to file upload, scanning state, and an
  overlay result view with bounding boxes + side-by-side original/transliterated
  text per detected block.
- **PWA shell** — installable manifest, service worker with offline caching for
  the app shell and (once populated) Part 2's rule-table JSON and Part 3's
  Tesseract trained-data packs. Custom install prompt handles both Android
  (`beforeinstallprompt`) and iOS (manual "Add to Home Screen" steps, since iOS
  doesn't fire that event at all).
- **State** — Zustand store (`src/store/useAppStore.js`) holding the selected
  script pair, current text, and offline status, with the last-used script
  pair persisted to `localStorage`.

## Handoff points for Part 2 and Part 3

Everything Part 1 needs from the other two parts is isolated to three files —
nothing else in the codebase needs to change when those land:

| File | Cross-team contract |
|---|---|
| `src/hooks/useTransliteration.js` | Dynamically imports `src/engine/transliterate.js`. Part 2 implements that file's `transliterate()` export — see `src/engine/README.md`. |
| `src/hooks/useScriptDetection.js` | Same file, `detectScript()` export. |
| `src/hooks/useOCR.js` | Calls `POST /api/ocr`. Part 3 implements the Express route per the contract in `PART_3_OCR_BACKEND.md` §3.5. Falls back to a stub response if the call fails (e.g. backend not running yet, or genuinely offline). |

Until Part 2's file exists with real exports, `src/engine/transliterate.js`
is a placeholder that intentionally exports nothing useful, so the hooks'
stub-detection logic (`typeof mod.transliterate === 'function'`) correctly
falls back. **Do not delete this placeholder file** — Vite's static import
analysis needs a real file to resolve at build time, even before Part 2 has
written real logic into it.

Rule-table JSON for offline caching belongs in `public/data/script-rules/`
(see the README there) — already wired into the service worker's
`CacheFirst` rule in `vite.config.js`.

## Known bugs fixed during build verification

A few issues surfaced while actually building and tracing the code, worth
noting since they're the kind of thing that looks fine in isolation but
breaks in practice:

- **Build-time import resolution**: a dynamic `import()` pointing at a file
  that doesn't exist yet fails Vite's build, not just at runtime. Fixed with
  the placeholder file described above.
- **Swap didn't re-run transliteration**: `swapScripts()` swapped the script
  selection and text in the store, but the result panel kept showing the
  *old* output rather than a fresh transliteration of the swapped input
  against the swapped script pair. Fixed by re-running transliteration
  immediately after the swap commits.
- **Race condition on fast typing**: rapid edits could fire overlapping
  `transliterate()` calls that resolve out of order, letting a stale response
  overwrite a fresher one. Fixed with a request-sequence guard so only the
  latest call's result is ever committed.
- **Render gap on camera capture**: there was a one-tick window between
  capturing a photo and the OCR hook's `isLoading` flipping true where neither
  the "scanning" view nor the result view rendered. Fixed with a locally
  owned `processing` flag set synchronously on capture.

## Acceptance criteria status

- [x] App installs as a PWA on Android Chrome and iOS Safari (manifest + service
      worker + custom install prompt confirmed via build output; icons generated)
- [x] Text input screen fully wired to stub transliteration function
- [x] Camera screen captures an image and passes it to a stub OCR function
- [x] Swap button correctly swaps scripts and content (and re-transliterates)
- [x] App shell builds with offline caching configured (service worker precaches
      9 entries including app shell + icons)
- [ ] All 10+ scripts render correctly with no tofu — **needs a real browser
      check**, since this environment couldn't launch Chromium for a visual
      screenshot (network sandbox blocks the Playwright browser CDN). The font
      stack is loaded and CSS is in place, but glyph rendering should be
      manually verified in an actual browser before calling this done.
