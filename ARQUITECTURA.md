# Arquitectura 8.2.7

`kanji_words.json` contiene `word`, `reading`, `meaning` y, cuando la correspondencia es válida, `parts`: una lista de segmentos de hiragana alineados con cada carácter Unicode de `word`. `readingType: "special"` indica lecturas que deben mantenerse juntas. El módulo `modules/kana/kanji-library.js` renderiza cada segmento por carácter y valida que los segmentos concatenados coincidan con la lectura completa.

Los datos de vocabulario son recursos de la aplicación y no alteran los registros de progreso locales.

## 8.3.1 — Modelo de dominio
`state.kanaMastery` almacena aciertos por clave `Tipo:ID` (no por texto ni filtro). Las funciones `kanaEligible`, `kanaTarget`, `kanaHits`, `kanaDominated` y `kanaFlightStats` se encuentran en `modules/kana/kana.js`. Las preguntas acertadas se contabilizan al contestar, con protección contra doble respuesta (`quiz.selected`). Los contadores no se reconstruyen de sesiones históricas. El total se deriva de `data.kana` y no se fija manualmente.
