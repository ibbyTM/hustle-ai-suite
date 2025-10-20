import { Course } from "@/types/course";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle2, Clock, Lightbulb, Target } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface CourseDetailViewProps {
  course: Course | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Helper function to render content with bold markdown
const renderContentWithBold = (content: string) => {
  const parts = content.split('**');
  return parts.map((part, index) => {
    // Every odd index is inside ** markers, so make it bold
    if (index % 2 === 1) {
      return <strong key={index}>{part}</strong>;
    }
    return <span key={index}>{part}</span>;
  });
};

export const CourseDetailView = ({ course, open, onOpenChange }: CourseDetailViewProps) => {
  if (!course) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh]">
        <DialogHeader>
          <div className="flex items-start gap-4">
            <span className="text-5xl">{course.emoji}</span>
            <div className="flex-1">
              <DialogTitle className="text-2xl mb-2">{course.title}</DialogTitle>
              <DialogDescription className="text-base">{course.fullDescription}</DialogDescription>
              <div className="flex items-center gap-3 mt-3">
                <Badge variant="outline">{course.difficulty}</Badge>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {course.estimatedTime}
                </div>
              </div>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6">
            {/* Prerequisites */}
            {course.prerequisites && course.prerequisites.length > 0 && (
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  Prerequisites
                </h3>
                <ul className="space-y-2 ml-7">
                  {course.prerequisites.map((prereq, index) => (
                    <li key={index} className="text-muted-foreground">• {prereq}</li>
                  ))}
                </ul>
              </div>
            )}

            <Separator />

            {/* Expected Outcomes */}
            <div>
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                What You'll Achieve
              </h3>
              <ul className="space-y-2 ml-7">
                {course.expectedOutcomes.map((outcome, index) => (
                  <li key={index} className="text-muted-foreground">• {outcome}</li>
                ))}
              </ul>
            </div>

            <Separator />

            {/* Modules */}
            <div>
              <h3 className="font-semibold text-lg mb-3">Course Modules</h3>
              <Accordion type="single" collapsible className="w-full">
                {course.modules.map((module, index) => (
                  <AccordionItem key={module.id} value={module.id}>
                    <AccordionTrigger className="text-left">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="shrink-0">Module {index + 1}</Badge>
                        <span>{module.title}</span>
                        {module.duration && (
                          <span className="text-xs text-muted-foreground ml-auto mr-2">
                            {module.duration}
                          </span>
                        )}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="pt-4 pl-4 space-y-3">
                        <p className="text-muted-foreground whitespace-pre-wrap">{renderContentWithBold(module.content)}</p>
                        {module.toolsUsed && module.toolsUsed.length > 0 && (
                          <div>
                            <p className="text-sm font-medium mb-2">Tools Used:</p>
                            <div className="flex flex-wrap gap-2">
                              {module.toolsUsed.map((tool) => (
                                <Badge key={tool} variant="secondary">{tool}</Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            {/* Pro Tips */}
            {course.proTips && course.proTips.length > 0 && (
              <>
                <Separator />
                <div>
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-primary" />
                    Pro Tips
                  </h3>
                  <ul className="space-y-2 ml-7">
                    {course.proTips.map((tip, index) => (
                      <li key={index} className="text-muted-foreground">💡 {tip}</li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
