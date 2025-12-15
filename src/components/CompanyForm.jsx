import { useState } from "react";

export default function CompanyForm({ onSubmit }) {
  const [empresa, setEmpresa] = useState({
    industria: "",
    roles: "",
    necesidad: "",
    nivel: "",
    urgencia: "",
    modalidad: "",
  });

  const handle = (e) =>
    setEmpresa({ ...empresa, [e.target.name]: e.target.value });

  return (
    <form
      className="form"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(empresa);
      }}
    >
      <div className="formGrid">
        <label className="label">
          Industria
          <input
            className="input"
            name="industria"
            onChange={handle}
            placeholder="Ej: Tecnología, Salud, Educación"
            required
          />
        </label>

        <label className="label">
          Roles a capacitar
          <input className="input" name="roles" onChange={handle} placeholder="Ej: Desarrollador, Diseñador, Marketer" required />
        </label>

        <label className="label">
          Necesidad principal
          <textarea
            className="textarea"
            name="necesidad"
            onChange={handle}
            placeholder="Describe la necesidad principal"
            required
          />
        </label>

        <label className="label">
          Nivel del equipo
          <select className="input" name="nivel" onChange={handle} required>
            <option value="">Seleccionar</option>
            <option value="bajo">Inicial</option>
            <option value="medio">Intermedio</option>
            <option value="alto">Avanzado</option>
          </select>
        </label>

        <label className="label">
          Urgencia
          <select className="input" name="urgencia" onChange={handle} required>
            <option value="">Seleccionar</option>
            <option value="1-3">1 – 3 meses</option>
            <option value="3-6">3 – 6 meses</option>
            <option value="6+">6+ meses</option>
          </select>
        </label>

        <label className="label">
          Modalidad
          <input className="input" name="modalidad" onChange={handle} placeholder="Ej: Presencial, Remoto, Híbrido" required />
        </label>
      </div>

      <button className="button" type="submit">
        Generar diagnóstico
      </button>
    </form>
  );
}
