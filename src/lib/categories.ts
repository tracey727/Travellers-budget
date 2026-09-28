/** Icon keys resolve to an emoji glyph in <CategoryIcon> — never a cartoon icon set. */
export const CATEGORY_ICONS: Record<string, string> = {
  flights: "✈️",
  accommodation: "🏨",
  food: "🍽️",
  transport: "🚕",
  activities: "🎟️",
  shopping: "🛍️",
  insurance: "🛡️",
  visas: "🛂",
  wallet: "💳",
};

export const DEFAULT_CATEGORY_TEMPLATE: { name: string; icon: string }[] = [
  { name: "Flights", icon: "flights" },
  { name: "Accommodation", icon: "accommodation" },
  { name: "Food & Drink", icon: "food" },
  { name: "Transport", icon: "transport" },
  { name: "Activities", icon: "activities" },
  { name: "Shopping", icon: "shopping" },
  { name: "Insurance & Visas", icon: "insurance" },
  { name: "Miscellaneous", icon: "wallet" },
];

export const PAYMENT_METHODS = [
  { value: "card", label: "Card" },
  { value: "cash", label: "Cash" },
  { value: "bank_transfer", label: "Bank transfer" },
  { value: "digital_wallet", label: "Digital wallet" },
  { value: "other", label: "Other" },
];
