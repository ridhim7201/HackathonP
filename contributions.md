# Contributions
 
## Team & ownership
 
| Part | Owner | Scope |
|---|---|---|
| Part 1 — Frontend & PWA | Ridhi M | React UI, script selectors, camera screen, offline shell. Spec: `PART_1_FRONTEND_PWA.md` |
| Part 2 — Transliteration Engine | Siri M | Rule-based script conversion via Sanscript.js and a common phonetic intermediate. Spec: `PART_2_TRANSLITERATION_ENGINE.md` |
| Part 3 — OCR & Backend | Sharanya B | Image preprocessing, OCR pipeline, thin Express proxy. Spec: `PART_3_OCR_BACKEND.md` |
 
Each owner is responsible for their part's acceptance criteria (listed at the bottom of the relevant spec file) before merging changes that touch it.
 
## Repo structure
 
```
HackathonP/
  frontend/    → Part 1 (Ridhi)
  engine/      → Part 2 (Siri)
  backend/     → Part 3 (Sharanya)
  PART_1_FRONTEND_PWA.md
  PART_2_TRANSLITERATION_ENGINE.md
  PART_3_OCR_BACKEND.md
  SKILLS.md
  AGENTS.md
  CONTRIBUTIONS.md
```
 
## Workflow
 
1. Pull the latest `main` before starting work.
2. Branch off for any change: `git checkout -b <part>/<short-description>`, e.g. `frontend/fix-swap-button` or `engine/add-tamil-fallback`.
3. Stay inside your part's folder unless you're changing one of the cross-part contracts below — if you need to change a contract, ping the other two owners first, since it affects their code too.
4. Commit with a clear message describing what changed and why, not just what file.
5. Open a pull request. Tag the relevant part's owner as reviewer if you're touching someone else's folder.
6. Once your part's acceptance criteria are met, check them off in your PR description.
## Cross-part contracts (touch these carefully)
 
These are the exact points where the three parts connect. Changing any of them affects code outside your own folder, so loop in the other owners before merging:
 
- **Part 1 ↔ Part 2**: `frontend/src/engine/transliterate.js` — Siri's module, imported by Ridhi's hooks. Must export `transliterate()` and `detectScript()` per the contract in `PART_2_TRANSLITERATION_ENGINE.md` §2.8.
- **Part 1 ↔ Part 3**: `POST /api/ocr` — Sharanya's endpoint, called by Ridhi's `useOCR` hook. Contract defined in `PART_3_OCR_BACKEND.md` §3.5.
- **Shared script codes**: `frontend/src/data/scripts.js` is the source of truth for script identifiers (`deva`, `taml`, `telu`, etc.) used across all three parts.
## Until Part 2 and Part 3 land
 
Part 1 runs independently using stub fallbacks (a visibly fake echo response for transliteration, a mocked OCR response) so the UI can be built, demoed, and tested without waiting on the other two parts. When Siri's engine module or Sharanya's backend route are ready, dropping them into the expected file/endpoint is enough — no changes needed on Ridhi's side.
 
## Reporting issues
 
If you hit something that should work per a spec file but doesn't, open an issue referencing the spec section number (e.g. "PART_2 §2.4 — Tamil lossy flag not set on aspirated consonants") rather than just describing the symptom, so whoever picks it up can jump straight to the relevant requirement.
 
