# Engine module — placeholder for Part 2

This folder is where Part 2's transliteration engine module belongs.

Part 1's hooks (`src/hooks/useTransliteration.js` and
`src/hooks/useScriptDetection.js`) try to dynamically import
`./transliterate.js` from this folder. If it's not found, they fall back
to a clearly-labeled stub so the rest of the UI keeps working.

## What Part 2 needs to drop in here

Create `transliterate.js` in this folder exporting exactly:

```js
export function transliterate(text, sourceScript, targetScript) {
  // returns { output, lossy, notes, confidence }
}

export function detectScript(text) {
  // returns { script, confidence }
}
```

Script codes used across the app (must match `src/data/scripts.js`):
`deva`, `taml`, `telu`, `knda`, `mlym`, `guru`, `beng`, `gujr`, `orya`, `mtei`, `latn`

Once this file exists with these exports, Part 1's stub fallback is
bypassed automatically — no changes needed on the Part 1 side.

Rule-table JSON files (cached offline by the service worker per
`vite.config.js`) should live under `/public/data/script-rules/*.json`
so they're served as static assets and picked up by the
`CacheFirst` runtime caching rule already configured.
