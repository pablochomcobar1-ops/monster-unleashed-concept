import { flavors, type FlavorId } from "./flavors";

type Scores = Partial<Record<FlavorId, number>>;

export type PickerOption = { label: string; scores: Scores };
export type PickerQuestion = { id: string; question: string; options: [PickerOption, PickerOption, PickerOption] };

/** "Pick your beast": 3 questions, 3 options each. */
export const pickerQuestions: readonly [PickerQuestion, PickerQuestion, PickerQuestion] = [
  {
    id: "when",
    question: "WHEN DO YOU RIDE?",
    options: [
      { label: "2 AM. LIGHTS OFF.", scores: { original: 1, "ultra-white": 2 } },
      { label: "SUNRISE. FIRST WAVE.", scores: { "ultra-paradise": 2, "pipeline-punch": 1 } },
      { label: "MIDDAY. FULL SEND.", scores: { "mango-loco": 2, "pipeline-punch": 1 } },
    ],
  },
  {
    id: "sugar",
    question: "SUGAR?",
    options: [
      { label: "FULL LOAD.", scores: { original: 1, "mango-loco": 1, "pipeline-punch": 1 } },
      { label: "ZERO. KEEP IT CLEAN.", scores: { "ultra-white": 2, "ultra-paradise": 2 } },
      { label: "DON'T CARE. JUST GO.", scores: { "mango-loco": 1, "pipeline-punch": 1 } },
    ],
  },
  {
    id: "world",
    question: "PICK YOUR WORLD.",
    options: [
      { label: "DIRT & ENGINES", scores: { original: 2 } },
      { label: "WAVES & SKATEPARKS", scores: { "pipeline-punch": 2, "ultra-paradise": 1 } },
      { label: "SCREENS & STAGES", scores: { "ultra-white": 2, "mango-loco": 1 } },
    ],
  },
] as const;

export type PickerAnswers = [number, number, number];

/**
 * Adds up the points of the chosen options. Highest total wins;
 * ties go to the flavour that comes first in the lineup.
 */
export function pickFlavor(answers: PickerAnswers): FlavorId {
  const totals = new Map<FlavorId, number>(flavors.map((f) => [f.id, 0]));

  answers.forEach((choice, q) => {
    const option = pickerQuestions[q].options[choice];
    if (!option) throw new Error(`Invalid answer ${choice} for question ${q + 1}`);
    for (const [id, points] of Object.entries(option.scores) as [FlavorId, number][]) {
      totals.set(id, (totals.get(id) ?? 0) + points);
    }
  });

  let best: FlavorId = flavors[0].id;
  for (const f of flavors) {
    if ((totals.get(f.id) ?? 0) > (totals.get(best) ?? 0)) best = f.id;
  }
  return best;
}
