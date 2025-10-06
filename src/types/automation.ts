export type CategoryType = "Content" | "Ads" | "Hustle" | "Brand" | "Store" | "Productivity";

export type TierType = "Free" | "Pro" | "Partner";

export interface AutomationTool {
  id: string;
  title: string;
  emoji: string;
  category: CategoryType;
  description: string;
  isPro: boolean;
  inputs: InputField[];
  promptTemplate: string;
}

export interface InputField {
  id: string;
  label: string;
  type: "text" | "select" | "textarea";
  placeholder?: string;
  options?: string[];
}

export interface SavedHustle {
  id: string;
  toolId: string;
  toolTitle: string;
  output: string;
  createdAt: Date;
}
