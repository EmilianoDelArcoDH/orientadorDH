// src/hooks/useOrientationIA.js
import { useState } from "react";
import { getClassifier } from "./ia-transformers";
import { CATALOG } from "../utils/catalogo";
import { MODES } from "../utils/constants";
import { AREA_INSIGHTS } from "../utils/insights";

/* =========================
   Áreas (labels) que ve la IA
========================= */
const AREAS_PERSONAL = [
  "Programación",
  "Datos",
  "Producto & Negocios",
  "Diseño & UX",
  "Inteligencia Artificial",
];

const AREAS_EMPRESA = [
  // ✅ Especializaciones dev (más precisas)
  "Front End Developer",
  "Back End Developer",
  "Full Stack Developer",

  // ✅ Macro áreas
  "IA aplicada y automatización",
  "Capacitación en Datos y BI",
  "Desarrollo de producto digital",
  "Marketing y Growth",
  "Mindset y liderazgo digital",

  // ✅ (opcional) dejala si querés como paraguas
  "Programación para equipos tech",
];


/* =========================
   2) Tipos de cambio (IA)
========================= */
const CHANGE_LABELS = [
  "Cambio operativo (orden, eficiencia, control, menos errores)",
  "Cambio técnico (herramientas, desarrollo, código, stack)",
  "Cambio estratégico (innovación, crecimiento, escalado, ventaja competitiva)",
  "Cambio cultural (liderazgo, coordinación, mindset, procesos)",
];

function mapChangeLabelToType(label = "") {
  const l = String(label).toLowerCase();
  if (l.includes("operativo")) return "OPERATIVE";
  if (l.includes("técnico") || l.includes("tecnico")) return "TECHNICAL";
  if (l.includes("estratégico") || l.includes("estrategico")) return "STRATEGIC";
  if (l.includes("cultural")) return "CULTURAL";
  return "OPERATIVE";
}

/* =========================
   3) Helpers de contexto
========================= */
function normalize(s = "") {
  return String(s).toLowerCase().trim();
}

function getCompanyTeamType(roles = "") {
  const r = normalize(roles);

  if (!r) return "UNKNOWN";

  if (
    r.includes("admin") ||
    r.includes("administración") ||
    r.includes("administracion") ||
    r.includes("finan") ||
    r.includes("contab") ||
    r.includes("rrhh") ||
    r.includes("recursos humanos")
  )
    return "ADMIN";

  if (
    r.includes("operac") ||
    r.includes("operaciones") ||
    r.includes("logist") ||
    r.includes("logística") ||
    r.includes("logistica") ||
    r.includes("campo") ||
    r.includes("servicios") ||
    r.includes("mantenimiento") ||
    r.includes("limpieza") ||
    r.includes("seguridad")
  )
    return "OPS";

  if (r.includes("venta") || r.includes("atención") || r.includes("atencion") || r.includes("customer"))
    return "SALES";

  if (r.includes("market") || r.includes("growth") || r.includes("comunicación") || r.includes("comunicacion"))
    return "MARKETING";

  if (r.includes("producto") || r.includes("product")) return "PRODUCT";

  if (
    r.includes("tech") ||
    r.includes("tecnolog") ||
    r.includes("dev") ||
    r.includes("developer") ||
    r.includes("program") ||
    r.includes("frontend") ||
    r.includes("front end") ||
    r.includes("backend") ||
    r.includes("back end")
  )
    return "TECH";

  return "UNKNOWN";
}

function getPersonalType(data = {}) {
  const exp = normalize(data.experiencia);
  const obj = normalize(data.objetivos);
  const intereses = normalize(data.intereses);

  // principiante / exploración
  if (!exp || exp.includes("sin experiencia") || exp.includes("ninguna")) return "BEGINNER";

  // perfil técnico (dev / data / etc)
  if (
    exp.includes("dev") ||
    exp.includes("developer") ||
    exp.includes("program") ||
    exp.includes("frontend") ||
    exp.includes("backend") ||
    exp.includes("data") ||
    exp.includes("analista") ||
    intereses.includes("program") ||
    intereses.includes("datos")
  )
    return "TECH_PRO";

  // liderazgo / emprendedor
  if (
    exp.includes("líder") ||
    exp.includes("lider") ||
    exp.includes("manager") ||
    exp.includes("coordin") ||
    obj.includes("liderar") ||
    obj.includes("gestionar")
  )
    return "LEADER";

  return "NON_TECH_PRO";
}

/* =========================
   4) Necesidad abierta
   (solo para decidir 1 vs 3 cards)
========================= */
const OPEN_NEED_KEYWORDS = [
  "no sabemos",
  "no estoy seguro",
  "no tenemos claro",
  "explorar",
  "ver opciones",
  "mejorar en general",
  "general",
  "capacitación general",
  "varios roles",
  "equipo completo",
  "todo el equipo",
  "de todo",
  "un poco de todo",
];

function isOpenNeed(text = "") {
  const t = normalize(text);
  if (!t) return true;
  if (t.length < 35) return true;
  return OPEN_NEED_KEYWORDS.some((k) => t.includes(k));
}

/* =========================
   5) Gating suave por contexto + cambio
   (define "áreas razonables" antes de clasificar)
========================= */
function resolveCompanyCandidateAreas(teamType, changeType) {
  // DEV: solo si team es TECH y el cambio es técnico
  if (teamType === "TECH" && changeType === "TECHNICAL") {
    return ["Programación para equipos tech", "IA aplicada y automatización", "Capacitación en Datos y BI", "Desarrollo de producto digital"];
  }

  // ADMIN
  if (teamType === "ADMIN") {
    if (changeType === "OPERATIVE") return ["Capacitación en Datos y BI", "IA aplicada y automatización", "Mindset y liderazgo digital"];
    if (changeType === "STRATEGIC") return ["IA aplicada y automatización", "Desarrollo de producto digital", "Capacitación en Datos y BI"];
    if (changeType === "CULTURAL") return ["Mindset y liderazgo digital", "Desarrollo de producto digital", "IA aplicada y automatización"];
    // TECHNICAL (admin)
    return ["Capacitación en Datos y BI", "IA aplicada y automatización", "Mindset y liderazgo digital"];
  }

  // OPS / campo / servicios
  if (teamType === "OPS") {
    if (changeType === "OPERATIVE") return ["IA aplicada y automatización", "Capacitación en Datos y BI", "Mindset y liderazgo digital"];
    if (changeType === "CULTURAL") return ["Mindset y liderazgo digital", "IA aplicada y automatización", "Capacitación en Datos y BI"];
    if (changeType === "STRATEGIC") return ["IA aplicada y automatización", "Desarrollo de producto digital", "Capacitación en Datos y BI"];
    // TECHNICAL (ops)
    return ["IA aplicada y automatización", "Capacitación en Datos y BI", "Mindset y liderazgo digital"];
  }

  // SALES
  if (teamType === "SALES") {
    if (changeType === "OPERATIVE") return ["Capacitación en Datos y BI", "IA aplicada y automatización", "Mindset y liderazgo digital"];
    if (changeType === "STRATEGIC") return ["Marketing y Growth", "IA aplicada y automatización", "Capacitación en Datos y BI"];
    if (changeType === "CULTURAL") return ["Mindset y liderazgo digital", "Marketing y Growth", "IA aplicada y automatización"];
    // TECHNICAL (sales)
    return ["IA aplicada y automatización", "Capacitación en Datos y BI", "Marketing y Growth"];
  }

  // MARKETING
  if (teamType === "MARKETING") {
    if (changeType === "OPERATIVE") return ["Marketing y Growth", "Capacitación en Datos y BI", "IA aplicada y automatización"];
    if (changeType === "STRATEGIC") return ["Marketing y Growth", "IA aplicada y automatización", "Desarrollo de producto digital"];
    if (changeType === "CULTURAL") return ["Mindset y liderazgo digital", "Marketing y Growth", "IA aplicada y automatización"];
    // TECHNICAL (marketing)
    return ["Marketing y Growth", "Capacitación en Datos y BI", "IA aplicada y automatización"];
  }

  // PRODUCT
  if (teamType === "PRODUCT") {
    if (changeType === "OPERATIVE") return ["Desarrollo de producto digital", "Capacitación en Datos y BI", "IA aplicada y automatización"];
    if (changeType === "STRATEGIC") return ["Desarrollo de producto digital", "IA aplicada y automatización", "Marketing y Growth"];
    if (changeType === "CULTURAL") return ["Mindset y liderazgo digital", "Desarrollo de producto digital", "IA aplicada y automatización"];
    // TECHNICAL (product)
    return ["Desarrollo de producto digital", "IA aplicada y automatización", "Capacitación en Datos y BI"];
  }

  // UNKNOWN
  if (changeType === "TECHNICAL") {
    // si no sabemos el rol, preferimos NO ir a programación como primera recomendación
    return ["IA aplicada y automatización", "Capacitación en Datos y BI", "Desarrollo de producto digital", "Mindset y liderazgo digital"];
  }

  return ["Capacitación en Datos y BI", "IA aplicada y automatización", "Desarrollo de producto digital", "Mindset y liderazgo digital", "Marketing y Growth"];
}

function resolvePersonalCandidateAreas(personType, changeType) {
  if (personType === "BEGINNER") {
    if (changeType === "TECHNICAL") return ["Programación", "Datos", "Inteligencia Artificial"];
    if (changeType === "OPERATIVE") return ["Datos", "Inteligencia Artificial", "Producto & Negocios"];
    if (changeType === "STRATEGIC") return ["Inteligencia Artificial", "Producto & Negocios", "Datos"];
    return ["Producto & Negocios", "Datos", "Inteligencia Artificial"];
  }

  if (personType === "NON_TECH_PRO") {
    if (changeType === "TECHNICAL") return ["Datos", "Inteligencia Artificial", "Producto & Negocios"];
    if (changeType === "OPERATIVE") return ["Datos", "Inteligencia Artificial", "Producto & Negocios"];
    if (changeType === "STRATEGIC") return ["Inteligencia Artificial", "Producto & Negocios", "Datos"];
    return ["Producto & Negocios", "Datos", "Inteligencia Artificial"];
  }

  if (personType === "TECH_PRO") {
    if (changeType === "TECHNICAL") return ["Programación", "Inteligencia Artificial", "Datos"];
    if (changeType === "STRATEGIC") return ["Inteligencia Artificial", "Producto & Negocios", "Datos"];
    return ["Datos", "Inteligencia Artificial", "Programación"];
  }

  if (personType === "LEADER") {
    if (changeType === "CULTURAL") return ["Producto & Negocios", "Inteligencia Artificial", "Datos"];
    if (changeType === "STRATEGIC") return ["Producto & Negocios", "Inteligencia Artificial", "Datos"];
    return ["Producto & Negocios", "Datos", "Inteligencia Artificial"];
  }

  return AREAS_PERSONAL_FALLBACK;
}

/* =========================
   6) Refinamiento DEV (2nda pasada IA)
========================= */
const DEV_SPECIALIZATIONS = ["Front End Developer", "Back End Developer", "Full Stack Developer"];

function shouldOfferDevRefinement(mode, topAreaLabel, teamType, changeType) {
  const top = normalize(topAreaLabel);
  if (mode !== MODES.EMPRESA) return false; // en personal podés habilitarlo si querés, pero lo dejo simple
  if (teamType !== "TECH") return false;
  if (changeType !== "TECHNICAL") return false;
  return top.includes("programación para equipos tech") || top.includes("programacion para equipos tech");
}

/* =========================
   7) Mapeo modelo -> catálogo
========================= */
function mapToCatalogLabel(modelLabel = "") {
  const l = normalize(modelLabel);

  // dev roles los colgamos del catálogo de Programación
  if (l.includes("front end developer")) return "Programación";
  if (l.includes("back end developer")) return "Programación";
  if (l.includes("full stack developer")) return "Programación";

  if (l.includes("program")) return "Programación";
  if (l.includes("datos") || l.includes("bi")) return "Datos";
  if (l.includes("producto")) return "Producto";
  if (l.includes("diseño") || l.includes("ux")) return "Diseño & UX";
  if (l.includes("inteligencia artificial") || l.includes("ia") || l.includes("automat")) return "Inteligencia Artificial";
  if (l.includes("marketing") || l.includes("growth")) return "Marketing y Growth";
  if (l.includes("mindset") || l.includes("liderazgo")) return "Mindset y liderazgo digital";

  return null;
}

/* =========================
   8) Texto humano
========================= */
function userSignal(data) {
  if (data?.necesidad) return `Nos basamos en lo que mencionaste: “${String(data.necesidad).slice(0, 140)}…”`;
  if (data?.objetivos) return `Tomamos como referencia tu objetivo: “${String(data.objetivos).slice(0, 140)}…”`;
  if (data?.intereses) return `Consideramos tus intereses: “${String(data.intereses).slice(0, 140)}…”`;
  return null;
}

function buildHumanMessage({ mode, openNeed, topArea, context }) {
  const isEmpresa = mode === MODES.EMPRESA;

  if (isEmpresa) {
    const teamTxt = context?.teamType ? ` (equipo: ${context.teamType})` : "";
    if (!openNeed) return `Perfecto. Por lo que contaron, el foco más claro hoy es **${topArea}**${teamTxt}. Te dejo una ruta concreta y accionable.`;
    return `La necesidad es amplia. Te muestro **3 opciones** para elegir un foco (y que quede claro el “por dónde empezar”).`;
  }

  const personTxt = context?.personType ? ` (perfil: ${context.personType})` : "";
  if (!openNeed) return `Buenísimo. Con lo que contaste, tu mejor camino hoy es **${topArea}**${personTxt}. Te dejo una ruta simple para avanzar sin abarcar de más.`;
  return `Te muestro **3 áreas** que encajan bien con tu perfil. Elegí una como foco principal y después vemos alternativas.`;
}

/* =========================
   9) Entrega contextual (por área)
========================= */
function buildDelivery(areaLabel, mode) {
  const a = normalize(areaLabel);

  if (mode === MODES.PERSONAL) {
    if (a.includes("front end developer")) return "Armar una web/app simple con buena estructura, estilos prolijos y componentes reutilizables.";
    if (a.includes("back end developer")) return "Desarrollar una API simple con persistencia (CRUD) y buenas prácticas.";
    if (a.includes("full stack developer")) return "Entregar una feature completa (front + back) funcionando de punta a punta.";

    if (a.includes("program")) return "Construir un proyecto funcional aplicando buenas prácticas.";
    if (a.includes("datos")) return "Analizar un dataset real y presentar conclusiones claras.";
    if (a.includes("producto")) return "Definir y prototipar una solución basada en un problema real.";
    if (a.includes("ux") || a.includes("diseño")) return "Diseñar y testear una pantalla/prototipo con feedback real.";
    if (a.includes("ia")) return "Aplicar IA en un caso concreto (automatización, clasificación o asistencia).";
    return "Aplicar lo aprendido en un proyecto concreto.";
  }

  // empresa
  if (a.includes("front end developer")) return "Mejorar una interfaz existente o construir componentes reutilizables con buenas prácticas.";
  if (a.includes("back end developer")) return "Implementar o mejorar una API/servicio backend con criterios de calidad.";
  if (a.includes("full stack developer")) return "Entregar una feature completa (front + back) lista para piloto interno.";

  if (a.includes("program")) return "Mejorar una solución existente o desarrollar una funcionalidad concreta.";
  if (a.includes("datos")) return "Crear un dashboard o reporte para toma de decisiones.";
  if (a.includes("producto")) return "Validar una hipótesis de producto con impacto real.";
  if (a.includes("marketing") || a.includes("growth")) return "Mejorar un funnel/campaña con métricas claras.";
  if (a.includes("liderazgo") || a.includes("mindset")) return "Implementar un ritual/proceso que mejore coordinación y delivery.";
  if (a.includes("ia")) return "Automatizar un proceso real del equipo usando IA aplicada.";
  return "Generar una mejora concreta con impacto medible.";
}

/* =========================
   10) Hook
========================= */
export function useOrientationIA(mode) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [result, setResult] = useState(null);

  const submit = async (data) => {
    setLoading(true);
    setStatus("Analizando con IA...");
    setResult(null);

    try {
      const clf = await getClassifier(setStatus);

      // ---- contexto base
      const context =
        mode === MODES.EMPRESA
          ? { teamType: getCompanyTeamType(data?.roles) }
          : { personType: getPersonalType(data) };

      // ---- texto base
      const text =
        mode === MODES.PERSONAL
          ? `
Perfil personal
Experiencia: ${data.experiencia}
Intereses: ${data.intereses}
Objetivos: ${data.objetivos}
Tiempo: ${data.tiempo}
`
          : `
Perfil empresa
Industria: ${data.industria}
Roles (a capacitar): ${data.roles}
Nivel: ${data.nivel}
Urgencia: ${data.urgencia}
Modalidad: ${data.modalidad}
Necesidad (literal): ${data.necesidad}
`;

      // ---- IA: tipo de cambio
      const changeOut = await clf(text.trim(), CHANGE_LABELS, { multi_label: false });
      const changeType = mapChangeLabelToType(changeOut.labels?.[0]);
      context.changeType = changeType;

      // ---- gating: áreas razonables según contexto + cambio
      const candidateLabels =
        mode === MODES.EMPRESA
          ? resolveCompanyCandidateAreas(context.teamType, changeType)
          : resolvePersonalCandidateAreas(context.personType, changeType);

      // ---- IA: elegir área dentro del set razonable
      const openNeed = mode === MODES.EMPRESA ? isOpenNeed(data.necesidad) : false;
      const areaOut = await clf(text.trim(), candidateLabels, { multi_label: true });

      // ordenamos por score desc
      const ranked = areaOut.labels
        .map((l, i) => ({ label: l, score: areaOut.scores[i] }))
        .sort((a, b) => b.score - a.score);

      const selected = openNeed ? ranked.slice(0, 3) : ranked.slice(0, 1);

      // ---- Refinamiento DEV (2nda pasada IA) SOLO cuando corresponde (TECH + TECHNICAL + Programación)
      let refinedDev = null;
      const topAreaLabel = selected[0]?.label || "";

      if (shouldOfferDevRefinement(mode, topAreaLabel, context.teamType, changeType)) {
        const devOut = await clf(text.trim(), DEV_SPECIALIZATIONS, { multi_label: false });
        refinedDev = {
          label: devOut.labels?.[0] || null,
          score: devOut.scores?.[0] ? Math.round(devOut.scores[0] * 100) : null,
        };
      }

      // ---- construir cards con catálogo + insights
      const finalAreas = selected.map((it, idx) => {
        const rawLabel = it.label;
        const displayLabel =
          idx === 0 && refinedDev?.label ? refinedDev.label : rawLabel;

        const catalogLabel = mapToCatalogLabel(displayLabel) || mapToCatalogLabel(rawLabel) || rawLabel;

        const base = CATALOG.find((c) =>
          String(c.label || "").toLowerCase().includes(String(catalogLabel).toLowerCase())
        );

        // clon para no mutar insights globales
        const rawInsight = AREA_INSIGHTS?.[base?.label]?.[mode] || null;
        const insight = rawInsight ? JSON.parse(JSON.stringify(rawInsight)) : null;

        const signal = userSignal(data);
        if (insight?.why && signal) insight.why = [signal, ...insight.why];

        if (insight?.route) {
          insight.route = insight.route.filter(
            (s) => !String(s.name || "").toLowerCase().includes("entrega")
          );
          insight.route.push({
            name: "Entrega",
            text: buildDelivery(displayLabel, mode),
          });
        }

        return {
          area: displayLabel,
          score: Math.round((it.score || 0) * 100),
          cursos: base?.cursos || [],
          insight,
          isPrimary: idx === 0,
          _meta: {
            rawLabel,
            catalogLabel,
          },
        };
      });

      // ---- mensaje principal
      const topArea = finalAreas[0]?.area;

      setResult({
        tipo: mode,
        context,
        mensaje: buildHumanMessage({ mode, openNeed, topArea, context }),
        areas: finalAreas,
      });

      setStatus("");
    } catch (e) {
      console.error(e);
      setStatus("Error al analizar la información.");
    } finally {
      setLoading(false);
    }
  };

  return { submit, loading, status, result };
}