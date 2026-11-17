// L'Agenda du 20 au 22 novembre 2026. Facts checked 2026-11-17 (sources in strategie/journal.md once posted).
import type { AgendaReel } from "../types";

const a = (f: string) => `art/agenda/${f}`;

export const agenda1120: AgendaReel = {
  id: "Agenda1120",
  voice: "Agenda1120",
  display: { "trois cents": "300", dix: "10", "soixante-dix-huit": "78" },
  segments: {
    hook: { images: [{ src: a("orsay.jpg"), pos: "30% center" }, { src: a("moreau-escalier.jpg"), at: "Bouge" }, { src: a("egouts.jpg"), pos: "64% center", at: "tri" }] },
    weekly: { images: [{ src: a("louvre-baldus.jpg") }, { src: a("104.jpg"), at: "celles" }] },
    louvre: {
      images: [{ src: a("louvre-pyramide.jpg") }, { src: a("louvre-baldus.jpg"), at: "Plus" }, { src: a("louvre-pyramide.jpg"), pos: "center 80%", at: "toutes" }],
      label: { title: "1/6 · Louvre Photo", info: "Louvre · jusqu'au 3 mai" },
    },
    orsay: {
      images: [{ src: a("degas-cassatt.jpg"), pos: "center 30%" }, { src: a("cassatt-jardin.jpg"), at: "seule" }],
      label: { title: "2/6 · Mary Cassatt", info: "Orsay · 16 € · jusqu'au 31 janv." },
    },
    fayet: {
      images: [{ src: a("flv.jpg"), pos: "30% center" }, { src: a("fayet.jpg"), pos: "center 20%", at: "Gustave" }, { src: a("vangogh.jpg"), at: "dix" }, { src: a("gauguin.jpg"), pos: "65% center", at: "soixante" }],
      label: { title: "3/6 · Gustave Fayet", info: "Fondation Louis Vuitton · jusqu'au 8 mars" },
    },
    moreau: {
      images: [{ src: a("moreau-escalier.jpg") }, { src: a("moreau-jupiter.jpg"), pos: "center 30%", at: "expose" }],
      label: { title: "4/6 · Ali Banisadr", info: "Musée Gustave Moreau · jusqu'au 7 déc." },
    },
    c104: { images: [{ src: a("104.jpg") }], label: { title: "5/6 · Walid Raad", info: "Le 104 · gratuit · finit dimanche" } },
    egouts: {
      images: [{ src: a("egouts.jpg"), pos: "64% center" }, { src: a("carbure.jpg"), pos: "center 40%", at: "lampe" }],
      label: { title: "6/6 · Les égouts la nuit", info: "Musée des égouts · le soir dès le 20 nov." },
    },
    cta: { images: [{ src: a("egouts.jpg"), pos: "64% center" }], phone: true },
  },
  explore: [
    { title: "Louvre Photo", place: "Musée du Louvre, 75001 Paris", until: "Jusqu’au 3 mai", status: "Ouvert jusqu’à 18 h", img: a("louvre-pyramide.jpg"), likes: "3,4 k" },
    { title: "Mary Cassatt", place: "Musée d’Orsay, 75007 Paris", until: "Jusqu’au 31 janvier", status: "Ouvert jusqu’à 18 h", img: a("cassatt-jardin.jpg"), pos: "center 30%", likes: "2,8 k" },
    { title: "Gustave Fayet", place: "Fondation Louis Vuitton, 75116 Paris", until: "Jusqu’au 8 mars", status: "Ouvert jusqu’à 20 h", img: a("gauguin.jpg"), pos: "65% center", likes: "2,1 k" },
    { title: "Ali Banisadr", place: "Musée Gustave Moreau, 75009 Paris", until: "Jusqu’au 7 décembre", status: "Ouvert jusqu’à 18 h", img: a("moreau-escalier.jpg"), pos: "center 60%", likes: "640" },
    { title: "Walid Raad", place: "Le 104, 75019 Paris", until: "Jusqu’au 22 novembre", status: "Ouvert jusqu’à 19 h", img: a("104.jpg"), likes: "410" },
    { title: "Les égouts la nuit", place: "Musée des égouts, 75007 Paris", until: "Le soir, dès le 20 novembre", status: "Ouvert jusqu’à 20 h", img: a("egouts.jpg"), likes: "1,2 k" },
  ],
  credits: [
    "Musée des égouts : Wikimedia Commons, CC BY-SA 4.0",
    "Pyramide inversée du Louvre : Wikimedia Commons, CC BY-SA 4.0",
    "Horloge du musée d'Orsay : Wikimedia Commons, CC BY-SA 4.0",
    "Portrait de Gustave Fayet : Wikimedia Commons, CC BY-SA 4.0",
    "Fondation Louis Vuitton : Wikimedia Commons, CC BY 3.0",
    "Escalier du musée Gustave Moreau : Jean-Yves Lacôte, CC BY-SA 4.0",
    "Le 104 : Wikimedia Commons, CC BY 2.0",
    "Lampe à carbure : Wikimedia Commons, CC BY-SA 4.0",
  ],
};
