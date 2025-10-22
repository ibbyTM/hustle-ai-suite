import { useState } from "react";

interface AgentContextData {
  agentId: string;
  [key: string]: any;
}

export const useAgentContext = () => {
  const [contextData, setContextData] = useState<AgentContextData | null>(null);

  const setAgentContext = (agentId: string, context: Record<string, any>) => {
    setContextData({ agentId, ...context });
  };

  const getAgentContext = (agentId: string) => {
    return contextData?.agentId === agentId ? contextData : {};
  };

  const clearContext = () => {
    setContextData(null);
  };

  return { setAgentContext, getAgentContext, clearContext, hasContext: !!contextData };
};
