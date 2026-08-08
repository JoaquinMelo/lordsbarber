# Lord's Barber Shop — Landing

## Estructura

```
index.html        ← toda la landing (edita el bloque CONFIG arriba del <script>)
api/reviews.js    ← función que trae las reseñas reales de Google (opcional)
```

## Datos del local

- **Nombre en Google:** BARBERIA LORD'S BARBER SHOP PUCON
- **Dirección:** Miguel Ansorena 323, Pucón, Araucanía
- **Teléfono:** +56 9 9437 4662
- **Place ID:** `ChIJQxRI915_FJYRU1TWz2-Kf58`
- **Coordenadas:** -39.2755913, -71.974832

---

## Mapa

Ya funciona, sin configuración ni API key. Usa el embed público de Google Maps.
Si quieres mover el pin o cambiar el zoom, edita `lat`, `lng` y `mapsQuery` en CONFIG.

---

## Reseñas reales de Google (opcional)

Por defecto la landing usa los testimonios escritos a mano en el array `TESTIMONIOS`.
Si quieres que se actualicen solas desde Google, sigue estos pasos:

### 1. Crear la API key

1. Entra a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un proyecto nuevo (ej. "lords-landing")
3. Ve a **APIs y servicios → Biblioteca** y habilita **Places API (New)**
4. Ve a **Credenciales → Crear credenciales → Clave de API**
5. Copia la clave

> Google exige asociar una cuenta de facturación, pero da **$200 USD de crédito
> mensual gratis**. Con la caché de 6 horas que trae la función, el consumo es
> de unas ~120 consultas al mes: prácticamente $0.

### 2. Cargar la clave en Vercel

En tu proyecto de Vercel → **Settings → Environment Variables**, agrega:

| Nombre | Valor |
|---|---|
| `GOOGLE_API_KEY` | tu clave de Google |
| `GOOGLE_PLACE_ID` | `ChIJQxRI915_FJYRU1TWz2-Kf58` |

Guarda y haz **Redeploy** para que tome las variables.

### 3. Activar en el HTML

En `index.html`, dentro de CONFIG:

```js
reviewsAuto: true
```

Haz `git push` y listo. Si la API falla por lo que sea, la landing cae de vuelta
a los testimonios manuales sin romperse.

### Verificar que funciona

Abre `https://tu-sitio.vercel.app/api/reviews` en el navegador.
Deberías ver un JSON con las reseñas.

---

## Limitaciones a tener en cuenta

- La API de Google devuelve **máximo 5 reseñas** (las que Google considera más
  relevantes). No hay forma oficial de traer las 154.
- No se pueden filtrar por puntaje: vienen las que Google elija.
- Los términos de Google piden mostrar el nombre del autor junto a cada reseña
  (la función ya lo entrega en el campo `nombre`).

**Alternativa sin API:** copiar a mano las mejores reseñas al array `TESTIMONIOS`.
Es gratis, te deja elegir cuáles mostrar, y sigue siendo contenido real — solo
que hay que actualizarlo manualmente de vez en cuando.

---

## Publicar cambios

```bash
git add .
git commit -m "descripcion del cambio"
git push
```

Vercel redespliega solo en ~30 segundos.
