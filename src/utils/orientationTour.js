import { driver } from "driver.js";

const COMMON_STEPS = [
    {
        element: "#field-roles",
        popover: {
            title: "¿A quién vamos a capacitar?",
            description:
                "Contanos el rol real del equipo o de la persona. Ej: administración, ventas, desarrollo, operaciones.",
        },
    },
];

export function startOrientationTour(mode = "empresa") {
    const steps =
        mode === "empresa"
            ? [
                {
                    element: "#field-industria",
                    popover: {
                        title: "Industria",
                        description:
                            "Indicá el sector al que pertenece la empresa. Ej: tecnología, salud, educación, finanzas.",
                    },
                },
                {
                    element: "#field-roles",
                    popover: {
                        title: "Rol del equipo",
                        description:
                            "Indicá el área real del negocio. Ej: administración, ventas, operaciones, tecnología. Esto es CLAVE para orientar bien.",
                    },
                },
                {
                    element: "#field-necesidad",
                    popover: {
                        title: "Necesidad del equipo",
                        description:
                            "Explicá QUÉ quieren mejorar. Ej: ordenar información, automatizar tareas, reducir errores, trabajar más rápido.",
                    },
                },
                {
                    element: "#field-nivel",
                    popover: {
                        title: "Nivel del equipo",
                        description:
                            "¿El equipo es mayormente junior, senior o mixto? Esto nos ayuda a recomendar cursos adecuados.",
                    },
                },
                {
                    element: "#field-urgencia",
                    popover: {
                        title: "Urgencia de la capacitación",
                        description:
                            "¿Necesitan capacitarse rápido o tienen más tiempo para planificar? Así adaptamos las recomendaciones.",
                    },
                },
                {
                    element: "#field-modalidad",
                    popover: {
                        title: "Modalidad de aprendizaje",
                        description:
                            "¿Prefieren cursos más teóricos, prácticos o mixtos? Así adaptamos las recomendaciones.",
                    },
                },
                {
                    element: "#submit-btn",
                    popover: {
                        title: "Listo para orientar",
                        description:
                            "Con esta información, la recomendación será mucho más precisa y útil.",
                    },
                },
            ]
            : [
                {
                    element: "#field-experiencia",
                    popover: {
                        title: "Tu experiencia",
                        description:
                            "Contanos brevemente desde dónde partís. Ej: sin experiencia, administrativo, developer, líder.",
                    },
                },
                {
                    element: "#field-intereses",
                    popover: {
                        title: "Tus intereses",
                        description:
                            "¿Qué cosas te interesan? Ej: programar, diseñar, analizar datos, marketing digital, emprender.",
                    },
                },
                {
                    element: "#field-objetivos",
                    popover: {
                        title: "Tu objetivo",
                        description:
                            "¿Para qué querés aprender? Ej: crecer en el trabajo, cambiar de rol, automatizar tareas, conseguir empleo.",
                    },
                },
                {
                    element: "#field-tiempo",
                    popover: {
                        title: "Tiempo disponible",
                        description:
                            "¿Cuánto tiempo tenés para dedicarle al aprendizaje? Ej: menos de 5 horas semanales, 5-10 horas, más de 10 horas.",
                    },
                },
                {
                    element: "#submit-btn",
                    popover: {
                        title: "Listo para orientar",
                        description:
                            "Con esto podemos recomendarte por dónde empezar sin perder tiempo.",
                    },
                },
            ];

    const drv = driver({
        showProgress: true,
        steps,
        onDestroyed: () => {
            localStorage.setItem(`orientationTourSeen-${mode}`, "true");
        },
    });

    drv.drive();
}
