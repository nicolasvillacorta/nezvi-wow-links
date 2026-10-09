# Nezvi WoW Extension

Extensión de Chrome para jugadores de **World of Warcraft**: guardás tu personaje una sola vez y tenés a un click sus perfiles en Raider.io, Warcraft Logs, la Armería, WoWProgress y más.

*Chrome extension for World of Warcraft players: save your character once and get one-click access to its Raider.io, Warcraft Logs, Armory and WoWProgress pages. Available in English and Spanish.*

## Funciones

- **Links del personaje:** Raider.io, Warcraft Logs, Armería y WoWProgress vienen activos al instalar. Simple Armory y Data for Azeroth se pueden activar desde las opciones.
- **Links de la guild:** si cargás una guild, también aparecen sus páginas en Raider.io y Warcraft Logs (WoWProgress y la Armería son opcionales).
- **Opciones (⚙):**
  - Idioma: español o inglés (la Armería se abre en el mismo idioma).
  - Qué links mostrar y cuáles ocultar.
  - Abrir los links en segundo plano.
  - Mostrar u ocultar los atajos de teclado.
- **Atajos de teclado:** con el popup abierto, las teclas `1`–`9` abren cada link.
- **Abrir todos:** abre todos los links visibles de una vez.
- **Copiar Nombre-Reino:** copia el nombre en formato del juego, listo para `/invite` o `/w`.
- La configuración se guarda con `chrome.storage.sync`, así que te sigue a cualquier Chrome donde inicies sesión.

## Instalación (modo desarrollador)

1. Descargá o cloná este repositorio.
2. Abrí `chrome://extensions` y activá el **Modo de desarrollador**.
3. Hacé clic en **Cargar descomprimida** y elegí la carpeta del proyecto.
4. Fijá la extensión en la barra y configurá tu personaje.

## Estructura

| Archivo | Qué hace |
| --- | --- |
| `manifest.json` | Definición de la extensión (Manifest V3). |
| `popup.html` | Interfaz y estilos del popup. |
| `popup.js` | Lógica: sitios, idiomas, opciones y armado de los links. |

Para agregar un sitio nuevo, sumá una entrada en la lista `SITES` de `popup.js`.

## Apoyar el proyecto

Si te resulta útil, podés invitarme un café desde el botón ♥ de la extensión.
