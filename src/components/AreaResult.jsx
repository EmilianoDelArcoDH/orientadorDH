export default function AreaResult({ area }) {
  return (
    <div className="dh-area">
      <strong>{area.area}</strong>
      <span>{area.score}% match</span>

      <ul>
        {area.cursos.map((c) => (
          <li key={c.slug}>
            <a href={c.slug} target="_blank" rel="noreferrer">
              {c.nombre}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
