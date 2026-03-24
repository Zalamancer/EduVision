export interface Episode {
  id: string;
  chapter: number;
  episode: number;
  title: string;
  description: string;
  durationSeconds: number;
  videoUrl?: string;
  topics: string[];
}

export const EPISODES: Episode[] = [
  {
    id: "ch1-ep1",
    chapter: 1,
    episode: 1,
    title: "What is Digital Logic?",
    description: "Introduction to binary systems, why computers use 0s and 1s, and the concept of a logic level (HIGH/LOW).",
    durationSeconds: 480,
    topics: ["Binary", "HIGH/LOW", "Digital vs Analog"],
  },
  {
    id: "ch1-ep2",
    chapter: 1,
    episode: 2,
    title: "The AND Gate",
    description: "Deep dive into the AND gate: truth table, Boolean expression (A·B), real-world analogy (two switches in series), and circuit symbol.",
    durationSeconds: 540,
    topics: ["AND gate", "Truth table", "Boolean algebra"],
  },
  {
    id: "ch1-ep3",
    chapter: 1,
    episode: 3,
    title: "The OR Gate",
    description: "The OR gate: output is HIGH if ANY input is HIGH. Truth table, Boolean notation (A+B), and parallel switch analogy.",
    durationSeconds: 510,
    topics: ["OR gate", "Truth table"],
  },
  {
    id: "ch1-ep4",
    chapter: 1,
    episode: 4,
    title: "The NOT Gate (Inverter)",
    description: "Inversion: how a NOT gate flips a signal. Used everywhere in digital design. Boolean notation: Ā.",
    durationSeconds: 360,
    topics: ["NOT gate", "Inversion", "Complement"],
  },
  {
    id: "ch1-ep5",
    chapter: 1,
    episode: 5,
    title: "NAND and NOR Gates",
    description: "NAND = NOT AND. NOR = NOT OR. Why NAND is called the universal gate and how any logic function can be built from NANDs alone.",
    durationSeconds: 600,
    topics: ["NAND", "NOR", "Universal gates"],
  },
  {
    id: "ch1-ep6",
    chapter: 1,
    episode: 6,
    title: "XOR and XNOR Gates",
    description: "Exclusive OR: output HIGH only when inputs differ. Used in adders and comparators. XNOR is its complement.",
    durationSeconds: 480,
    topics: ["XOR", "XNOR", "Exclusive OR"],
  },
  {
    id: "ch1-ep7",
    chapter: 1,
    episode: 7,
    title: "Combining Gates: The Half Adder",
    description: "Building your first useful circuit: a 1-bit adder using XOR (sum bit) and AND (carry bit). Truth table walkthrough.",
    durationSeconds: 720,
    topics: ["Half adder", "Sum", "Carry", "Circuit composition"],
  },
  {
    id: "ch1-ep8",
    chapter: 1,
    episode: 8,
    title: "The Full Adder",
    description: "Extending the half adder to handle a carry-in. How two half adders combine to form a full adder. Introduction to multi-bit addition.",
    durationSeconds: 780,
    topics: ["Full adder", "Carry-in", "Carry-out", "Ripple carry"],
  },
];

export function getEpisode(id: string): Episode | undefined {
  return EPISODES.find((e) => e.id === id);
}

export function getAdjacentEpisodes(id: string): { prev?: Episode; next?: Episode } {
  const idx = EPISODES.findIndex((e) => e.id === id);
  return {
    prev: idx > 0 ? EPISODES[idx - 1] : undefined,
    next: idx < EPISODES.length - 1 ? EPISODES[idx + 1] : undefined,
  };
}
