import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft, Star } from "lucide-react";
import { automations } from "@/data/automations";
import { Button } from "@/components/ui/button";
import { CategoryBadge } from "@/components/CategoryBadge";
import { BookForgePanel } from "@/components/agent/BookForgePanel";
import { BusinessValidatorPanel } from "@/components/agent/BusinessValidatorPanel";
import { HustleSprintPanel } from "@/components/agent/HustleSprintPanel";
import { DigitalProductGeneratorModal } from "@/components/DigitalProductGeneratorModal";
import { NewsletterInputPanel } from "@/components/NewsletterInputPanel";
import { TrendFinderPanel } from "@/components/agent/TrendFinderPanel";
import { AdCopyLabPanel } from "@/components/agent/AdCopyLabPanel";
import { HookFactoryPanel } from "@/components/agent/HookFactoryPanel";
import { FacelessScriptPanel } from "@/components/agent/FacelessScriptPanel";
import { BizIdeaPanel } from "@/components/agent/BizIdeaPanel";
import { DropshipPanel } from "@/components/agent/DropshipPanel";
import { AdFunnelPanel } from "@/components/agent/AdFunnelPanel";
import { OfferBuilderPanel } from "@/components/agent/OfferBuilderPanel";
import { PageBuilderPanel } from "@/components/agent/PageBuilderPanel";
import { NameForgePanel } from "@/components/agent/NameForgePanel";
import { ContentToCashPanel } from "@/components/agent/ContentToCashPanel";
import { DailyPlannerPanel } from "@/components/agent/DailyPlannerPanel";
import { SocialPostCrafterPanel } from "@/components/agent/SocialPostCrafterPanel";
import { CommentDMEngagerPanel } from "@/components/agent/CommentDMEngagerPanel";
import { ViralAnalyticsDecoderPanel } from "@/components/agent/ViralAnalyticsDecoderPanel";
import { LogoMakerPanel } from "@/components/agent/LogoMakerPanel";
import { useFavorites } from "@/hooks/useFavorites";
import { useAuth } from "@/contexts/AuthContext";

export default function ToolPage() {
  const { toolId } = useParams<{ toolId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();

  const tool = automations.find((t) => t.id === toolId);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [toolId]);

  if (!tool) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <h2 className="text-2xl font-bold">Tool not found</h2>
        <p className="text-muted-foreground">The tool you're looking for doesn't exist.</p>
        <Button onClick={() => navigate("/dashboard")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>
    );
  }

  const handleClose = () => {
    const from = searchParams.get("from");
    if (from === "my-hustles") {
      navigate("/my-hustles");
    } else {
      navigate("/dashboard");
    }
  };

  const handleFavoriteToggle = () => {
    if (isFavorite(tool.id)) {
      removeFavorite(tool.id);
    } else {
      addFavorite(tool.id);
    }
  };

  const renderToolPanel = () => {
    // All panels now render as pages with asPage prop
    const pageProps = { isOpen: true, onClose: handleClose, asPage: true };

    switch (tool.id) {
      case "bookforge":
        return <BookForgePanel {...pageProps} />;
      case "business-validator":
        return <BusinessValidatorPanel {...pageProps} />;
      case "hustle-sprint":
        return <HustleSprintPanel {...pageProps} />;
      case "digital-product-generator":
        return <DigitalProductGeneratorModal {...pageProps} />;
      case "inbox-influence":
        return <NewsletterInputPanel {...pageProps} />;
      case "trend-finder":
        return <TrendFinderPanel {...pageProps} />;
      case "ad-copy-lab":
        return <AdCopyLabPanel {...pageProps} />;
      case "hook-factory":
        return <HookFactoryPanel {...pageProps} />;
      case "faceless-script":
        return <FacelessScriptPanel {...pageProps} />;
      case "biz-idea":
        return <BizIdeaPanel {...pageProps} />;
      case "dropship-goldmine":
        return <DropshipPanel {...pageProps} />;
      case "ad-funnel":
        return <AdFunnelPanel {...pageProps} />;
      case "offer-builder":
        return <OfferBuilderPanel {...pageProps} />;
      case "page-builder":
        return <PageBuilderPanel {...pageProps} />;
      case "name-forge":
        return <NameForgePanel {...pageProps} />;
      case "content-to-cash":
        return <ContentToCashPanel {...pageProps} />;
      case "daily-planner":
        return <DailyPlannerPanel {...pageProps} />;
      case "social-post-crafter":
        return <SocialPostCrafterPanel {...pageProps} />;
      case "comment-dm-engager":
        return <CommentDMEngagerPanel {...pageProps} />;
      case "viral-analytics-decoder":
        return <ViralAnalyticsDecoderPanel {...pageProps} />;
      case "logo-maker":
      case "logomaker":
        return <LogoMakerPanel {...pageProps} />;
      default:
        return null;
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div className="flex items-center gap-3">
            <span className="text-4xl">{tool.emoji}</span>
            <div>
              <h1 className="text-2xl font-bold">{tool.title}</h1>
              <CategoryBadge category={tool.category} />
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleFavoriteToggle}
          className="h-10 w-10"
        >
          <Star
            className={`h-5 w-5 ${
              isFavorite(tool.id) ? "fill-yellow-400 text-yellow-400" : ""
            }`}
          />
        </Button>
      </div>

      {/* Tool Content */}
      <div className="min-h-[calc(100vh-200px)]">
        {renderToolPanel()}
      </div>
    </div>
  );
}
