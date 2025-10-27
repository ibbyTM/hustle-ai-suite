import { useState } from "react";
import { AgentPanelLayout } from "./AgentPanelLayout";
import { SmartSelect } from "./SmartSelect";
import { SmartTextarea } from "./SmartTextarea";
import { KnowledgeBaseSelector } from "./KnowledgeBaseSelector";
import { OutputPreview } from "./OutputPreview";
import { Button } from "@/components/ui/button";
import { useAgentGeneration } from "@/hooks/useAgentGeneration";
import { useKnowledgeBaseAttachment } from "@/hooks/useKnowledgeBaseAttachment";

interface CommentDMEngagerPanelProps {
  isOpen: boolean;
  onClose: () => void;
  asPage?: boolean;
}

export function CommentDMEngagerPanel({ isOpen, onClose, asPage }: CommentDMEngagerPanelProps) {
  const [messageText, setMessageText] = useState("");
  const [goal, setGoal] = useState("Engage");
  const [replyTone, setReplyTone] = useState("Friendly");
  const [generationId, setGenerationId] = useState<string>();

  const { generate, isGenerating, output, setOutput } = useAgentGeneration({
    toolId: "comment-dm-engager",
    toolTitle: "Comment & DM Engager",
    toolEmoji: "💬",
  });

  const { knowledgeBases, attachedKB, attachKB } = useKnowledgeBaseAttachment("comment-dm-engager", isOpen);

  const handleGenerate = async () => {
    let prompt = `Craft a strategic reply to this message: "${messageText}"

Goal: ${goal}
Tone: ${replyTone}

Use this exact structure:

**Hustle Breakdown**
Analyze the message in 2-3 sentences: What's the intent? What does the person need? What's the best play here?

**The Formula**
Break down the reply strategy:
- Response Pattern: [Explain the psychological approach]
- Value Hook: [What keeps them engaged or curious]
- Conversion Bridge: [How this moves them closer to the goal]

**Your Output**

**Primary Reply (aligned with goal: ${goal}):**
[Write a natural, engaging reply that matches the ${replyTone} tone — no fluff, just value and direction]

**Secondary Variation (different angle):**
[Write an alternative reply with a slightly different tone or approach]

**Optional DM Template** (if goal = Nurture or Sell):
[Provide a follow-up DM template if the conversation should continue privately]

**CTA Line or Follow-Up Question:**
[Write 1-2 lines designed to drive a response, build rapport, or move toward the goal]

**Next Play**
Provide 3 tactical moves:
1. [Engagement tactic]
2. [Follow-up timing]
3. [Conversion nudge]

Do not use emojis in the output. Keep replies authentic, confident, and conversion-ready.`;

    if (attachedKB) {
      prompt += `\n\nKNOWLEDGE BASE CONTEXT:\n`;
      if (attachedKB.brand_voice?.tone) {
        prompt += `\nBrand Tone: ${attachedKB.brand_voice.tone}`;
      }
      if (attachedKB.brand_voice?.style) {
        prompt += `\nBrand Style: ${attachedKB.brand_voice.style}`;
      }
      if (attachedKB.products && attachedKB.products.length > 0) {
        const product = attachedKB.products[0];
        if (product.name) prompt += `\nProduct/Service: ${product.name}`;
      }
      if (attachedKB.offers && attachedKB.offers.length > 0) {
        const offer = attachedKB.offers[0];
        if (offer.title) prompt += `\nCurrent Offer: ${offer.title}`;
      }
    }

    const result = await generate(prompt, { messageText, goal, replyTone });
    if (result?.generationId) {
      setGenerationId(result.generationId);
    }
  };

  const inputPanel = (
    <div className="space-y-6">
      <SmartTextarea
        id="messageText"
        label="Comment or DM Text"
        value={messageText}
        onChange={setMessageText}
        placeholder="Paste the comment or message you received"
        tooltip="Paste the exact message you received"
        required
      />
      <SmartSelect
        id="goal"
        label="Goal"
        value={goal}
        onChange={setGoal}
        options={["Engage", "Nurture", "Sell"]}
        tooltip="What do you want to achieve with your reply?"
        required
      />
      <SmartSelect
        id="replyTone"
        label="Tone"
        value={replyTone}
        onChange={setReplyTone}
        options={["Friendly", "Authoritative", "Persuasive"]}
        tooltip="How should your reply sound?"
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
        disabled={isGenerating || !messageText.trim()}
        className="w-full"
        size="lg"
      >
        {isGenerating ? "Crafting Reply..." : "Generate Reply"}
      </Button>
    </div>
  );

  const outputPanel = output ? (
    <OutputPreview 
      content={output}
      generationId={generationId}
      onContentUpdate={(newContent) => setOutput(newContent)}
    />
  ) : (
    <div className="flex items-center justify-center h-full text-muted-foreground">
      Paste a comment or DM and hit generate
    </div>
  );

  return (
    <AgentPanelLayout
      isOpen={isOpen}
      onClose={onClose}
      title="Comment & DM Engager"
      emoji="💬"
      inputPanel={inputPanel}
      outputPanel={outputPanel}
      asPage={asPage}
    />
  );
}
