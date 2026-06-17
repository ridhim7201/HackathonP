// Placeholder engine module — Part 2 owns this file's real implementation.
//
// This placeholder exists ONLY so Vite's static import analysis has a real
// file to resolve at build time. It deliberately does NOT export
// `transliterate` or `detectScript`, so Part 1's hooks (which check
// `typeof mod.transliterate === 'function'`) correctly fall back to their
// stub behavior until Part 2 replaces this file with the real engine.
//
// Part 2: replace the contents of this file per src/engine/README.md.
// Do not delete the file itself, or the build will fail again.

export const __isPlaceholder = true
