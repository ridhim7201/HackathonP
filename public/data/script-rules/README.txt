Part 2's script-pair rule tables (e.g. deva-to-iast.json, iast-to-taml.json,
script-pairs-status.json) belong in this folder as static JSON files.

They're picked up automatically by the offline CacheFirst rule already
configured in /vite.config.js (urlPattern: /\/data\/script-rules\/.*\.json$/),
so once dropped here, no Part 1 changes are needed for offline caching to work.
