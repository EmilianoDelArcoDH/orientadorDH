// src/components/PersonalForm.jsx
import { useState, useEffect } from "react";
import { toggleChipValue, hasChip } from "../utils/chips";
import { startOrientationTour } from "../utils/orientationTour";

const INTEREST_CHIPS = [
  "Analizar datos",
  "Programar",
  "Diseñar experiencias",
  "Marketing digital",
  "Emprender",
];

const OBJECTIVE_CHIPS = [
  "Conseguir mi primer trabajo tech",
  "Cambiar de carrera",
  "Mejorar mi salario",
  "Trabajar remoto",
  "Crear un proyecto propio",
];

const TIME_CHIPS = [
  "5–8 horas semanales",
  "10–12 horas semanales",
  "Solo fines de semana",
];

export default function PersonalForm({ onSubmit }) {
  const [form, setForm] = useState({
    edad: "",
    experiencia: "",
    intereses: "",
    objetivos: "",
    tiempo: "",
  });

  useEffect(() => {
  const seen = localStorage.getItem("orientationTourSeen-personal");
  if (!seen) {
    startOrientationTour("personal");
  }
}, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleChip = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: toggleChipValue(prev[field], value),
    }));
  };

  return (
    <form
      className="form"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form);
      }}
    >
      <div className="formGrid">
        <label className="label">
          Edad / situación actual
          <input
            id="field-edad"
            className="input"
            name="edad"
            value={form.edad}
            onChange={handleChange}
            placeholder="Ej: 25 años, estudiante, trabajando en marketing"
            required
          />
        </label>

        <label className="label">
          Experiencia previa
          <textarea
            id="field-experiencia"
            className="textarea"
            name="experiencia"
            value={form.experiencia}
            onChange={handleChange}
            placeholder="Describe tu experiencia previa con tecnología"
            required
          />
        </label>

        <label className="label">
          ¿Qué cosas te interesan?
          <div className="chipsRow">
            {INTEREST_CHIPS.map((chip) => (
              <button
                key={chip}
                type="button"
                className={`chip ${hasChip(form.intereses, chip) ? "chip--selected" : ""}`}
                onClick={() => handleChip("intereses", chip)}
              >
                {chip}
              </button>
            ))}
          </div>
          <textarea
            id="field-intereses"
            className="textarea"
            name="intereses"
            value={form.intereses}
            onChange={handleChange}
            placeholder="Podés escribir o usar las etiquetas"
            required
          />
        </label>

        <label className="label">
          Objetivos
          <div className="chipsRow">
            {OBJECTIVE_CHIPS.map((chip) => (
              <button
                key={chip}
                type="button"
                className={`chip ${hasChip(form.objetivos, chip) ? "chip--selected" : ""}`}
                onClick={() => handleChip("objetivos", chip)}
              >
                {chip}
              </button>
            ))}
          </div>
          <textarea
            id="field-objetivos"
            className="textarea"
            name="objetivos"
            value={form.objetivos}
            onChange={handleChange}
            placeholder="Podés escribir o usar las etiquetas"
            required
          />
        </label>

        <label className="label">
          Tiempo disponible
          <div className="chipsRow">
            {TIME_CHIPS.map((chip) => (
              <button
                key={chip}
                type="button"
                className={`chip ${hasChip(form.tiempo, chip) ? "chip--selected" : ""}`}
                onClick={() => handleChip("tiempo", chip)}
              >
                {chip}
              </button>
            ))}
          </div>
          <textarea
            id="field-tiempo"
            className="textarea"
            name="tiempo"
            value={form.tiempo}
            onChange={handleChange}
            placeholder="Podés escribir o usar las etiquetas"
            required
          />
        </label>
      </div>

      <button className="button" type="submit">
        Obtener orientación con IA
      </button>
    </form>
  );
}
