export interface AgentTrigger {
  agentId: string; // matches tool.id from automations
  buttonText: string;
  context?: Record<string, any>;
  description?: string;
}

export interface CourseModule {
  id: string;
  title: string;
  content: string;
  videoUrl?: string;
  videoProvider?: "youtube" | "vimeo" | "custom";
  toolsUsed?: string[];
  agentTriggers?: AgentTrigger[];
  duration?: string;
}

export interface Course {
  id: string;
  title: string;
  emoji: string;
  shortDescription: string;
  fullDescription: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  estimatedTime: string;
  toolsUsed: string[];
  modules: CourseModule[];
  prerequisites?: string[];
  expectedOutcomes: string[];
  proTips?: string[];
  tierRequired?: "free" | "pro" | "partner";
}
