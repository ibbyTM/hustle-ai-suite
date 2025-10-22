import { Progress } from "@/components/ui/progress";
import { Course } from "@/types/course";

interface CourseProgressBarProps {
  course: Course;
  completedModules: number;
  totalModules: number;
}

export const CourseProgressBar = ({ course, completedModules, totalModules }: CourseProgressBarProps) => {
  const percentage = totalModules > 0 ? (completedModules / totalModules) * 100 : 0;

  return (
    <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{course.emoji}</span>
            <h2 className="text-xl sm:text-2xl font-bold">{course.title}</h2>
          </div>
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            {completedModules}/{totalModules} completed
          </span>
        </div>
        <Progress value={percentage} className="h-2" />
      </div>
    </div>
  );
};
