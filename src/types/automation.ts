export type CategoryType = "Content" | "Ads" | "Hustle" | "Brand" | "Store" | "Productivity";

export type TierType = "Free" | "Pro" | "Partner";

export type KBRequirement = "required" | "recommended" | "optional" | "none";

export interface AutomationTool {
  id: string;
  title: string;
  emoji: string;
  category: CategoryType;
  description: string;
  isPro: boolean;
  kbRequirement: KBRequirement;
  inputs: InputField[];
  promptTemplate: string;
}

export interface InputField {
  id: string;
  label: string;
  type: "text" | "select" | "textarea" | "number" | "toggle" | "multiselect" | "date" | "url" | "file";
  placeholder?: string;
  options?: string[];
  defaultValue?: string | number | boolean;
  required?: boolean;
  min?: number;
  max?: number;
}

export interface SavedHustle {
  id: string;
  toolId: string;
  toolTitle: string;
  output: string;
  createdAt: Date;
}
