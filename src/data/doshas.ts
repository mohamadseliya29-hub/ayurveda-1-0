export interface Dosha {
  key: "vata" | "pitta" | "kapha";
  name: string;
  sanskrit: string;
  title: string;
  description: string;
  traits: string[];
  elements: string;
}

export const DOSHAS: Dosha[] = [
  {
    key: "vata",
    name: "Vata",
    sanskrit: "वात",
    title: "Movement & Energy",
    description:
      "The energy of motion — governing breath, circulation, creativity and the quickness of thought. Like the wind, Vata is light, agile and ever-moving.",
    traits: ["Creative", "Energetic", "Quick-thinking"],
    elements: "Air · Ether",
  },
  {
    key: "pitta",
    name: "Pitta",
    sanskrit: "पित्त",
    title: "Transformation & Metabolism",
    description:
      "The energy of transformation — governing digestion, intellect, focus and drive. Like fire, Pitta converts everything it touches into fuel and insight.",
    traits: ["Focused", "Sharp", "Determined"],
    elements: "Fire · Water",
  },
  {
    key: "kapha",
    name: "Kapha",
    sanskrit: "कफ",
    title: "Structure & Stability",
    description:
      "The energy of cohesion — governing strength, immunity, patience and endurance. Like the earth, Kapha grounds, nourishes and holds everything together.",
    traits: ["Calm", "Loyal", "Steady"],
    elements: "Earth · Water",
  },
];
