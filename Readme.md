# LipiSetu (लिपि सेतु) — Script Bridge

> Bharat has always been a land of many scripts flourishing together. LipiSetu lets anyone read any Indian script in the one they know — no translation, just pure phonetic transliteration.

A traveler from Andhra Pradesh should be able to read a Gurmukhi road sign in Punjab. A pilgrim from Manipur visiting Thiruvananthapuram should be able to read Malayalam signboards. LipiSetu makes that possible in real time, on a phone, even offline.

## What This Is (and Isn't)

- **Is:** Script-to-script phonetic conversion. "नमस्ते" → "নমস্তে" (same sound, different script).
- **Isn't:** A translation app. Meaning is never altered — only the script changes, not the language.

## Core Features

1. **Text Transliteration** — Type or paste text in any supported script and convert it instantly to another.
2. **Camera Signboard Reader** — Point your phone at a signboard; the app OCRs the text, detects the source script, and transliterates it into your chosen script.
3. **Auto Script Detection** — No need to manually specify the source script for recognized text.
4. **Offline Mode** — Core transliteration runs client-side once script data is cached, since signboards are often found in low-connectivity areas.

## Supported Scripts

Devanagari, Tamil, Telugu, Kannada, Malayalam, Gurmukhi, Bengali, Gujarati, Odia, Assamese, Meitei Mayek, and romanized/Latin input (ISO-15919 / ITRANS / Harvard-Kyoto).

## Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Transliteration engine | Sanscript.js / ICU rule-based mapping | Deterministic phonetic mapping problem — not a generative AI task |
| Frontend | React (PWA) | Installs on phones directly, no app store friction |
| OCR | Tesseract.js (Indic packs) or Google Cloud Vision API | Reads signboard images under real-world lighting/fonts |
| Backend | Node.js + Express | Thin proxy for OCR calls and script-pair rule lookups only |

## Architecture

```
[Camera / Text Input]
        │
        ▼
[OCR Layer] ──(image)──> extracted text + detected script
        │
        ▼
[Script Detector] ──> identifies source script automatically
        │
        ▼
[Transliteration Engine] ──> maps via common phonetic intermediate (IAST/ISO-15919)
        │
        ▼
[Output] ──> side-by-side original + transliterated text
```

## Key UX Principles

- **Source/Target script selectors** with a one-tap swap button.
- **Camera capture as primary action** — most users are travelers pointing at signs, not typists.
- **Side-by-side display** of original and converted script — never replace one with the other.
- **Graceful lossy handling** for scripts that aren't phonemically 1:1 (e.g., Tamil lacks distinct voiced/aspirated consonant letters that Telugu/Devanagari have) — explicit fallback rules instead of silent failure.

## Getting Started

```bash
git clone <repo-url>
cd lipisetu
npm install
npm run dev
```

### Environment Variables

```
GOOGLE_VISION_API_KEY=   # optional, only if using Cloud Vision instead of Tesseract.js
```

## Roadmap

- [ ] Text transliteration for 5+ script pairs
- [ ] Camera OCR pipeline wired to transliteration engine
- [ ] Offline-first PWA caching
- [ ] Optional translation toggle (kept strictly separate from transliteration)
- [ ] Perso-Arabic script support (Urdu, Kashmiri, Sindhi)

## Contributing

Issues and PRs welcome, especially for script-pair edge cases (chillu letters in Malayalam, schwa deletion rules, Tamil's lossy consonant mapping).

## License

MIT
