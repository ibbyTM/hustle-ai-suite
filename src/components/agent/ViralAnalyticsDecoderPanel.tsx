import { useState } from "react";
import { AgentPanelLayout } from "./AgentPanelLayout";
import { SmartSelect } from "./SmartSelect";
import { SmartTextarea } from "./SmartTextarea";
import { KnowledgeBaseSelector } from "./KnowledgeBaseSelector";
import { OutputPreview } from "./OutputPreview";
import { Button } from "@/components/ui/button";
import { useAgentGeneration } from "@/hooks/useAgentGeneration";
import { useKnowledgeBaseAttachment } from "@/hooks/useKnowledgeBaseAttachment";

interface ViralAnalyticsDecoderPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ViralAnalyticsDecoderPanel({ isOpen, onClose }: ViralAnalyticsDecoderPanelProps) {
  const [postContent, setPostContent] = useState("");
  const [platform, setPlatform] = useState("TikTok");
  const [objective, setObjective] = useState("Learn");

  const { generate, isGenerating, output } = useAgentGeneration({
    toolId: "viral-analytics-decoder",
    toolTitle: "Viral Analytics Decoder",
    toolEmoji: "📈",
  });

  const { knowledgeBases, attachedKB, attachKB } = useKnowledgeBaseAttachment("viral-analytics-decoder", isOpen);

  const handleGenerate = async () => {
    let prompt = `Analyze this viral post from ${platform}: "${postContent}"

Objective: ${objective}

Use this exact structure:

**Hustle Breakdown**
Summarize why this post went viral in 3-4 sentences. What's the emotional trigger? What's the pattern? What made people engage?

**The Formula**

**Virality Breakdown:**
- Psychology: [What emotion or pain point does this tap into?]
- Pattern: [Describe the content structure or format]
- Emotional Triggers: [List 2-3 triggers: curiosity, FOMO, relatability, etc.]

**Hook Formula Extracted:**
[Write the hook pattern as a template that can be reused]
Example: "You're doing [X] wrong — here's what actually works"

**Story or Structure Analysis:**
Break down the flow:
- Opening: [How does it start?]
- Build: [How does it create tension or curiosity?]
- Payoff: [How does it deliver value or resolution?]
- CTA: [What action does it drive?]

**Your Output**

**Actionable Template (ready to reuse):**
[Provide a plug-and-play template based on this viral post's structure]

Hook Template:
[Reusable hook format]

Body Template:
[Reusable content structure]

CTA Template:
[Reusable call-to-action format]

**Next Play**
Provide 3 implementation ideas:
1. [How to use this format for your next 3 posts]
2. [What metrics to track: saves, shares, comments]
3. [Optimization move to test]

Do not use emojis in the output. Keep the analysis strategic, tactical, and actionable.`;

    if (attachedKB && objective === "Adapt to my brand") {
      prompt += `\n\nKNOWLEDGE BASE CONTEXT:\n`;
      prompt += `When creating the actionable template, adapt it to match this brand context:\n`;
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
        if (product.name) prompt += `\nProduct/Service: ${product.name}`;
      }
    }

    await generate(prompt, { postContent, platform, objective });
  };

  const inputPanel = (
    <div className="space-y-6">
      <SmartTextarea
        id="postContent"
        label="Post URL or Caption/Text"
        value={postContent}
        onChange={setPostContent}
        placeholder="Paste the viral post URL or full caption text"
        required
      />
      <SmartSelect
        id="platform"
        label="Platform"
        value={platform}
        onChange={setPlatform}
        options={["TikTok", "Instagram", "Twitter", "YouTube"]}
        required
      />
      <SmartSelect
        id="objective"
        label="Objective"
        value={objective}
        onChange={setObjective}
        options={["Learn", "Recreate", "Adapt to my brand"]}
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
        disabled={isGenerating || !postContent.trim()}
        className="w-full"
        size="lg"
      >
        {isGenerating ? "Analyzing..." : "Decode Viral Post"}
      </Button>
    </div>
  );

  const outputPanel = output ? (
    <OutputPreview content={output} />
  ) : (
    <div className="flex items-center justify-center h-full text-muted-foreground">
      Paste a viral post and hit decode
    </div>
  );

  return (
    <AgentPanelLayout
      isOpen={isOpen}
      onClose={onClose}
      title="Viral Analytics Decoder"
      emoji="📈"
      inputPanel={inputPanel}
      outputPanel={outputPanel}
    />
  );
}
