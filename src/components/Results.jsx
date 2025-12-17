// src/components/Results.jsx
import React from "react";

function getCTAForArea(area) {
  const a = area.toLowerCase();

  if (a.includes("front") || a.includes("back") || a.includes("stack")) {
    return {
      label: "Ver ruta sugerida",
      action: "route",
    };
  }

  if (a.includes("datos") || a.includes("data")) {
    return {
      label: "Ver plan de aprendizaje en datos",
      action: "data",
    };
  }

  if (a.includes("producto")) {
    return {
      label: "Ver roadmap de producto",
      action: "product",
    };
  }

  if (a.includes("ia") || a.includes("inteligencia")) {
    return {
      label: "Ver casos aplicados de IA",
      action: "ai",
    };
  }

  return {
    label: "Ver más información",
    action: "generic",
  };
}

export default function Results({ result }) {
  const isPersonal = result?.tipo === "personal";

  return (
    <section className="resultBox">
      <h2 className="resultTitle">
        {isPersonal ? "Tus resultados" : "Diagnóstico para tu empresa"}
      </h2>

      {result?.mensaje && <p className="resultIntro">{result.mensaje}</p>}

      {result?.areas?.length > 1 && (
        <p className="resultHint">
          Empezá por la recomendación principal. Las demás son alternativas
          posibles.
        </p>
      )}

      {(!result?.areas || result.areas.length === 0) && (
        <p className="noAreas">
          No pudimos detectar un área clara. Probá escribir un poco más de
          detalle (intereses/objetivos o necesidad del equipo).
        </p>
      )}

      <div className="areaGrid">
        {result?.areas?.map((a) => (
          <article
            key={a.area}
            className={`areaCard ${a.isPrimary ? "areaCard--primary" : ""}`}
          >
            <div className="areaHeader">
              <h3 className="areaName">
                {a.area}
                {a.isPrimary && (
                  <span className="primaryBadge">Recomendación principal</span>
                )}
              </h3>

              <span className="badge">{a.score}% match</span>
            </div>

            <div className="matchBar">
              <div className="matchFill" style={{ width: `${a.score}%` }} />
            </div>

            {/* --- TOP 5 UI / INSIGHTS (opcional) --- */}
            {a.insight && (
              <>
                {/* Nivel sugerido (solo si existe) */}
                {a.insight.level && (
                  <div className="insightGrid">
                    <div className="insightCard">
                      <div className="insightTitle">Nivel sugerido</div>

                      <span
                        className={
                          "levelPill " +
                          (a.insight.level.toLowerCase().includes("inicial")
                            ? "level-green"
                            : a.insight.level.toLowerCase().includes("inter")
                            ? "level-amber"
                            : "level-blue")
                        }
                      >
                        {a.insight.level}
                      </span>

                      <div className="insightText muted">
                        Orientativo: si ya tenés experiencia, podés ir directo a
                        una ruta más avanzada.
                      </div>
                    </div>

                    {/* Objetivo sugerido (más típico empresa) */}
                    {a.insight.goal && (
                      <div className="insightCard">
                        <div className="insightTitle">Objetivo sugerido</div>
                        <div className="insightText">{a.insight.goal}</div>
                        <div className="insightText muted">
                          Esto te sirve como norte para armar un plan de
                          capacitación.
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Por qué */}
                {Array.isArray(a.insight.why) && a.insight.why.length > 0 && (
                  <div className="whyBox">
                    <div className="whyTitle">
                      {isPersonal
                        ? "¿Por qué esta área?"
                        : "¿Por qué recomendamos esto?"}
                    </div>
                    <ul className="whyList">
                      {a.insight.why.map((w, idx) => (
                        <li key={idx}>{w}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Ruta */}
                {Array.isArray(a.insight.route) &&
                  a.insight.route.length > 0 && (
                    <div className="insightCard insightCardWide">
                      <div className="insightTitle">
                        {isPersonal
                          ? "Ruta sugerida"
                          : "Ruta de capacitación sugerida"}
                      </div>

                      <div className="insightText muted">
                        {isPersonal
                          ? "Ruta pensada para avanzar paso a paso, sin abarcar de más."
                          : "Ruta sugerida para generar impacto real en 8–12 semanas."}
                      </div>

                      <div className="route">
                        {a.insight.route.map((step) => (
                          <div className="routeStep" key={step.name}>
                            <div className="routeStepName">{step.name}</div>
                            <div className="routeStepText">{step.text}</div>
                          </div>
                        ))}
                      </div>

                      <div className="insightText muted">
                        {isPersonal
                          ? "Tip: elegí 1 ruta principal y sostenela 8–12 semanas."
                          : "Tip: dividí por roles (ej. analistas / líderes / tech) para acelerar impacto."}
                      </div>
                    </div>
                  )}

                {/* CTAs (opcionales) */}
                <div className="ctaRow">
                  {(() => {
                    const cta = getCTAForArea(a.area);

                    return (
                      <button
                        type="button"
                        className={`ctaBtn ${
                          a.isPrimary ? "ctaBtnPrimary" : "ctaBtnGhost"
                        }`}
                        onClick={() => {
                          // por ahora solo scroll a la ruta (UX simple y efectiva)
                          const el = document.querySelector(".route");
                          if (el)
                            el.scrollIntoView({
                              behavior: "smooth",
                              block: "start",
                            });
                        }}
                      >
                        {cta.label}
                      </button>
                    );
                  })()}

                  <button
                    type="button"
                    className="ctaBtn ctaBtnGhost"
                    onClick={() => {
                      const txt = buildShareText(result, a);
                      navigator.clipboard?.writeText(txt);
                    }}
                  >
                    Copiar resumen
                  </button>
                </div>
                {a.isPrimary && (
                  <div className="primaryHint">
                    Este es el mejor punto de partida según lo que contaste.
                  </div>
                )}
              </>
            )}

            {/* Cursos */}
            {a.cursos?.length ? (
              <>
                <p className="courseIntro">
                  Cursos de Digital House para explorar:
                </p>
                <ul className="courseList">
                  {a.cursos.map((c) => (
                    <li key={c.slug}>
                      <a
                        href={c.slug}
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
              <p className="noCourses">
                No hay cursos cargados para esta área todavía.
              </p>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

function buildShareText(result, area) {
  const lines = [];

  lines.push(
    result.tipo === "personal"
      ? "Orientación (perfil personal)"
      : "Orientación (perfil empresa)"
  );
  lines.push(`Área: ${area.area} (${area.score}% match)`);

  if (area.insight?.goal) lines.push(`Objetivo: ${area.insight.goal}`);

  if (Array.isArray(area.insight?.why) && area.insight.why.length) {
    lines.push("Por qué:");
    area.insight.why.slice(0, 3).forEach((w) => lines.push(`- ${w}`));
  }

  if (Array.isArray(area.cursos) && area.cursos.length) {
    lines.push("Cursos sugeridos:");
    area.cursos
      .slice(0, 5)
      .forEach((c) => lines.push(`- ${c.nombre} (${c.slug})`));
  }

  return lines.join("\n");
}
