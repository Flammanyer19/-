# 日本語のリト 8.0.0 — Arquitectura modular (fase 1)

Base: paquete 7.2, no 7.3 experimental.

## Capas
- `core/state.js`: estado compartido y persistencia. **Clave existente `rito_v5` sin migración**.
- `core/ui.js`: utilidades de presentación.
- `core/navigation.js`: navegación, render y temporizador.
- `core/events.js`: delegación de eventos, importación y exportación.
- `core/bootstrap.js`: carga de JSON y registro del service worker.
- `modules/`: funciones agrupadas por dominio (journey, passport, culture, vocabulary, kana, grammar, exercises, progress).
- `styles/main.css`: estilos separados del HTML.
- `data.json`, `culture.json`, `particles.json`: contenido original intacto.

## Compatibilidad
Los módulos siguen usando scripts clásicos (`defer`) y el entorno léxico global compartido. Esto minimiza regresiones y conserva las llamadas entre funciones; **no** es aún una arquitectura de módulos ES con imports/exports ni dependencias aisladas. Una migración a módulos ES requeriría pruebas adicionales y debe hacerse en otra versión.

## Reglas de cambios futuros
1. Una versión, un objetivo.
2. Preservar identificadores de contenido y esquema de progreso.
3. Mantener copia estable y registrar cambios.
4. Ejecutar pruebas de carga, navegación, quiz y respaldo.
5. Validar en Safari antes de declarar estable.

## Nota de versión
La etiqueta interna `version:7.2` en el JSON exportado se conserva deliberadamente para no cambiar el formato de respaldo en esta migración.
