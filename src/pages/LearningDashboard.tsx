import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { courses } from "@/data/courses";
import { Course } from "@/types/course";
import { LearningSidebar } from "@/components/learning/LearningSidebar";
import { CourseProgressBar } from "@/components/learning/CourseProgressBar";
import { LessonViewer } from "@/components/learning/LessonViewer";
import { LessonNavigationBar } from "@/components/learning/LessonNavigationBar";
import { AgentOverlay } from "@/components/learning/AgentOverlay";
import { useCourseProgress } from "@/hooks/useCourseProgress";
import { useAgentContext } from "@/hooks/useAgentContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function LearningDashboard() {
  const { courseId, moduleId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [currentModuleId, setCurrentModuleId] = useState<string>("");
  const [activeAgentId, setActiveAgentId] = useState<string | null>(null);
  
  const { markModuleComplete, isModuleComplete, getCourseProgress } = useCourseProgress();
  const { setAgentContext, getAgentContext, clearContext } = useAgentContext();

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

  // Load course and module from URL params
  useEffect(() => {
    if (courseId) {
      const course = courses.find(c => c.id === courseId);
      if (course) {
        setSelectedCourse(course);
        // Set current module from URL or default to first module
        if (moduleId && course.modules.find(m => m.id === moduleId)) {
          setCurrentModuleId(moduleId);
        } else if (course.modules.length > 0) {
          setCurrentModuleId(course.modules[0].id);
          navigate(`/learn/${courseId}/${course.modules[0].id}`, { replace: true });
        }
      } else {
        // Course not found, redirect to course guides
        navigate("/course-guides");
      }
    } else {
      // No course selected, redirect to course guides
      navigate("/course-guides");
    }
  }, [courseId, moduleId, navigate]);

  // Update URL when module changes
  const handleModuleSelect = (newModuleId: string) => {
    setCurrentModuleId(newModuleId);
    if (selectedCourse) {
      navigate(`/learn/${selectedCourse.id}/${newModuleId}`);
    }
  };

  const handleToggleComplete = () => {
    if (selectedCourse && currentModuleId) {
      markModuleComplete(selectedCourse.id, currentModuleId);
    }
  };

  const handleLaunchAgent = (agentId: string, context: Record<string, any>) => {
    setAgentContext(agentId, context);
    setActiveAgentId(agentId);
  };

  const handleCloseAgent = () => {
    setActiveAgentId(null);
    clearContext();
  };

  const handlePrevModule = () => {
    if (!selectedCourse) return;
    const currentIndex = selectedCourse.modules.findIndex(m => m.id === currentModuleId);
    if (currentIndex > 0) {
      handleModuleSelect(selectedCourse.modules[currentIndex - 1].id);
    }
  };

  const handleNextModule = () => {
    if (!selectedCourse) return;
    const currentIndex = selectedCourse.modules.findIndex(m => m.id === currentModuleId);
    if (currentIndex < selectedCourse.modules.length - 1) {
      handleModuleSelect(selectedCourse.modules[currentIndex + 1].id);
    }
  };

  if (!selectedCourse) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading course...</p>
      </div>
    );
  }

  const currentModule = selectedCourse.modules.find(m => m.id === currentModuleId);
  const currentIndex = selectedCourse.modules.findIndex(m => m.id === currentModuleId);
  const completedModules = new Set(
    selectedCourse.modules
      .filter(m => isModuleComplete(selectedCourse.id, m.id))
      .map(m => m.id)
  );
  const progress = getCourseProgress(selectedCourse.id, selectedCourse.modules.length);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Progress Bar */}
      <CourseProgressBar
        course={selectedCourse}
        completedModules={progress.completed}
        totalModules={progress.total}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Hidden on mobile, shown on lg+ */}
        <div className="hidden lg:block">
          <LearningSidebar
            course={selectedCourse}
            currentModuleId={currentModuleId}
            completedModules={completedModules}
            onModuleSelect={handleModuleSelect}
            courseProgress={progress.percentage}
          />
        </div>

        {/* Main Lesson Content */}
        <div className="flex-1 overflow-y-auto pb-24">
          <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
            {/* Back Button */}
            <Button
              variant="ghost"
              onClick={() => navigate("/course-guides")}
              className="mb-6 gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Courses
            </Button>

            {currentModule ? (
              <LessonViewer
                module={currentModule}
                isComplete={isModuleComplete(selectedCourse.id, currentModule.id)}
                onToggleComplete={handleToggleComplete}
                onLaunchAgent={handleLaunchAgent}
              />
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Module not found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <LessonNavigationBar
        hasPrevModule={currentIndex > 0}
        hasNextModule={currentIndex < selectedCourse.modules.length - 1}
        onPrevModule={handlePrevModule}
        onNextModule={handleNextModule}
      />

      {/* Agent Overlay */}
      <AgentOverlay
        agentId={activeAgentId}
        context={getAgentContext(activeAgentId || "")}
        onClose={handleCloseAgent}
      />
    </div>
  );
}
