# AGENTS.md

Instructions for AI coding agents (Claude Code, GitHub Copilot Workspace, Cursor, etc.) working in this repository. If you're a human contributor, see CONTRIBUTIONS.md instead.

## Project structure

This repo is split into three independently-owned parts, each documented in its own spec file at the repo root:

- `frontend/` — Part 1, owned by Ridhi M. Spec: `PART_1_FRONTEND_PWA.md`
- `engine/` — Part 2, owned by Siri M. Spec: `PART_2_TRANSLITERATION_ENGINE.md`
- `backend/` — Part 3, owned by Sharanya B. Spec: `PART_3_OCR_BACKEND.md`

Before making changes anywhere in the repo, read the relevant `PART_*.md` spec file for that section — it defines the scope, the API contract with the other two parts, and explicit acceptance criteria. Do not implement functionality that belongs to a different part (e.g. don't add transliteration logic inside `frontend/`, it belongs in `engine/`).

## Cross-part contracts — do not break these without updating all three specs

- `frontend/src/engine/transliterate.js` must export `transliterate(text, sourceScript, targetScript)` returning `{ output, lossy, notes, confidence }`, and `detectScript(text)` returning `{ script, confidence }`. This is the only file Part 1 expects from Part 2.
- `POST /api/ocr` must accept `{ image: base64String }` and return `{ blocks: [{ text, confidence, boundingBox }], engineUsed }`. This is the only endpoint Part 1 expects from Part 3.
- Script codes used across all three parts: `deva`, `taml`, `telu`, `knda`, `mlym`, `guru`, `beng`, `gujr`, `orya`, `mtei`, `latn`. Don't introduce new codes without updating `frontend/src/data/scripts.js`.

## Hard constraints (apply to all agent-generated code in this repo)

- **This is transliteration, not translation.** Never call an LLM, translation API, or anything that changes meaning rather than script/sound. If asked to add a "translate" feature, it must be a clearly separate, optional toggle — never merged into the transliteration pipeline.
- **No silent failures on lossy conversions.** Scripts that aren't phonemically 1:1 (e.g. Tamil lacks distinct voiced/aspirated consonant letters) must return `lossy: true` with human-readable notes, not a garbled or silently-approximated result.
- **Offline-first.** Part 1's transliteration logic and Part 2's engine must run with zero network calls. Don't introduce a network dependency into either without flagging it loudly in the PR description.
- **Don't commit `node_modules/` or `dist/`.** Check `.gitignore` covers these before adding new build tooling.
- **Don't expose API keys client-side.** Cloud Vision keys and any other secrets stay server-side in Part 3's environment variables only.

## Before opening a PR

Run the acceptance criteria checklist in the relevant `PART_*.md` file and report which items pass/fail in the PR description. If you can't verify something (e.g. no browser available to check visual rendering), say so explicitly rather than marking it done.

## Style

- Match the existing code style in whichever part you're editing — don't introduce a new state management library, CSS framework, or backend framework without discussing it first, since each part deliberately picked the simplest tool that fits (Zustand over Redux, Express kept thin, no ORM/database for a stateless prototype).
- Comment code that encodes a non-obvious decision (e.g. why a particular script quirk is handled a certain way) — future contributors and other agents will rely on these comments more than commit history.
