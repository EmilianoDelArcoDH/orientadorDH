function norm(s = "") {
  return String(s).toLowerCase();
}

function hasAny(text, arr) {
  const t = norm(text);
  return arr.some((k) => t.includes(norm(k)));
}

export function pickDevSpecialization({ mode, data }) {
  const text = [
    data?.intereses,
    data?.objetivos,
    data?.experiencia,
    data?.roles,
    data?.necesidad,
  ]
    .filter(Boolean)
    .join(" ");

  // señales FE
  const fe = [
    "front",
    "frontend",
    "html",
    "css",
    "javascript",
    "js",
    "react",
    "vue",
    "angular",
    "ui",
    "ux",
    "web",
    "diseño",
    "landing",
    "ecommerce",
    "responsive",
    "accesibilidad",
  ];

  // señales BE
  const be = [
    "back",
    "backend",
    "api",
    "apis",
    "rest",
    "graphql",
    "server",
    "servidor",
    "base de datos",
    "sql",
    "mysql",
    "postgres",
    "node",
    "express",
    "java",
    "spring",
    "python",
    "django",
    "flask",
    "microservicios",
    "auth",
    "autenticación",
  ];

  const hasFE = hasAny(text, fe);
  const hasBE = hasAny(text, be);

  if (hasFE && !hasBE) return "Front End Developer";
  if (!hasFE && hasBE) return "Back End Developer";
  if (hasFE && hasBE) return "Full Stack Developer";

  // default (si habló de programación + experiencias visuales, lo mando FE)
  if (
    mode === "personal" &&
    hasAny(text, ["programar", "diseñar", "experiencias"])
  ) {
    return "Front End Developer";
  }

  // fallback general
  return null;
}

export function filterCoursesBySpecialization(cursos = [], specialization) {
  if (!specialization) return cursos;

  const s = norm(specialization);

  const patterns = s.includes("front")
    ? [
        "front",
        "frontend",
        "react",
        "javascript",
        "html",
        "css",
        "web",
        "ux",
        "ui",
      ]
    : s.includes("back")
    ? [
        "back",
        "backend",
        "api",
        "node",
        "express",
        "java",
        "spring",
        "python",
        "sql",
        "base de datos",
      ]
    : s.includes("full")
    ? ["full", "stack", "web", "javascript", "node", "react"]
    : [];

  const out = cursos
    .map((c) => ({ ...c, _n: norm(c?.nombre) }))
    .filter((c) => patterns.some((p) => c._n.includes(p)))
    .map(({ _n, ...c }) => c);

  // si el filtro dejó vacío, devolvemos el original
  return out.length ? out : cursos;
}
