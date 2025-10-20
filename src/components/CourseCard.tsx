import { Course } from "@/types/course";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, BarChart } from "lucide-react";

interface CourseCardProps {
  course: Course;
  onSelect: (course: Course) => void;
}

export const CourseCard = ({ course, onSelect }: CourseCardProps) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "Intermediate":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "Advanced":
        return "bg-rose-500/10 text-rose-500 border-rose-500/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group" onClick={() => onSelect(course)}>
      <CardHeader>
        <div className="flex items-start justify-between mb-2">
          <span className="text-4xl">{course.emoji}</span>
          <Badge className={getDifficultyColor(course.difficulty)} variant="outline">
            {course.difficulty}
          </Badge>
        </div>
        <CardTitle className="group-hover:text-primary transition-colors">{course.title}</CardTitle>
        <CardDescription>{course.shortDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {course.estimatedTime}
          </div>
          <div className="flex items-center gap-1">
            <BarChart className="h-4 w-4" />
            {course.modules.length} modules
          </div>
        </div>
        <Button className="w-full" variant="gradient">
          Start Course
        </Button>
      </CardContent>
    </Card>
  );
};
