export type QuestionType = "single" | "multi" | "text";

export interface Option {
  value: string;
  label: string;
}

export interface Question {
  id: number; // 1–15, matches the database column q1..q15
  type: QuestionType;
  title: string;
  helper?: string;
  options: Option[];
  optional?: boolean;
  maxLength?: number;
  /** For "multi" questions: choosing this option clears every other choice */
  exclusiveOption?: string;
}

const opt = (...values: string[]): Option[] => values.map((value) => ({ value, label: value }));

export const QUESTIONS: Question[] = [
  {
    id: 1,
    type: "single",
    title: "Have you heard about Ayurveda?",
    helper: "There are no right or wrong answers — we only want your honest view.",
    options: opt("Yes", "No", "A little"),
  },
  {
    id: 2,
    type: "single",
    title: "How familiar are you with Ayurvedic practices?",
    options: opt("Very familiar", "Somewhat familiar", "Not very familiar", "Not familiar at all"),
  },
  {
    id: 3,
    type: "single",
    title: "Have you ever used Ayurvedic products or remedies?",
    helper: "Chyawanprash, herbal teas, ayurvedic skincare — anything counts.",
    options: opt("Frequently", "Occasionally", "Once or twice", "Never"),
  },
  {
    id: 4,
    type: "single",
    title: "What do you think is the main purpose of Ayurveda?",
    options: opt(
      "Preventing diseases and maintaining health",
      "Treating health problems",
      "Improving overall wellness",
      "All of the above",
      "Not sure",
    ),
  },
  {
    id: 5,
    type: "single",
    title: "Do you think Ayurveda is relevant in modern times?",
    options: opt("Yes", "No", "Maybe"),
  },
  {
    id: 6,
    type: "multi",
    title: "Which Ayurvedic practices are you familiar with?",
    helper: "Select all that apply.",
    options: opt("Yoga", "Meditation", "Ayurvedic diet", "Herbal remedies", "Panchakarma", "None of these"),
    exclusiveOption: "None of these",
  },
  {
    id: 7,
    type: "single",
    title: "Do you believe Ayurveda can help improve overall wellness?",
    options: opt("Strongly agree", "Agree", "Neutral", "Disagree", "Strongly disagree"),
  },
  {
    id: 8,
    type: "single",
    title: "How often do you prefer natural or herbal products?",
    options: opt("Very often", "Sometimes", "Rarely", "Never"),
  },
  {
    id: 9,
    type: "single",
    title: "What is your main source of information about Ayurveda?",
    options: opt(
      "Family and relatives",
      "Social media",
      "Internet and websites",
      "Books and educational institutions",
      "Doctors or healthcare professionals",
    ),
  },
  {
    id: 10,
    type: "single",
    title: "Do you think Ayurveda and modern medicine can complement each other?",
    options: opt("Yes", "No", "Maybe", "Not sure"),
  },
  {
    id: 11,
    type: "single",
    title: "What is the biggest challenge Ayurveda faces among today's youth?",
    options: opt(
      "Lack of awareness",
      "Lack of scientific understanding",
      "Preference for modern medicine",
      "Misleading information",
      "Lack of accessibility",
    ),
  },
  {
    id: 12,
    type: "single",
    title: "Would you consider including Ayurvedic wellness practices in your daily routine?",
    options: opt("Definitely", "Maybe", "Not interested", "Already following them"),
  },
  {
    id: 13,
    type: "single",
    title: "Do you think Ayurveda should be introduced more in educational institutions?",
    options: opt("Yes", "No", "Maybe"),
  },
  {
    id: 14,
    type: "single",
    title: "What is your biggest concern regarding Ayurvedic products or treatments?",
    options: opt(
      "Lack of scientific evidence for some claims",
      "Quality and authenticity",
      "Safety and possible side effects",
      "Lack of proper guidance",
      "No major concerns",
    ),
  },
  {
    id: 15,
    type: "text",
    title: "In your opinion, what can be done to make Ayurveda more popular among today's generation?",
    helper: "Optional — a sentence or two is more than enough.",
    options: [],
    optional: true,
    maxLength: 300,
  },
];

export const TOTAL_QUESTIONS = QUESTIONS.length;
