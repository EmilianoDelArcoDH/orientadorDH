import React, { useMemo, useState } from "react";
import { CATALOG, AREAS } from "./utils/catalogo.js";
import { getClassifier } from "./hooks/ia-transformers.js";
import "./App.css";

export default function App() {
  const [form, setForm] = useState({
    edad: "",
    experiencia: "",
    intereses: "",
    objetivos: "",
    tiempo: "",
  });
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const interestChips = [
    "Analizar datos y sacar conclusiones",
    "Diseñar experiencias y pantallas",
    "Programar y resolver problemas lógicos",
    "Crear campañas y contenido digital",
    "Emprender proyectos propios",
  ];

  const objectivesChips = [
    "Conseguir mi primer trabajo en tecnología",
    "Reconvertirme desde otra área",
    "Mejorar mi salario en el corto plazo",
    "Aplicar IA en mi trabajo actual",
    "Emprender con un proyecto digital",
  ];

  const timeChips = [
    "5–8 horas semanales, modalidad remota",
    "10–12 horas semanales, combinación remoto/presencial",
    "Solo puedo estudiar fines de semana",
  ];

  // ---------- Chips toggle con comas ----------
  const handleChipClick = (field, text) => {
    setForm((prev) => {
      const current = prev[field] || "";
      const items = current
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      if (items.includes(text)) {
        const updated = items.filter((i) => i !== text);
        return { ...prev, [field]: updated.join(", ") };
      }
      return { ...prev, [field]: [...items, text].join(", ") };
    });
  };

  const isChipSelected = (field, text) => {
    return (form[field] || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .includes(text);
  };

  // ---------- Helpers TOP 5 ----------
  const inferNivel = (text) => {
    const t = (text || "").toLowerCase();

    const beginner = [
      "nunca",
      "desde cero",
      "principiante",
      "sin experiencia",
      "no sé",
      "no se",
      "recién empiezo",
      "empezar",
    ];
    const advanced = [
      "años",
      "experiencia",
      "trabajo",
      "proyecto",
      "github",
      "react",
      "node",
      "sql",
      "power bi",
      "python",
      "figma",
      "ux",
      "api",
      "docker",
      "kubernetes",
    ];

    const b = beginner.some((k) => t.includes(k));
    const a = advanced.some((k) => t.includes(k));

    if (a && !b) return { tag: "Intermedio/Avanzado", color: "blue" };
    if (b && !a) return { tag: "Principiante", color: "green" };
    return { tag: "Intermedio", color: "amber" };
  };

  const buildPerfil = ({ topAreaLabel, form }) => {
    const exp = (form.experiencia || "").toLowerCase();
    const obj = (form.objetivos || "").toLowerCase();
    const time = (form.tiempo || "").toLowerCase();

    const reconversion =
      obj.includes("reconvert") ||
      obj.includes("cambiar") ||
      obj.includes("nuevo") ||
      obj.includes("primer trabajo");

    const urgencia =
      obj.includes("corto plazo") ||
      obj.includes("urgente") ||
      obj.includes("rápido") ||
      obj.includes("rapido");

    const remoto =
      time.includes("remot") || time.includes("online") || time.includes("a distancia");

    const aplicado =
      exp.includes("empresa") ||
      exp.includes("trabajo") ||
      obj.includes("aplicar") ||
      obj.includes("mi trabajo");

    const piezas = [];

    // 1) “tipo de perfil”
    if (topAreaLabel.includes("Datos")) piezas.push("Perfil analítico");
    else if (topAreaLabel.includes("UX")) piezas.push("Perfil creativo orientado a usuarios");
    else if (topAreaLabel.includes("Marketing")) piezas.push("Perfil comunicacional orientado a crecimiento");
    else if (topAreaLabel.includes("Programación")) piezas.push("Perfil lógico orientado a construcción");
    else if (topAreaLabel.includes("Inteligencia Artificial")) piezas.push("Perfil orientado a innovación con IA");
    else piezas.push("Perfil mixto");

    // 2) “contexto”
    if (reconversion) piezas.push("en proceso de reconversión");
    if (aplicado) piezas.push("con foco en aplicación práctica");
    if (urgencia) piezas.push("con objetivo de impacto en el corto plazo");
    if (remoto) piezas.push("y preferencia por modalidad remota");

    return piezas.join(", ") + ".";
  };

  // Ruta sugerida por área (simple, editable)
  const ROUTES = useMemo(
    () => ({
      "Programación / Desarrollo": [
        { step: "Fundamentos", text: "Lógica + bases de programación (desde cero si hace falta)." },
        { step: "Especialización", text: "Frontend/Backend/Full Stack según tu interés." },
        { step: "Proyecto", text: "Portfolio con 1–2 proyectos aplicados para mostrar resultados." },
      ],
      "Datos / Analytics / BI": [
        { step: "Fundamentos", text: "Excel/SQL básico + pensamiento analítico." },
        { step: "Especialización", text: "BI (Power BI) + análisis y storytelling con datos." },
        { step: "Proyecto", text: "Dashboard completo con dataset real y conclusiones." },
      ],
      "Diseño UX/UI": [
        { step: "Fundamentos", text: "Research básico + principios de diseño y usabilidad." },
        { step: "Especialización", text: "UI + prototipado (Figma) + flujos y componentes." },
        { step: "Proyecto", text: "Caso completo (problem → solución) para portfolio." },
      ],
      "Marketing Digital / Growth": [
        { step: "Fundamentos", text: "Canales, métricas y objetivos (funnel)." },
        { step: "Especialización", text: "Campañas + contenido + optimización por performance." },
        { step: "Proyecto", text: "Plan de growth con KPIs y experimentos." },
      ],
      "Inteligencia Artificial para Negocios": [
        { step: "Fundamentos", text: "Qué es IA, casos de uso, límites y buenas prácticas." },
        { step: "Especialización", text: "Automatización y aplicaciones en procesos reales." },
        { step: "Proyecto", text: "Propuesta aplicable en tu contexto laboral (caso real)." },
      ],
    }),
    []
  );

  const buildPorQue = ({ topAreaLabel, scores, form }) => {
    const intereses = (form.intereses || "").trim();
    const objetivos = (form.objetivos || "").trim();
    const experiencia = (form.experiencia || "").trim();

    const top = scores?.[0];
    const second = scores?.[1];

    const bullets = [];

    bullets.push(
      `Tus respuestas tienen mayor coincidencia con **${topAreaLabel}** (match ${top?.score ?? "?"}%).`
    );

    if (second) {
      bullets.push(
        `También aparece afinidad secundaria con **${second.label}** (${second.score}%), por eso te sugerimos más de una opción.`
      );
    }

    const signals = [];
    if (intereses) signals.push("intereses");
    if (objetivos) signals.push("objetivos");
    if (experiencia) signals.push("experiencia");

    bullets.push(
      `La recomendación se basa principalmente en tus ${signals.join(", ")} (texto libre + etiquetas seleccionadas).`
    );

    bullets.push(
      `Si querés “ajustar” el resultado, probá agregar 1–2 frases más específicas sobre qué tareas te entusiasman (por ejemplo: “hacer dashboards”, “diseñar pantallas”, “programar APIs”, etc.).`
    );

    return bullets;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult(null);
    setStatus("");
    setLoading(true);

    try {
      const userText = `
Edad / situación: ${form.edad}
Experiencia: ${form.experiencia}
Intereses: ${form.intereses}
Objetivos: ${form.objetivos}
Tiempo / modalidad: ${form.tiempo}
      `.trim();

      if (!userText) {
        setResult({
          mensaje: "Completá al menos una respuesta para poder orientarte 😊",
          areas: [],
        });
        setLoading(false);
        return;
      }

      const clf = await getClassifier(setStatus);
      setStatus("Analizando tus respuestas con IA...");
      const out = await clf(userText, AREAS, { multi_label: true });

      const scores = out.labels
        .map((label, i) => ({
          label,
          score: Math.round(out.scores[i] * 100),
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);

      const recomendaciones = scores.map((area) => {
        const cat = CATALOG.find((c) => c.label === area.label);
        return {
          area: area.label,
          score: area.score,
          cursos: cat ? cat.cursos : [],
        };
      });

      // TOP 5 extras
      const topAreaLabel = recomendaciones?.[0]?.area || "una opción";
      const perfil = buildPerfil({ topAreaLabel, form });
      const nivel = inferNivel(`${form.experiencia}\n${form.objetivos}\n${form.intereses}`);
      const ruta = ROUTES[topAreaLabel] || [];
      const porQue = buildPorQue({ topAreaLabel, scores, form });

      setResult({
        mensaje:
          "Estas sugerencias son un punto de partida. Podés ajustar respuestas y volver a generar una orientación más precisa.",
        perfil,
        nivel,
        ruta,
        porQue,
        areas: recomendaciones,
      });

      setStatus("");
    } catch (err) {
      console.error(err);
      setStatus("Ocurrió un error al analizar las respuestas.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyResumen = async () => {
    if (!result) return;
    const lines = [];
    lines.push(`Perfil: ${result.perfil}`);
    lines.push(`Nivel recomendado: ${result.nivel?.tag}`);
    lines.push(`Áreas sugeridas: ${result.areas?.map((a) => `${a.area} (${a.score}%)`).join(", ")}`);
    if (result.ruta?.length) {
      lines.push(`Ruta sugerida:`);
      result.ruta.forEach((r) => lines.push(`- ${r.step}: ${r.text}`));
    }
    const text = lines.join("\n");
    await navigator.clipboard.writeText(text);
    setStatus("Resumen copiado al portapapeles ✅");
    setTimeout(() => setStatus(""), 2500);
  };

  const handleGuardarJSON = () => {
    if (!result) return;
    const payload = { form, result };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "orientacion-digitalhouse.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="page">
      <div className="card">
        <header className="header">
          <div>
            <h1 className="title">Orientador Digital House</h1>
            <p className="subtitle">
              Contanos un poco sobre vos y te proponemos áreas y cursos donde podrías encajar mejor.
            </p>
          </div>

          <div className="steps">
            <div className="step">
              <span className="stepNumber">1</span>
              <span className="stepText">Completá el formulario</span>
            </div>
            <div className="step">
              <span className="stepNumber">2</span>
              <span className="stepText">La IA analiza tu perfil</span>
            </div>
            <div className="step">
              <span className="stepNumber">3</span>
              <span className="stepText">Explorá tus opciones</span>
            </div>
          </div>
        </header>

        {loading && (
          <div className="progressWrapper">
            <div className="progressBar">
              <div className="progressFill" />
            </div>
            {status && <p className="status statusInline">{status}</p>}
          </div>
        )}

        <form onSubmit={handleSubmit} className="form">
          <div className="formGrid">
            <label className="label">
              Edad / situación actual
              <span className="hint">Contexto breve: estudios, trabajo actual, etapa de vida.</span>
              <input
                className="input"
                type="text"
                name="edad"
                value={form.edad}
                onChange={handleChange}
                placeholder="Ej: 25 años, trabajando en administración y estudiando marketing"
                required
              />
            </label>

            <label className="label">
              Experiencia previa
              <span className="hint">Estudios, trabajos, cursos relacionados o no a tecnología.</span>
              <textarea
                className="textarea"
                name="experiencia"
                rows="3"
                value={form.experiencia}
                onChange={handleChange}
                placeholder="Ej: Estudié marketing, trabajé 2 años en ventas, hice un curso corto de Excel."
                required
              />
            </label>

            <label className="label">
              ¿Qué cosas te interesan o disfrutás hacer?
              <span className="hint">Podés combinar varias cosas. Usá los botones sugeridos si te ayudan.</span>
              <div className="chipsRow">
                {interestChips.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    className={`chip ${isChipSelected("intereses", chip) ? "chip--selected" : ""}`}
                    onClick={() => handleChipClick("intereses", chip)}
                  >
                    {chip}
                  </button>
                ))}
              </div>
              <textarea
                className="textarea"
                name="intereses"
                rows="3"
                value={form.intereses}
                onChange={handleChange}
                placeholder="Ej: Me gusta analizar datos y entender el porqué de las cosas, también disfruto diseñar experiencias."
                required
              />
            </label>

            <label className="label">
              Objetivos para los próximos 1–3 años
              <span className="hint">¿Qué cambio te gustaría lograr en tu vida profesional?</span>
              <div className="chipsRow">
                {objectivesChips.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    className={`chip ${isChipSelected("objetivos", chip) ? "chip--selected" : ""}`}
                    onClick={() => handleChipClick("objetivos", chip)}
                  >
                    {chip}
                  </button>
                ))}
              </div>
              <textarea
                className="textarea"
                name="objetivos"
                rows="3"
                value={form.objetivos}
                onChange={handleChange}
                placeholder="Ej: Quiero cambiar de rubro, conseguir un trabajo remoto y mejorar mi ingreso."
                required
              />
            </label>

            <label className="label">
              Tiempo y modalidad
              <span className="hint">Contanos cuántas horas y qué formato te sirve más.</span>
              <div className="chipsRow">
                {timeChips.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    className={`chip ${isChipSelected("tiempo", chip) ? "chip--selected" : ""}`}
                    onClick={() => handleChipClick("tiempo", chip)}
                  >
                    {chip}
                  </button>
                ))}
              </div>
              <textarea
                className="textarea"
                name="tiempo"
                rows="2"
                value={form.tiempo}
                onChange={handleChange}
                placeholder="Ej: 8–10 horas por semana, prefiero modalidad remota con algunas clases en vivo."
                required
              />
            </label>
          </div>

          <button type="submit" className="button" disabled={loading}>
            {loading ? "Procesando..." : "Obtener orientación con IA"}
          </button>
        </form>

        {!loading && status && <p className="status statusBelow">{status}</p>}

        {result && (
          <section className="resultBox">
            <h2 className="resultTitle">Tus resultados</h2>

            {/* TOP 5 (1) Perfil */}
            <div className="insightGrid">
              <div className="insightCard">
                <div className="insightTitle">Perfil resumido</div>
                <div className="insightText">{result.perfil}</div>
              </div>

              {/* TOP 5 (2) Nivel */}
              <div className="insightCard">
                <div className="insightTitle">Nivel recomendado</div>
                <div className={`levelPill level-${result.nivel?.color || "amber"}`}>
                  {result.nivel?.tag}
                </div>
                <div className="insightText muted">
                  Esto se infiere por tu experiencia/objetivos (podés ajustar el texto y recalcular).
                </div>
              </div>

              {/* TOP 5 (3) Ruta sugerida */}
              <div className="insightCard insightCardWide">
                <div className="insightTitle">Ruta sugerida</div>
                <div className="route">
                  {result.ruta?.map((r) => (
                    <div key={r.step} className="routeStep">
                      <div className="routeStepName">{r.step}</div>
                      <div className="routeStepText">{r.text}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <p className="resultIntro">{result.mensaje}</p>

            {/* TOP 5 (4) Por qué */}
            <div className="whyBox">
              <div className="whyTitle">¿Por qué te recomendamos esto?</div>
              <ul className="whyList">
                {result.porQue?.map((b, idx) => (
                  <li key={idx}>{b}</li>
                ))}
              </ul>
            </div>

            {/* Áreas + cursos (lo que ya tenías) */}
            <div className="areaGrid">
              {result.areas.map((a) => (
                <article key={a.area} className="areaCard">
                  <div className="areaHeader">
                    <h3 className="areaName">{a.area}</h3>
                    <span className="badge">{a.score}% match</span>
                  </div>
                  <div className="matchBar">
                    <div className="matchFill" style={{ width: `${a.score}%` }} />
                  </div>

                  {a.cursos.length ? (
                    <>
                      <p className="courseIntro">Cursos de Digital House para explorar:</p>
                      <ul className="courseList">
                        {a.cursos.map((c) => (
                          <li key={c.slug}>
                            <a
                              href={`https://www.digitalhouse.com/ar${c.slug}`}
                              target="_blank"
                              rel="noreferrer"
                              className="link"
                            >
                              {c.nombre}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <p className="noCourses">No hay cursos cargados para esta área todavía.</p>
                  )}
                </article>
              ))}
            </div>

            {/* TOP 5 (5) CTA suave */}
            <div className="ctaRow">
              <a
                className="ctaBtn"
                href={`https://www.digitalhouse.com/ar`}
                target="_blank"
                rel="noreferrer"
              >
                Ver programas
              </a>

              <a
                className="ctaBtn ctaBtnGhost"
                href="https://www.digitalhouse.com/ar"
                target="_blank"
                rel="noreferrer"
                title="Podés reemplazar esto por el link real de asesoramiento/chat"
              >
                Hablar con un asesor
              </a>

              <button type="button" className="ctaBtn ctaBtnGhost" onClick={handleCopyResumen}>
                Copiar resumen
              </button>

              <button type="button" className="ctaBtn ctaBtnGhost" onClick={handleGuardarJSON}>
                Guardar orientación (JSON)
              </button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
