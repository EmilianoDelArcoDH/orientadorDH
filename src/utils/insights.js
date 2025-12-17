export const AREA_INSIGHTS = {
  "Programación": {
    personal: {
      why: [
        "Mostrás interés por resolver problemas lógicos y construir soluciones.",
        "Es un camino con salida laboral y progreso medible por proyectos.",
      ],
      route: [
        { name: "Fundamentos", text: "Aprender las bases necesarias para empezar sin frustración." },
        { name: "Especialización", text: "Front End Developer" }, // el hook lo pisa si corresponde
        { name: "Proyecto", text: "Portfolio: 2–3 proyectos reales y deploy." },
      ],
      level: "Inicial",
    },
    empresa: {
      why: [
        "Mejora la autonomía técnica del equipo.",
        "Reduce dependencia de terceros y acelera iteración.",
      ],
      goal: "Fortalecer equipos de desarrollo y producto con práctica aplicada.",
      level: "Intermedio",
      route: [
        { name: "Base común", text: "Estándares, Git flow, calidad y testing básico." },
        { name: "Especialización", text: "Front End Developer / Back End Developer" },
      ],
    },
  },

  "Datos": {
    personal: {
      why: [
        "Te interesa analizar información y sacar conclusiones.",
        "Los perfiles de datos son muy demandados en múltiples industrias.",
      ],
      route: [
        { name: "Análisis", text: "Lectura e interpretación de datos." },
        { name: "Herramientas", text: "SQL + BI + visualización." },
        { name: "Insights", text: "Contar historias con datos y decidir con evidencia." },
      ],
      level: "Inicial",
    },
    empresa: {
      why: [
        "Permite decisiones más informadas y menos opinológicas.",
        "Mejora eficiencia y seguimiento de resultados.",
      ],
      goal: "Instalar cultura data-driven con tableros y métricas claras.",
      level: "Intermedio",
      route: [
        { name: "Métricas", text: "Definir KPIs + eventos + calidad de datos." },
        { name: "BI", text: "Dashboards accionables y adopción interna." },
        { name: "Ciclo", text: "Revisión semanal + acciones + seguimiento." },
      ],
    },
  },

  "Producto": {
    personal: {
      why: [
        "Te interesa entender usuarios, negocio y priorización.",
        "Podés aplicar skills rápido en proyectos reales.",
      ],
      level: "Inicial",
      route: [
        { name: "Fundamentos", text: "Discovery, MVP, métricas y priorización." },
        { name: "Ejecución", text: "Roadmap, comunicación y coordinación con stakeholders." },
        { name: "Portfolio", text: "Caso de producto documentado (1–2)." },
      ],
    },
    empresa: {
      why: [
        "Alinea equipos a objetivos y reduce trabajo sin impacto.",
        "Mejora foco y velocidad de delivery.",
      ],
      goal: "Mejorar priorización, coordinación y delivery de producto.",
      level: "Intermedio",
      route: [
        { name: "Objetivos", text: "OKRs/KPIs y definición de éxito." },
        { name: "Proceso", text: "Discovery continuo + priorización + delivery." },
        { name: "Sistema", text: "Rituales, documentación y feedback loop." },
      ],
    },
  },

  "Inteligencia Artificial": {
    personal: {
      why: [
        "La IA potencia perfiles tech y no-tech con automatización real.",
        "Es un diferencial fuerte si lo bajás a casos concretos.",
      ],
      level: "Inicial",
      route: [
        { name: "Base", text: "Prompting, herramientas y límites." },
        { name: "Automatización", text: "Flujos y asistentes para tareas reales." },
        { name: "Proyecto", text: "1 caso aplicado (demo + documentación)." },
      ],
    },
    empresa: {
      why: [
        "Reduce tiempos operativos y mejora consistencia.",
        "Permite escalar conocimiento interno (playbooks/asistentes).",
      ],
      goal: "Aplicar IA en procesos con ROI visible en 8–12 semanas.",
      level: "Intermedio",
      route: [
        { name: "Casos", text: "Seleccionar 2–3 casos de alto impacto." },
        { name: "Piloto", text: "Implementar con métricas y controles." },
        { name: "Escala", text: "Governance, seguridad, adopción." },
      ],
    },
  },
};
