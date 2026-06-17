// LipiSetu — Supported script registry
// Single source of truth for script metadata used by selectors, the
// detection hook, and font rendering. Part 2 (engine) and Part 3 (OCR)
// should key their outputs using these same `code` values so everything
// lines up across the three parts.

export const SCRIPTS = [
  { code: 'deva', name: 'Devanagari', native: 'देवनागरी', sample: 'नमस्ते' },
  { code: 'taml', name: 'Tamil', native: 'தமிழ்', sample: 'வணக்கம்' },
  { code: 'telu', name: 'Telugu', native: 'తెలుగు', sample: 'నమస్కారం' },
  { code: 'knda', name: 'Kannada', native: 'ಕನ್ನಡ', sample: 'ನಮಸ್ಕಾರ' },
  { code: 'mlym', name: 'Malayalam', native: 'മലയാളം', sample: 'നമസ്കാരം' },
  { code: 'guru', name: 'Gurmukhi', native: 'ਗੁਰਮੁਖੀ', sample: 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ' },
  { code: 'beng', name: 'Bengali', native: 'বাংলা', sample: 'নমস্কার' },
  { code: 'gujr', name: 'Gujarati', native: 'ગુજરાતી', sample: 'નમસ્તે' },
  { code: 'orya', name: 'Odia', native: 'ଓଡ଼ିଆ', sample: 'ନମସ୍କାର' },
  { code: 'mtei', name: 'Meitei Mayek', native: 'ꯃꯩꯇꯩ ꯃꯌꯦꯛ', sample: 'ꯈꯨꯔꯨꯝꯖꯔꯤ' },
  { code: 'latn', name: 'Latin / Romanized', native: 'ABC', sample: 'namaste' }
]

export const getScriptByCode = (code) => SCRIPTS.find((s) => s.code === code) || null

export const DEFAULT_SOURCE = 'deva'
export const DEFAULT_TARGET = 'taml'
