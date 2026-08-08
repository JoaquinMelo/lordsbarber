// Trae las reseñas reales desde Google Places API.
// La API key vive como variable de entorno en Vercel, NUNCA en el HTML.
//
// Variables de entorno necesarias en Vercel:
//   GOOGLE_API_KEY  = tu clave de Google Cloud
//   GOOGLE_PLACE_ID = ChIJQxRI915_FJYRU1TWz2-Kf58

const PLACE_ID = process.env.GOOGLE_PLACE_ID || "ChIJQxRI915_FJYRU1TWz2-Kf58";

// Caché en memoria: evita pegarle a Google en cada visita (y ahorra cuota).
let cache = { data: null, time: 0 };
const CACHE_MS = 1000 * 60 * 60 * 6; // 6 horas

export default async function handler(req, res) {
  const key = process.env.GOOGLE_API_KEY;

  if (!key) {
    return res.status(500).json({ error: "Falta GOOGLE_API_KEY en las variables de entorno." });
  }

  // Devuelve la copia en caché si sigue fresca
  if (cache.data && Date.now() - cache.time < CACHE_MS) {
    res.setHeader("Cache-Control", "public, s-maxage=21600");
    return res.status(200).json(cache.data);
  }

  try {
    const url = `https://places.googleapis.com/v1/places/${PLACE_ID}` +
                `?languageCode=es&fields=displayName,rating,userRatingCount,reviews`;

    const r = await fetch(url, {
      headers: {
        "X-Goog-Api-Key": key,
        "X-Goog-FieldMask": "displayName,rating,userRatingCount,reviews"
      }
    });

    if (!r.ok) {
      const detail = await r.text();
      return res.status(502).json({ error: "Google respondió con error", detail });
    }

    const g = await r.json();

    const payload = {
      rating: g.rating ?? null,
      total: g.userRatingCount ?? null,
      reviews: (g.reviews || []).map(rv => ({
        nombre: rv.authorAttribution?.displayName || "Cliente de Google",
        estrellas: rv.rating || 5,
        texto: rv.originalText?.text || rv.text?.text || "",
        foto: rv.authorAttribution?.photoUri || "",
        link: rv.authorAttribution?.uri || ""
      })).filter(rv => rv.texto && rv.estrellas >= 4)
    };

    cache = { data: payload, time: Date.now() };

    res.setHeader("Cache-Control", "public, s-maxage=21600");
    return res.status(200).json(payload);

  } catch (err) {
    return res.status(500).json({ error: "No se pudo consultar Google", detail: String(err) });
  }
}
