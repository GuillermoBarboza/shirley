import { IExperience, IExperiencesIntro } from "./models/ExperiencesPage";

/**
 * What /experiencias showed when its copy was hardcoded in the storefront.
 * Served until the admin saves the page for the first time, so a fresh
 * environment looks the same as before the CMS existed. Quotes are stored
 * without «» — the storefront adds them.
 */
export const experiencesDefaults: {
    intro: IExperiencesIntro;
    experiences: IExperience[];
} = {
    intro: {
        eyebrow: "Además de la pintura",
        title: "Experiencias",
        lede: "Dos maneras de conocer a Shirley más allá del lienzo: un ritual sensorial con mate, y recorridos a pie por las historias y murales escondidos de Montevideo.",
    },
    experiences: [
        {
            kicker: "Experiencia sensorial",
            title: "Ritual del Mate",
            quote: "El mate no es una bebida, es una forma de estar en el mundo.",
            place: "Ciudad Vieja, Montevideo",
            description: "",
            steps: [
                "1. Origen y memoria del mate",
                "2. Clasificación de yerbas",
                "3. Leyenda y símbolo",
                "4. El ritual",
                "5. Momento de creación",
                "6. Cierre compartido",
            ],
            note: "Incluye degustación de distintas yerbas, bizcochos y uso de mates seleccionados.",
            accent: "olive",
            visible: true,
        },
        {
            kicker: "Recorrido guiado",
            title: "Recorridos Murales",
            quote: "Amo mi ciudad y puedo mostrarla en todo su esplendor — sobre todo sus historias y los murales escondidos en los barrios.",
            place: "A pie, por los barrios de Montevideo",
            description:
                "Un paseo caminando entre relatos de barrio, arquitectura y murales, con paradas para fotos y un cierre compartiendo unos mates.",
            steps: [],
            note: "",
            accent: "gold",
            visible: true,
        },
    ],
};
