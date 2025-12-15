// // Áreas y catálogo de cursos (simplificado, adaptalo a DH real)
// export const AREAS = [
//     "Programación / Desarrollo",
//     "Datos / Analytics / BI",
//     "Diseño UX/UI",
//     "Marketing Digital / Growth",
//     "Inteligencia Artificial para Negocios",
// ];

// export const CATALOG = [
//     {
//         label: "Programación / Desarrollo",
//         cursos: [
//             {
//                 nombre: "Certified Tech Developer",
//                 slug: "/carreras/certified-tech-developer",
//             },
//             {
//                 nombre: "Desarrollo Full Stack",
//                 slug: "/cursos/programacion-full-stack",
//             },
//             {
//                 nombre: "Fundamentos de Python",
//                 slug: "/cursos/fundamentos-de-python",
//             },
//         ],
//     },
//     {
//         label: "Datos / Analytics / BI",
//         cursos: [
//             { nombre: "Data Analytics", slug: "/cursos/data-analytics" },
//             { nombre: "Power BI", slug: "/cursos/power-bi" },
//             { nombre: "SQL Desde Cero", slug: "/cursos/sql" },
//         ],
//     },
//     {
//         label: "Diseño UX/UI",
//         cursos: [{ nombre: "Diseño UX/UI", slug: "/cursos/ux-ui" }],
//     },
//     {
//         label: "Marketing Digital / Growth",
//         cursos: [
//             { nombre: "Marketing Digital", slug: "/cursos/marketing-digital" },
//             { nombre: "Growth Marketing", slug: "/cursos/growth-marketing" },
//         ],
//     },
//     {
//         label: "Inteligencia Artificial para Negocios",
//         cursos: [{ nombre: "IA para Negocios", slug: "/cursos/ia-para-negocios" }],
//     },
// ];

// src/utils/catalogo.js
import cursos from "../../cursos.json"; // ajustá la ruta si lo moviste a /src/data/cursos.json

// Áreas que queremos mostrar (en el orden deseado)
const AREA_HEADERS = [
  "Inteligencia Artificial",
  "Datos",
  "Producto",
  "Programación",
];

// cómo armar URL cuando el link viene como Document (tiene uid)
const KEY_TO_SEGMENT = {
  IA: "ai",
  datos: "datos",
  producto: "negocios",
  programacion: "programacion",
  CTD: "programacion", // lo metemos acá por consistencia
};

function buildUrlFromLink(item) {
  const link = item?.link;

  // Si ya viene URL completa, usala
  if (link?.link_type === "Web" && link?.url) return link.url;

  // Si viene como Document (Prismic) construimos la URL de productos
  if (link?.link_type === "Document" && link?.uid) {
    const seg = KEY_TO_SEGMENT[item.key] || "programacion";
    // patrón real de DH: /ar/productos/<segment>/<uid>
    return `https://www.digitalhouse.com/ar/productos/${seg}/${link.uid}`;
  }

  return null;
}

function buildCatalogFromProductsMenu(productsMenu) {
  const buckets = new Map(); // areaTitle -> cursos[]
  let currentArea = null;

  // inicializamos buckets
  AREA_HEADERS.forEach((h) => buckets.set(h, []));

  for (const item of productsMenu || []) {
    if (item?.isHeader) {
      // solo tomamos los headers que nos interesan
      if (AREA_HEADERS.includes(item.title)) currentArea = item.title;
      else currentArea = null;
      continue;
    }

    // Caso especial: CTD está antes de los headers en tu JSON
    // entonces lo ponemos en Programación
    const areaForThisItem =
      item.key === "CTD" ? "Programación" : currentArea;

    if (!areaForThisItem) continue; // si no estamos dentro de un área válida, ignoramos

    const url = buildUrlFromLink(item);
    if (!url) continue;

    buckets.get(areaForThisItem).push({
      nombre: item.title,
      slug: url, // acá guardamos URL completa
    });
  }

  // armamos AREAS y CATALOG con el formato que ya usabas
  const AREAS = AREA_HEADERS.filter((h) => (buckets.get(h) || []).length > 0);

  const CATALOG = AREAS.map((label) => ({
    label,
    cursos: buckets.get(label) || [],
  }));

  return { AREAS, CATALOG };
}

const productsMenu =
  cursos?.props?.pageProps?.header?.productsMenu || [];

export const { AREAS, CATALOG } = buildCatalogFromProductsMenu(productsMenu);
