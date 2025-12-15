import { useState } from "react";
import ModeToggle from "./components/ModeToggle";
import PersonalForm from "./components/PersonalForm";
import CompanyForm from "./components/CompanyForm";
import Results from "./components/Results";
import { useOrientationIA } from "./hooks/useOrientationIA";
import { MODES } from "./utils/constants";
import "./App.css";

export default function App() {
  const [mode, setMode] = useState(MODES.PERSONAL);
  const { submit, loading, status, result } = useOrientationIA(mode);

  return (
    <div className="page">
      <div className="card">
        <header className="header">
          <h1 className="title">Orientador Digital House</h1>
          <p className="subtitle">
            Completá el formulario y te sugerimos cursos según tu perfil o las
            necesidades de tu empresa.
          </p>

          <ModeToggle mode={mode} setMode={setMode} />

          <div className="steps">
            <div className="step">
              <span className="stepNumber">1</span>
              <span className="stepText">Completá</span>
            </div>
            <div className="step">
              <span className="stepNumber">2</span>
              <span className="stepText">IA analiza</span>
            </div>
            <div className="step">
              <span className="stepNumber">3</span>
              <span className="stepText">Explorá cursos</span>
            </div>
          </div>
        </header>

        {loading && (
          <div className="progressWrapper">
            <div className="progressBar">
              <div className="progressFill" />
            </div>
            {status && <p className="status">{status}</p>}
          </div>
        )}

        {mode === MODES.PERSONAL && <PersonalForm onSubmit={submit} />}
        {mode === MODES.EMPRESA && <CompanyForm onSubmit={submit} />}

        {result && <Results result={result} />}
      </div>
    </div>
  );
}
