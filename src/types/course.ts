export interface CourseModule {
  id: string;
  title: string;
  content: string;
  toolsUsed?: string[];
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
}
