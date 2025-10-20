import { Course } from "@/types/course";

export const courses: Course[] = [
  {
    id: "placeholder-course-1",
    title: "Coming Soon: Your First Money-Making Course",
    emoji: "🚀",
    shortDescription: "Learn how to leverage Hustle Lab tools to generate income online.",
    fullDescription: "This is a placeholder course. Real courses will be added soon with step-by-step guides on making money with Hustle Lab.",
    difficulty: "Beginner",
    estimatedTime: "30 minutes",
    toolsUsed: [],
    prerequisites: ["Hustle Lab account", "Basic understanding of content creation"],
    expectedOutcomes: [
      "Understand the basics of making money online",
      "Know which Hustle Lab tools to use for your niche",
      "Have a clear action plan to start generating income"
    ],
    modules: [
      {
        id: "module-1",
        title: "Getting Started",
        content: "This module will cover the fundamentals of using Hustle Lab for income generation.",
        duration: "10 minutes"
      },
      {
        id: "module-2",
        title: "Tool Selection",
        content: "Learn which tools are best for your specific income goals.",
        duration: "10 minutes"
      },
      {
        id: "module-3",
        title: "Implementation",
        content: "Step-by-step guide to implementing your first money-making strategy.",
        duration: "10 minutes"
      }
    ],
    proTips: [
      "Start with one strategy and master it before moving to others",
      "Consistency is key to seeing results",
      "Use multiple Hustle Lab tools in combination for best results"
    ]
  }
];
