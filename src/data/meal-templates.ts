export type MealTemplate = {
  id: string;
  name: string;
  description: string;
  cuisine: string;
  items: { name: string; calories: number; protein: number; carbs: number; fat: number; portion: string }[];
};

export const MEAL_TEMPLATES: MealTemplate[] = [
  {
    id: "t-chicken-rice",
    name: "Hainanese Chicken Rice set",
    description: "Rice + chicken + cucumber + soup",
    cuisine: "singaporean",
    items: [
      { name: "Chicken rice (with skin optional)", calories: 550, protein: 32, carbs: 55, fat: 18, portion: "1 plate" },
    ],
  },
  {
    id: "t-economic-rice",
    name: "Economic rice (3 dishes)",
    description: "Rice + 3 cai",
    cuisine: "singaporean",
    items: [
      { name: "White rice", calories: 200, protein: 4, carbs: 45, fat: 0, portion: "1 bowl" },
      { name: "Mixed cai (3 dishes avg)", calories: 450, protein: 21, carbs: 30, fat: 24, portion: "3 scoops" },
    ],
  },
  {
    id: "t-nasi-lemak",
    name: "Nasi Lemak set",
    description: "Coconut rice + sambal + egg + anchovies",
    cuisine: "malay",
    items: [
      { name: "Nasi Lemak", calories: 600, protein: 18, carbs: 70, fat: 26, portion: "1 plate" },
    ],
  },
  {
    id: "t-pho",
    name: "Pho Bo",
    description: "Beef noodle soup",
    cuisine: "vietnamese",
    items: [
      { name: "Pho Bo", calories: 450, protein: 28, carbs: 55, fat: 12, portion: "1 bowl" },
    ],
  },
  {
    id: "t-bibimbap",
    name: "Bibimbap",
    description: "Mixed rice bowl",
    cuisine: "korean",
    items: [
      { name: "Bibimbap", calories: 550, protein: 22, carbs: 70, fat: 18, portion: "1 bowl" },
    ],
  },
  {
    id: "t-butter-chicken-naan",
    name: "Butter chicken + naan",
    description: "Classic North Indian",
    cuisine: "indian",
    items: [
      { name: "Butter chicken", calories: 490, protein: 32, carbs: 12, fat: 34, portion: "1 serving" },
      { name: "Butter naan", calories: 280, protein: 8, carbs: 42, fat: 8, portion: "1 piece" },
    ],
  },
  {
    id: "t-ramen",
    name: "Tonkotsu ramen",
    description: "Rich pork bone broth",
    cuisine: "japanese",
    items: [
      { name: "Tonkotsu ramen", calories: 650, protein: 28, carbs: 70, fat: 28, portion: "1 bowl" },
    ],
  },
  {
    id: "t-mapo-rice",
    name: "Mapo tofu + rice",
    description: "Half bowl rice + mapo",
    cuisine: "chinese",
    items: [
      { name: "Mapo tofu", calories: 320, protein: 18, carbs: 12, fat: 22, portion: "1 bowl" },
      { name: "White rice", calories: 150, protein: 3, carbs: 34, fat: 0, portion: "半碗" },
    ],
  },
];

export const PORTION_PRESETS = [
  { label: "半碗", factor: 0.5 },
  { label: "1 碗", factor: 1 },
  { label: "大碗", factor: 1.4 },
  { label: "小份", factor: 0.7 },
  { label: "1 份", factor: 1 },
  { label: "大份", factor: 1.5 },
  { label: "分享", factor: 0.4 },
];
