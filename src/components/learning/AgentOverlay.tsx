import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

interface AgentOverlayProps {
  agentId: string | null;
  context: Record<string, any>;
  onClose: () => void;
}

export const AgentOverlay = ({ agentId, context, onClose }: AgentOverlayProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (agentId) {
      navigate(`/tool/${agentId}`);
      onClose();
    }
  }, [agentId, navigate, onClose]);

  return null;
};
