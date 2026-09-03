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

// Fotos da linha do tempo com todas as fotos na ordem solicitada (Ester Media antes de Ester com Violino)
export const MEMORY_PHOTOS = [
  {
    year: "1",
    title: "Primeiros Sorrisos",
    subtitle: "Primeiros sorrisos e muita fofura",
    tag: "Infância",
    image: "assets/ester pequena.jpg"
  },
  {
    year: "2",
    title: "Momentos Inesquecíveis",
    subtitle: "Crescendo em graciosidade e encanto",
    tag: "Ester",
    image: "assets/ester media.jpg"
  },
  {
    year: "3",
    title: "Ester com Violino",
    subtitle: "Talento, melodia e paixão pela música",
    tag: "Música & Harmonia",
    image: "assets/ester com violino.jpg"
  },
  {
    year: "4",
    title: "15 Anos Inesquecíveis",
    subtitle: "O sonho radiante da debutante",
    tag: "15 Anos",
    image: "assets/ester 15anos.jpg"
  }
];
