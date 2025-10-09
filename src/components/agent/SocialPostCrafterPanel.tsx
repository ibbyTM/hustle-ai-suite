import { useState } from "react";
import { AgentPanelLayout } from "./AgentPanelLayout";
import { SmartSelect } from "./SmartSelect";
import { SmartInput } from "./SmartInput";
import { KnowledgeBaseSelector } from "./KnowledgeBaseSelector";
import { OutputPreview } from "./OutputPreview";
import { Button } from "@/components/ui/button";
import { useAgentGeneration } from "@/hooks/useAgentGeneration";
import { useKnowledgeBaseAttachment } from "@/hooks/useKnowledgeBaseAttachment";

interface SocialPostCrafterPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SocialPostCrafterPanel({ isOpen, onClose }: SocialPostCrafterPanelProps) {
  const [platform, setPlatform] = useState("TikTok");
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("Casual");

  const { generate, isGenerating, output } = useAgentGeneration({
    toolId: "social-post-crafter",
    toolTitle: "Social Media Post Crafter",
    toolEmoji: "📱",
  });

  const { knowledgeBases, attachedKB, attachKB } = useKnowledgeBaseAttachment("social-post-crafter", isOpen);

  const handleGenerate = async () => {
    let prompt = `Create a high-performing post for ${platform} about ${topic}, written in a ${tone} voice.

Use this exact structure:

**Hustle Breakdown**
Explain the post strategy in 2-3 sentences. What makes this work for ${platform}? What's the psychology behind it?

**The Formula**
Break down the post components:
- Hook Pattern: [Describe the hook type and why it grabs attention]
- Caption Structure: [Explain the flow: problem/benefit/CTA]
- Engagement Tactic: [How this drives comments/saves/shares]

**Your Output**

**Hook Line:**
[Write the opening line — designed to stop the scroll in under 3 seconds]

**Caption Copy:**
[Write the full caption with natural line breaks, no fluff, strategic pauses, and authentic voice]

**Creative Concept Idea:**
[Describe the visual/video idea in 1-2 sentences — what should the viewer see?]

**Call-to-Action (3 options):**
1. [CTA option 1]
2. [CTA option 2]
3. [CTA option 3]

**Suggested Hashtags:**
[List 5-8 relevant hashtags for reach and discoverability]

**Next Play**
Provide 3 actionable next steps:
1. [Implementation tip]
2. [Testing suggestion]
3. [Optimization move]

Do not use emojis in the output. Keep the tone sharp, strategic, and conversion-focused.`;

    if (attachedKB) {
      prompt += `\n\nKNOWLEDGE BASE CONTEXT:\n`;
      if (attachedKB.brand_voice?.tone) {
        prompt += `\nBrand Tone: ${attachedKB.brand_voice.tone}`;
      }
      if (attachedKB.brand_voice?.style) {
        prompt += `\nBrand Style: ${attachedKB.brand_voice.style}`;
      }
      if (attachedKB.audience?.icp) {
        prompt += `\nTarget Audience: ${attachedKB.audience.icp}`;
      }
      if (attachedKB.products && attachedKB.products.length > 0) {
        const product = attachedKB.products[0];
        if (product.name) prompt += `\nProduct: ${product.name}`;
      }
    }

    await generate(prompt, { platform, topic, tone });
  };

  const inputPanel = (
    <div className="space-y-6">
      <SmartSelect
        id="platform"
        label="Platform"
        value={platform}
        onChange={setPlatform}
        options={["TikTok", "Instagram", "Twitter/X", "LinkedIn", "Facebook"]}
        required
      />
      <SmartInput
        id="topic"
        label="Topic or Offer"
        value={topic}
        onChange={setTopic}
        placeholder="What's the post about?"
        required
      />
      <SmartSelect
        id="tone"
        label="Tone"
        value={tone}
        onChange={setTone}
        options={["Casual", "Professional", "Storytelling", "Bold"]}
        required
      />
      <KnowledgeBaseSelector
        knowledgeBases={knowledgeBases}
        attachedKB={attachedKB}
        onAttach={attachKB}
        toolRequirement="optional"
      />
      <Button 
        onClick={handleGenerate} 
        disabled={isGenerating || !topic.trim()}
        className="w-full"
        size="lg"
      >
        {isGenerating ? "Crafting Post..." : "Generate Post"}
      </Button>
    </div>
  );

  const outputPanel = output ? (
    <OutputPreview content={output} />
  ) : (
    <div className="flex items-center justify-center h-full text-muted-foreground">
      Configure your inputs and hit generate
    </div>
  );

  return (
    <AgentPanelLayout
      isOpen={isOpen}
      onClose={onClose}
      title="Social Media Post Crafter"
      emoji="📱"
      inputPanel={inputPanel}
      outputPanel={outputPanel}
    />
  );
}
