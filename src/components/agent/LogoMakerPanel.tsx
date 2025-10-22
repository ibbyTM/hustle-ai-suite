import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import { AgentPanelLayout } from "./AgentPanelLayout";
import { SmartInput } from "./SmartInput";
import { SmartSelect } from "./SmartSelect";
import { LogoOutputPreview } from "./LogoOutputPreview";
import { useLogoGeneration } from "@/hooks/useLogoGeneration";

interface LogoMakerPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LogoMakerPanel({ isOpen, onClose }: LogoMakerPanelProps) {
  const [inputs, setInputs] = useState({
    businessName: "",
    tagline: "",
    brandStyle: "Clean & Professional",
    colorPalette: "",
    iconPreference: "",
    outputFormat: "Square Logo",
  });

  const { generate, isGenerating, variations } = useLogoGeneration({
    toolId: "logo-maker",
    toolTitle: "Logo Maker",
    toolEmoji: "🎨",
  });

  const handleGenerate = async () => {
    await generate(inputs);
  };

  const inputPanel = (
    <div className="space-y-6">
      <SmartInput
        id="businessName"
        label="Business Name"
        value={inputs.businessName}
        onChange={(value) => setInputs({ ...inputs, businessName: value })}
        placeholder="e.g., FitFlow Studio"
        tooltip="The name of your business or brand"
        required
      />

      <SmartInput
        id="tagline"
        label="Tagline"
        value={inputs.tagline}
        onChange={(value) => setInputs({ ...inputs, tagline: value })}
        placeholder="e.g., Move Better, Feel Better"
        tooltip="Optional tagline to include in the logo"
      />

      <Separator />

      <SmartSelect
        id="brandStyle"
        label="Brand Style"
        value={inputs.brandStyle}
        onChange={(value) => setInputs({ ...inputs, brandStyle: value })}
        options={[
          { value: "Minimalist", label: "Minimalist", description: "Clean and simple" },
          { value: "Modern Tech", label: "Modern Tech", description: "Sleek and futuristic" },
          { value: "Luxury / Premium", label: "Luxury / Premium", description: "Elegant and upscale" },
          { value: "Bold & Playful", label: "Bold & Playful", description: "Fun and energetic" },
          { value: "Clean & Professional", label: "Clean & Professional", description: "Business-ready" },
        ]}
        tooltip="Select the overall style for your logo"
        required
      />

      <SmartInput
        id="colorPalette"
        label="Color Palette"
        value={inputs.colorPalette}
        onChange={(value) => setInputs({ ...inputs, colorPalette: value })}
        placeholder="e.g., blue and white, gold and black"
        tooltip="Preferred colors for your logo (optional)"
      />

      <SmartInput
        id="iconPreference"
        label="Icon Preference"
        value={inputs.iconPreference}
        onChange={(value) => setInputs({ ...inputs, iconPreference: value })}
        placeholder="e.g., lightning bolt, shopping cart, brain"
        tooltip="Specific icon or symbol to include (optional)"
      />

      <SmartSelect
        id="outputFormat"
        label="Output Format"
        value={inputs.outputFormat}
        onChange={(value) => setInputs({ ...inputs, outputFormat: value })}
        options={[
          { value: "Square Logo", label: "Square Logo", description: "Perfect for social profiles" },
          { value: "Horizontal Logo", label: "Horizontal Logo", description: "Great for headers" },
          { value: "Icon Only", label: "Icon Only", description: "Symbol without text" },
        ]}
        tooltip="Choose the layout format"
        required
      />

      <Separator />

      <Button
        onClick={handleGenerate}
        disabled={isGenerating || !inputs.businessName}
        className="w-full"
        size="lg"
      >
        {isGenerating && <Loader2 className="h-4 w-4 animate-spin" />}
        {isGenerating ? "Designing your brand identity..." : "🧠 Generate Logo with Gemini NanoBanana"}
      </Button>

      {isGenerating && (
        <div className="bg-accent/10 rounded-lg p-3 text-center">
          <p className="text-sm text-muted-foreground animate-pulse">
            Designing your brand identity...
          </p>
        </div>
      )}
    </div>
  );

  const outputPanel = variations.length > 0 ? (
    <LogoOutputPreview 
      variations={variations}
      onRegenerate={handleGenerate}
    />
  ) : (
    <div className="flex items-center justify-center h-full text-muted-foreground">
      <p>Your logo variations will appear here</p>
    </div>
  );

  return (
    <AgentPanelLayout
      isOpen={isOpen}
      onClose={onClose}
      title="Logo Maker"
      emoji="🎨"
      inputPanel={inputPanel}
      outputPanel={outputPanel}
    />
  );
}
