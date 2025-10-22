import { useState, useEffect } from "react";

interface CourseProgress {
  [courseId: string]: {
    [moduleId: string]: boolean;
  };
}

export const useCourseProgress = () => {
  const [progress, setProgress] = useState<CourseProgress>({});

  // Load progress from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("courseProgress");
    if (stored) {
      try {
        setProgress(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse course progress", e);
      }
    }
  }, []);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("courseProgress", JSON.stringify(progress));
  }, [progress]);

  const markModuleComplete = (courseId: string, moduleId: string) => {
    setProgress(prev => ({
      ...prev,
      [courseId]: {
        ...prev[courseId],
        [moduleId]: true
      }
    }));
  };

  const isModuleComplete = (courseId: string, moduleId: string) => {
    return progress[courseId]?.[moduleId] || false;
  };

  const getCourseProgress = (courseId: string, totalModules: number) => {
    const courseData = progress[courseId] || {};
    const completedCount = Object.values(courseData).filter(Boolean).length;
    return {
      completed: completedCount,
      total: totalModules,
      percentage: totalModules > 0 ? (completedCount / totalModules) * 100 : 0
    };
  };

  return {
    markModuleComplete,
    isModuleComplete,
    getCourseProgress
  };
};
