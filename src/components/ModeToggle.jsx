export default function ModeToggle({ mode, setMode }) {
  return (
    <div className="chipsRow" style={{ justifyContent: "center", marginTop: 24 }}>
      <button
        type="button"
        className={`chip ${mode === "personal" ? "chip--selected" : ""}`}
        onClick={() => setMode("personal")}
      >
        Perfil personal
      </button>
      <button
        type="button"
        className={`chip ${mode === "empresa" ? "chip--selected" : ""}`}
        onClick={() => setMode("empresa")}
      >
        Perfil empresa
      </button>
    </div>
  );
}
