export type Role = "CITIZEN" | "ADMIN";
export type UserStatus = "ACTIVE" | "BLOCKED";

export type WasteCategory =
  | "PLASTIC"
  | "PAPER"
  | "CARDBOARD"
  | "GLASS"
  | "METAL"
  | "ORGANIC"
  | "E_WASTE"
  | "OTHER";

export type SubmissionStatus =
  | "PENDING"
  | "AI_ANALYZED"
  | "MANUAL_INSPECTION"
  | "APPROVED"
  | "REJECTED";

export type VerificationMethod = "NONE" | "MANUAL" | "AI_ASSISTED";

export type TransactionType =
  | "WASTE_REWARD"
  | "REWARD_REDEMPTION"
  | "ADMIN_ADJUSTMENT"
  | "CHALLENGE_BONUS";

export type RedemptionStatus =
  | "PENDING"
  | "REDEEMED"
  | "CANCELLED"
  | "EXPIRED";

export type SupportStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED";

export type NotificationType =
  | "SUBMISSION_APPROVED"
  | "SUBMISSION_REJECTED"
  | "COINS_CREDITED"
  | "REWARD_REDEEMED"
  | "REDEMPTION_CANCELLED"
  | "CHALLENGE_COMPLETED"
  | "BADGE_UNLOCKED"
  | "SYSTEM_ANNOUNCEMENT"
  | "GENERAL_ANNOUNCEMENT"
  | "IMPORTANT"
  | "ACCOUNT"
  | "ECOSORT_UPDATE"
  | "REWARD";

export interface SessionUser {
  id: string;
  citizenId?: string | null;
  name: string;
  email: string;
  role: Role;
  mobile?: string | null;
  avatarUrl?: string | null;
}

export interface WasteCategoryInfo {
  key: WasteCategory;
  name: string;
  defaultRate: number;
  coinRate?: number;
  color: string;
  icon: string;
  description: string;
  acceptedExamples: string[];
  examples?: string[];
  tips: string[];
}

export const WASTE_CATEGORIES: Record<WasteCategory, WasteCategoryInfo> = {
  PLASTIC: {
    key: "PLASTIC",
    name: "Plastic",
    defaultRate: 10,
    coinRate: 10,
    color: "#2563EB",
    icon: "Milk",
    description: "Bottles, containers, hard plastics, and cleaned packaging.",
    acceptedExamples: [
      "PET water bottles",
      "HDPE shampoo containers",
      "Cleaned food tubs",
      "Plastic caps",
    ],
    examples: [
      "PET water bottles",
      "HDPE shampoo containers",
      "Cleaned food tubs",
      "Plastic caps",
    ],
    tips: [
      "Rinse out any residual liquids or food",
      "Crush bottles to save bin space",
      "Remove labels when possible",
    ],
  },
  PAPER: {
    key: "PAPER",
    name: "Paper",
    defaultRate: 8,
    coinRate: 8,
    color: "#0284C7",
    icon: "FileText",
    description: "Office paper, newspapers, magazines, notebooks, and clean leaflets.",
    acceptedExamples: [
      "Exam papers & notebooks",
      "Newspapers",
      "Office printer paper",
      "Envelopes",
    ],
    examples: [
      "Exam papers & notebooks",
      "Newspapers",
      "Office printer paper",
      "Envelopes",
    ],
    tips: [
      "Keep dry and clean",
      "Remove metal spiral bindings or heavy staples",
      "Do not include grease-soaked paper",
    ],
  },
  CARDBOARD: {
    key: "CARDBOARD",
    name: "Cardboard",
    defaultRate: 8,
    coinRate: 8,
    color: "#D97706",
    icon: "Box",
    description: "Corrugated delivery cartons, cereal boxes, and packing cardboard.",
    acceptedExamples: [
      "Amazon / Flipkart shipping boxes",
      "Egg cartons (cardboard)",
      "Shoe boxes",
      "Cereal boxes",
    ],
    examples: [
      "Amazon / Flipkart shipping boxes",
      "Egg cartons (cardboard)",
      "Shoe boxes",
      "Cereal boxes",
    ],
    tips: [
      "Flatten all boxes completely",
      "Remove sticky tape and plastic bubble wraps",
      "Keep dry away from moisture",
    ],
  },
  GLASS: {
    key: "GLASS",
    name: "Glass",
    defaultRate: 6,
    coinRate: 6,
    color: "#059669",
    icon: "Wine",
    description: "Glass bottles, sauce jars, and clear glass containers.",
    acceptedExamples: [
      "Soda and beverage bottles",
      "Jam and pickle jars",
      "Perfume bottles",
      "Medicine vials (rinsed)",
    ],
    examples: [
      "Soda and beverage bottles",
      "Jam and pickle jars",
      "Perfume bottles",
      "Medicine vials (rinsed)",
    ],
    tips: [
      "Handle with care to prevent breakage",
      "Rinse thoroughly with tap water",
      "Separate metal or plastic caps",
    ],
  },
  METAL: {
    key: "METAL",
    name: "Metal",
    defaultRate: 12,
    coinRate: 12,
    color: "#64748B",
    icon: "Coins",
    description: "Aluminum beverage cans, tin food cans, foil trays, and metal lids.",
    acceptedExamples: [
      "Soft drink aluminum cans",
      "Food tin cans",
      "Clean aluminum foil",
      "Metal jar lids",
    ],
    examples: [
      "Soft drink aluminum cans",
      "Food tin cans",
      "Clean aluminum foil",
      "Metal jar lids",
    ],
    tips: [
      "Rinse food cans to avoid insects",
      "Crush aluminum cans if safe",
      "Ensure no sharp jagged edges exposed",
    ],
  },
  ORGANIC: {
    key: "ORGANIC",
    name: "Organic",
    defaultRate: 5,
    coinRate: 5,
    color: "#16A34A",
    icon: "Apple",
    description: "Fruit & vegetable peels, leftover food, tea leaves, and garden trimmings.",
    acceptedExamples: [
      "Vegetable & fruit peels",
      "Used tea bags / grounds",
      "Eggshells",
      "Fallen dry leaves",
    ],
    examples: [
      "Vegetable & fruit peels",
      "Used tea bags / grounds",
      "Eggshells",
      "Fallen dry leaves",
    ],
    tips: [
      "Drain liquid soup/water",
      "Do not mix with plastic wrappers or toothpicks",
      "Submit fresh within 24 hours",
    ],
  },
  E_WASTE: {
    key: "E_WASTE",
    name: "E-Waste",
    defaultRate: 15,
    coinRate: 15,
    color: "#9333EA",
    icon: "Cpu",
    description: "Old phones, broken chargers, circuit boards, batteries, and small appliances.",
    acceptedExamples: [
      "Mobile phones & chargers",
      "Headphones & USB cables",
      "Computer mice & keyboards",
      "Batteries (taped)",
    ],
    examples: [
      "Mobile phones & chargers",
      "Headphones & USB cables",
      "Computer mice & keyboards",
      "Batteries (taped)",
    ],
    tips: [
      "Store batteries safely with taped terminals",
      "Ensure no leaking chemical fluids",
      "Wipe personal data if possible",
    ],
  },
  OTHER: {
    key: "OTHER",
    name: "Other / Unsorted",
    defaultRate: 0,
    coinRate: 0,
    color: "#6B7280",
    icon: "AlertCircle",
    description: "Mixed trash, non-recyclables, or unidentifiable items (not eligible for Green Coins).",
    acceptedExamples: [
      "Greasy pizza boxes",
      "Medical masks & syringes",
      "Mixed composite materials",
      "Sanitary waste",
    ],
    examples: [
      "Greasy pizza boxes",
      "Medical masks & syringes",
      "Mixed composite materials",
      "Sanitary waste",
    ],
    tips: [
      "These items should go to municipal general waste",
      "EcoSort AI will reject non-segregated waste",
    ],
  },
};