# HUMAN360
Autoevaluación integral 100 % en el navegador (HTML + CSS + JS ES modules). Sin backend, sin almacenamiento persistente: todo vive en memoria y se borra al cerrar sesión o recargar.

## Ejecutar
Los módulos ES requieren HTTP (no `file://`): `python3 -m http.server` en esta carpeta y abrir http://localhost:8000.

## Publicar en GitHub Pages
Sube el contenido a un repositorio → Settings → Pages → Deploy from branch → `main` / root.

## Pruebas
`node tests/scoring-tests.js` (motor de puntuación). `tests/session-tests.js` describe la verificación manual de limpieza.

## Estado y limitaciones
- Módulos A–H, motor de puntuación y de reglas, dashboard con radar SVG, barras, tablas, informe A4 y cierre de sesión.
- Banco compacto en 3 cuestionarios (~30 interacciones): escala 1–10, opciones, días (0–7) y actividades primarias (elegir hasta 3). Ítems originales, NO validados. Ampliar en `js/data.js`.
- Gráficos SVG propios (sin ECharts/Chart.js) e iconos mínimos propios (sin Lucide); el PDF usa la impresión del navegador (sin jsPDF), porque no hubo acceso a red para empaquetar esas librerías.
- No incluidos aún: ejercicios interactivos de memoria/razonamiento, preguntas abiertas y de priorización.
- No se probó en navegador real, ni responsive, ni GitHub Pages; solo se ejecutaron las pruebas Node del motor.
