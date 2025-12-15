import { useState } from "react";
import { getClassifier } from "../hooks/ia-transformers";
import { CATALOG } from "../utils/catalogo";
import { MODES } from "../utils/constants";
import { AREA_INSIGHTS } from "../utils/insights";

const AREAS_PERSONAL = [
  "Programación",
  "Datos",
  "Producto & Negocios",
  "Diseño & UX",
  "Inteligencia Artificial",
];

const AREAS_EMPRESA = [
  "Capacitación en Datos y BI",
  "IA aplicada y automatización",
  "Desarrollo de producto digital",
  "Programación para equipos tech",
  "Marketing y Growth",
  "Mindset y liderazgo digital",
];

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
      const labels = mode === MODES.PERSONAL ? AREAS_PERSONAL : AREAS_EMPRESA;

      const text =
        mode === MODES.PERSONAL
          ? `
Perfil personal
Situación: ${data.edad}
Experiencia: ${data.experiencia}
Intereses: ${data.intereses}
Objetivos: ${data.objetivos}
Tiempo: ${data.tiempo}
`
          : `
Perfil empresa
Industria: ${data.industria}
Roles: ${data.roles}
Nivel: ${data.nivel}
Urgencia: ${data.urgencia}
Modalidad: ${data.modalidad}
Necesidad: ${data.necesidad}
`;

      const out = await clf(text.trim(), labels, { multi_label: true });

      const areas = out.labels
        .map((l, i) => {
          const base = CATALOG.find((c) =>
            l.toLowerCase().includes(c.label.toLowerCase())
          );

          const insight = AREA_INSIGHTS[base?.label]?.[mode];

          return {
            area: l,
            score: Math.round(out.scores[i] * 100),
            cursos: base?.cursos || [],
            insight: insight || null,
          };
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);

      setResult({ tipo: mode, areas });
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
