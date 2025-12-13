// Áreas y catálogo de cursos (simplificado, adaptalo a DH real)
export const AREAS = [
    "Programación / Desarrollo",
    "Datos / Analytics / BI",
    "Diseño UX/UI",
    "Marketing Digital / Growth",
    "Inteligencia Artificial para Negocios",
];

export const CATALOG = [
    {
        label: "Programación / Desarrollo",
        cursos: [
            {
                nombre: "Certified Tech Developer",
                slug: "/carreras/certified-tech-developer",
            },
            {
                nombre: "Desarrollo Full Stack",
                slug: "/cursos/programacion-full-stack",
            },
            {
                nombre: "Fundamentos de Python",
                slug: "/cursos/fundamentos-de-python",
            },
        ],
    },
    {
        label: "Datos / Analytics / BI",
        cursos: [
            { nombre: "Data Analytics", slug: "/cursos/data-analytics" },
            { nombre: "Power BI", slug: "/cursos/power-bi" },
            { nombre: "SQL Desde Cero", slug: "/cursos/sql" },
        ],
    },
    {
        label: "Diseño UX/UI",
        cursos: [{ nombre: "Diseño UX/UI", slug: "/cursos/ux-ui" }],
    },
    {
        label: "Marketing Digital / Growth",
        cursos: [
            { nombre: "Marketing Digital", slug: "/cursos/marketing-digital" },
            { nombre: "Growth Marketing", slug: "/cursos/growth-marketing" },
        ],
    },
    {
        label: "Inteligencia Artificial para Negocios",
        cursos: [{ nombre: "IA para Negocios", slug: "/cursos/ia-para-negocios" }],
    },
];
