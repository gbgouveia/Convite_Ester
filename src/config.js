// Configurações Globais do Convite de 15 Anos - Ester Ferreira Paixão de Sousa

export const MAPS_URL = "https://maps.google.com/?q=Casa+Bari+EQNL+21/23+Bloco+D+Taguatinga+DF";

// Endpoint de RSVP Seguro
export const RSVP_API_URL = import.meta.env.VITE_RSVP_API_URL || "https://wa.me/5561986813857?text=Ol%C3%A1!%20Confirmo%20minha%20presen%C3%A7a%20na%20festa%20surpresa%20de%2015%20anos%20da%20Ester!";

export const EVENT_DATA = {
  name: "Ester Ferreira Paixão de Sousa",
  shortName: "Ester",
  age: 15,
  date: "11 de Setembro de 2026",
  dayOfWeek: "Sexta-feira",
  time: "19:15h",
  location: "Casa Bari (QNL)",
  address: "EQNL 21/23 Bloco D, Taguatinga Norte - DF",
  dressCode: "Esporte Fino / Gala (Tons de Azul e Prata)",
  surpriseAlert: "🤫 SHHH! É FESTA SURPRESA! Guarde segredo, a Ester não pode saber de nada!"
};

// Fotos da linha do tempo com legendas baseadas nos nomes das imagens enviadas
export const MEMORY_PHOTOS = [
  {
    year: "2012",
    title: "Ester Pequena",
    subtitle: "Primeiros sorrisos e muita fofura",
    tag: "Ester Pequena",
    image: "/assets/photo_bebe.jpg"
  },
  {
    year: "2016",
    title: "Ester com Violino",
    subtitle: "Talento, melodia e paixão pela música",
    tag: "Ester com Violino",
    image: "/assets/photo_infancia.jpg"
  },
  {
    year: "2021",
    title: "Ester Média",
    subtitle: "Crescendo em graciosidade e encanto",
    tag: "Ester Média",
    image: "/assets/photo_adolescencia.jpg"
  },
  {
    year: "2026",
    title: "Ester 15 Anos",
    subtitle: "O sonho inesquecível da debutante",
    tag: "Ester 15 Anos",
    image: "/assets/photo_15anos.jpg"
  }
];
