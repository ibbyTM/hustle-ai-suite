export interface KnowledgeBase {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  tags: string[] | null;
  brand_voice: BrandVoice;
  products: Product[];
  audience: Audience;
  offers: Offer[];
  faqs: FAQ[];
  created_at: string;
  updated_at: string;
}

export interface BrandVoice {
  tone?: string;
  style?: string;
  dos?: string[];
  donts?: string[];
}

export interface Product {
  name: string;
  features?: string[];
  benefits?: string[];
  proof?: string;
  pricing?: string;
  guarantees?: string;
}

export interface Audience {
  icp?: string;
  pains?: string[];
  desires?: string[];
  objections?: string[];
}

export interface Offer {
  title: string;
  description: string;
  bonuses?: string[];
  urgency?: string;
  riskReversal?: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface ToolAttachment {
  id: string;
  user_id: string;
  knowledge_base_id: string;
  tool_id: string;
  created_at: string;
}
