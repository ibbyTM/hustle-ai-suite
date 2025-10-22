import { Course } from "@/types/course";
import { Check, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";

interface LearningSidebarProps {
  course: Course;
  currentModuleId: string;
  completedModules: Set<string>;
  onModuleSelect: (moduleId: string) => void;
  courseProgress: number;
}

export const LearningSidebar = ({
  course,
  currentModuleId,
  completedModules,
  onModuleSelect,
  courseProgress
}: LearningSidebarProps) => {
  return (
    <div className="w-full lg:w-80 border-r border-border bg-card/50 flex flex-col">
      {/* Course Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl">{course.emoji}</span>
          <div className="flex-1">
            <h3 className="font-bold text-lg line-clamp-2">{course.title}</h3>
            <p className="text-xs text-muted-foreground">{course.difficulty}</p>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{Math.round(courseProgress)}%</span>
          </div>
          <Progress value={courseProgress} className="h-2" />
        </div>
      </div>

      {/* Module List */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {course.modules.map((module, index) => {
            const isComplete = completedModules.has(module.id);
            const isActive = module.id === currentModuleId;

            return (
              <Button
                key={module.id}
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start h-auto py-3 px-3 text-left ${
                  isActive ? "bg-primary" : ""
                }`}
                onClick={() => onModuleSelect(module.id)}
              >
                <div className="flex items-start gap-3 w-full">
                  <div className="flex-shrink-0 mt-0.5">
                    {isComplete ? (
                      <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    ) : (
                      <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/50 flex items-center justify-center">
                        <span className="text-xs">{index + 1}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium line-clamp-2">{module.title}</p>
                    {module.duration && (
                      <p className="text-xs text-muted-foreground mt-1">{module.duration}</p>
                    )}
                  </div>
                  {isActive && <ChevronRight className="h-4 w-4 flex-shrink-0" />}
                </div>
              </Button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};
