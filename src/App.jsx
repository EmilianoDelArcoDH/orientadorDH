// App.jsx
import React, { useState, useEffect } from "react";
import { CATALOG, AREAS } from "./utils/catalogo.js";
import { getClassifier } from "./hooks/ia-transformers.js";
import "./App.css";

export default function App() {
  const [form, setForm] = useState(() => {
    const saved = localStorage.getItem("dh-orientador-form");
    return saved
      ? JSON.parse(saved)
      : {
          edad: "",
          experiencia: "",
          intereses: "",
          objetivos: "",
          tiempo: "",
        };
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

  useEffect(() => {
    localStorage.setItem("dh-orientador-form", JSON.stringify(form));
  }, [form]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleChipClick = (field, text) => {
    setForm((prev) => {
      const current = prev[field] || "";

      // Convertimos el string en array
      const items = current
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      // Toggle
      if (items.includes(text)) {
        const updated = items.filter((i) => i !== text);
        return {
          ...prev,
          [field]: updated.join(", "),
        };
      } else {
        return {
          ...prev,
          [field]: [...items, text].join(", "),
        };
      }
    });
  };

  const isChipSelected = (field, text) => {
    return form[field]
      ?.split(",")
      .map((s) => s.trim())
      .includes(text);
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

      setResult({
        mensaje:
          "Según tus respuestas, estas son las áreas que mejor coinciden con tu perfil. Usalo como punto de partida para explorar las opciones en Digital House.",
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

  return (
    <div className="page">
      <div className="card">
        <header className="header">
          <div>
            <h1 className="title">Orientador Digital House</h1>
            <p className="subtitle">
              Contanos un poco sobre vos y te proponemos áreas y cursos donde
              podrías encajar mejor.
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
              <span className="hint">
                Contexto breve: estudios, trabajo actual, etapa de vida.
              </span>
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
              <span className="hint">
                Estudios, trabajos, cursos relacionados o no a tecnología.
              </span>
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
              <span className="hint">
                Podés combinar varias cosas. Usá los botones sugeridos si te
                ayudan.
              </span>
              <div className="chipsRow">
                {interestChips.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    className={`chip ${
                      isChipSelected("intereses", chip) ? "chip--selected" : ""
                    }`}
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
                placeholder="Ej: Me gusta analizar datos y entender el porqué de las cosas, también disfruto diseñar experiencias para las personas."
                required
              />
            </label>

            <label className="label">
              Objetivos para los próximos 1–3 años
              <span className="hint">
                ¿Qué cambio te gustaría lograr en tu vida profesional?
              </span>
              <div className="chipsRow">
                {objectivesChips.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    className="chip"
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
                placeholder="Ej: Quiero cambiar de rubro a datos o programación, conseguir un trabajo remoto y mejorar mi ingreso."
                required
              />
            </label>

            <label className="label">
              Tiempo y modalidad
              <span className="hint">
                Contanos cuántas horas y qué formato te sirve más.
              </span>
              <div className="chipsRow">
                {timeChips.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    className="chip"
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
          <button
            type="button"
            className="button button--secondary"
            onClick={() => {
              localStorage.removeItem("dh-orientador-form");
              setForm({
                edad: "",
                experiencia: "",
                intereses: "",
                objetivos: "",
                tiempo: "",
              });
            }}
          >
            Borrar respuestas
          </button>
        </form>

        {!loading && status && <p className="status statusBelow">{status}</p>}

        {result && (
          <section className="resultBox">
            <h2 className="resultTitle">Tus resultados</h2>
            <p className="resultIntro">{result.mensaje}</p>

            {result.areas.length === 0 && (
              <p className="noAreas">
                No pudimos detectar un área clara. Probá escribir un poco más de
                detalle sobre tus intereses y objetivos.
              </p>
            )}

            <div className="areaGrid">
              {result.areas.map((a) => (
                <article key={a.area} className="areaCard">
                  <div className="areaHeader">
                    <h3 className="areaName">{a.area}</h3>
                    <span className="badge">{a.score}% match</span>
                  </div>
                  <div className="matchBar">
                    <div
                      className="matchFill"
                      style={{ width: `${a.score}%` }}
                    />
                  </div>
                  {a.cursos.length ? (
                    <>
                      <p className="courseIntro">
                        Cursos de Digital House para explorar:
                      </p>
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
                    <p className="noCourses">
                      No hay cursos cargados para esta área todavía.
                    </p>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
