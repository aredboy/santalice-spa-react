// ============================================================
// siteConfig.js — Configuración central del sitio
// ============================================================
// Para adaptar este proyecto a otro cliente, solo editá este archivo
// y el CSS de variables (theme.css). Nada más.
// ============================================================

const siteConfig = {

  // --- Identidad del negocio ---
  businessName: "Sant'Alice",
  ownerName: "Alicia Della Siega",
  slogan: "Donde cada bocado cuenta una historia de tradición y sabor artesanal.",

  // --- Contacto ---
  whatsapp: {
    number: "5491161377819",        // sin '+', sin espacios
    displayNumber: "(+54) 11-6137-7819",
  },
  email: "santalicedya@gmail.com",
  instagram: {
    url: "https://www.instagram.com/santalicedya/",
    handle: "santalicedya",
  },

  // --- Imágenes principales ---
  images: {
    logo: "/assets/logo.png",            // navbar
    logoGroup: "/assets/logo group.png",  // footer
    ownerPortrait: "/images/ali.webp",    // about page
    placeholder: "/images/placeholder.png",
  },

  // --- Categorías con nombres legibles ---
  // Clave = lo que viene de la DB (lowercase), Valor = cómo se muestra
  categoryLabels: {
    masdulces: "Más Dulces",
    // Agregá acá las que necesites: 
    // tortas: "Tortas",
    // salado: "Salado",
  },

  // --- Textos reutilizables ---
  texts: {
    heroTitle: "¡Bienvenido Sant'Alice!",
    heroSubtitle: "Donde cada bocado cuenta una historia de tradición y sabor artesanal.",
    heroScrollHint: "Desliza hacia abajo",
    productsTitle: "Nuestros productos",
    copyright: (year) => `© ${year} Sant'Alice. Todos los derechos reservados.`,
  },

  // --- Eventos disponibles para el modal de agendamiento ---
  eventTypes: [
    "Cena Familiar",
    "Cumpleaños",
    "Evento Corporativo",
    "Otro",
  ],
};

export default siteConfig;
