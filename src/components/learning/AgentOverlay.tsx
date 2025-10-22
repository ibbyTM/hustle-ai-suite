import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { automations } from "@/data/automations";
import { BizIdeaPanel } from "@/components/agent/BizIdeaPanel";
import { TrendFinderPanel } from "@/components/agent/TrendFinderPanel";
import { DropshipPanel } from "@/components/agent/DropshipPanel";
import { NameForgePanel } from "@/components/agent/NameForgePanel";
import { OfferBuilderPanel } from "@/components/agent/OfferBuilderPanel";
import { AdCopyLabPanel } from "@/components/agent/AdCopyLabPanel";
import { HookFactoryPanel } from "@/components/agent/HookFactoryPanel";
import { PageBuilderPanel } from "@/components/agent/PageBuilderPanel";
import { FacelessScriptPanel } from "@/components/agent/FacelessScriptPanel";
import { ContentToCashPanel } from "@/components/agent/ContentToCashPanel";
import { LogoMakerPanel } from "@/components/agent/LogoMakerPanel";

interface AgentOverlayProps {
  agentId: string | null;
  context: Record<string, any>;
  onClose: () => void;
}

export const AgentOverlay = ({ agentId, context, onClose }: AgentOverlayProps) => {
  if (!agentId) return null;

  const agent = automations.find(a => a.id === agentId);
  if (!agent) return null;

  const renderAgentPanel = () => {
    const commonProps = { isOpen: true, onClose };

    switch (agentId) {
      case "biz-idea":
        return <BizIdeaPanel {...commonProps} />;
      case "trend-finder":
        return <TrendFinderPanel {...commonProps} />;
      case "dropship-goldmine":
        return <DropshipPanel {...commonProps} />;
      case "name-forge":
        return <NameForgePanel {...commonProps} />;
      case "offer-builder":
        return <OfferBuilderPanel {...commonProps} />;
      case "ad-copy-lab":
        return <AdCopyLabPanel {...commonProps} />;
      case "hook-factory":
        return <HookFactoryPanel {...commonProps} />;
      case "page-builder":
        return <PageBuilderPanel {...commonProps} />;
      case "faceless-script":
        return <FacelessScriptPanel {...commonProps} />;
      case "content-to-cash":
        return <ContentToCashPanel {...commonProps} />;
      case "logo-maker":
        return <LogoMakerPanel {...commonProps} />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm animate-fade-in">
      <div className="absolute top-4 right-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-10 w-10 rounded-full"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
      {renderAgentPanel()}
    </div>
  );
};
