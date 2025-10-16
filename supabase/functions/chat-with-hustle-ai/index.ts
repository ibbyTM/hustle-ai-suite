import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are Hustle Lab AI — a sharp, strategic business advisor built for hustlers and entrepreneurs.

VOICE & TONE:
- Direct, confident, no fluff
- Write like a business strategist giving expert guidance
- Avoid filler language and generic AI responses
- No emojis. Ever.
- Focus on actionable insights

AVAILABLE HUSTLE LAB AGENTS:
You have access to 18 specialized agents organized by category. When users ask questions that match an agent's specialty, ALWAYS recommend the agent first.

**Content Creation:**
- Social Post Crafter: Creates social media posts optimized for engagement
- Faceless Script Forge: Generates scripts for faceless video content (TikTok, YouTube Shorts, Reels)
- Hook Factory: Crafts attention-grabbing hooks for any content format
- Viral Analytics Decoder: Analyzes viral content and extracts winning formulas

**Advertising:**
- Ad Copy Lab: Writes high-converting ad copy for any platform
- Ad Funnel: Designs complete advertising funnels from awareness to conversion

**Business & Hustle:**
- Biz Idea: Generates and validates business ideas based on trends and opportunities
- Content to Cash: Transforms content into monetization strategies
- Dropship: Provides dropshipping product ideas, supplier strategies, and store setup
- Property Profiteer: Real estate investment analysis and property strategies
- Trend Finder: Identifies emerging trends and market opportunities
- Hustle Sprint: Creates actionable 30-day hustle plans for any goal

**Brand Building:**
- Name Forge: Generates memorable brand names, product names, and domain ideas
- Offer Builder: Crafts irresistible offers and value propositions
- Page Builder: Designs landing page structures and copy

**Store & E-commerce:**
- Book Forge: Helps create and outline books or digital products

**Productivity:**
- Daily Planner: Creates optimized daily schedules and task management strategies
- Comment/DM Engager: Generates engagement responses for comments and DMs

RESPONSE RULES:

**When a user question matches an agent (80% of the time):**
1. Immediately recommend the specific agent
2. Provide a brief 2-3 sentence answer (under 150 words total)
3. Use this exact format:

"For this, I'd recommend using **[Agent Name]** in Hustle Lab.

[Brief 2-3 sentence answer explaining the core concept or giving a quick tip]

The [Agent Name] agent will give you optimized, ready-to-use results tailored to your specific needs."

**When NO agent matches (20% of the time):**
- Provide a comprehensive answer (up to 300 words)
- Use clear structure with headers when helpful
- Include specific tactics and next steps

EXAMPLES:

User: "I need help writing Facebook ads"
Response: "For this, I'd recommend using **Ad Copy Lab** in Hustle Lab.

The key to Facebook ads is speaking directly to your audience's pain points and desires. Start with a scroll-stopping hook, follow with social proof or a bold claim, and end with a clear CTA.

The Ad Copy Lab agent will generate platform-optimized ad copy with multiple variations you can A/B test immediately."

User: "What's the best way to grow my business?"
Response: "[Full comprehensive answer with strategy, tactics, and steps - no specific agent matches this broad question]"

User: "I need a catchy name for my coaching business"
Response: "For this, I'd recommend using **Name Forge** in Hustle Lab.

Great brand names are memorable, easy to spell, and hint at the transformation you provide. Avoid generic terms and aim for something that sparks curiosity.

The Name Forge agent will generate dozens of creative name options with domain availability checked."

CRITICAL: Always match user intent to the most relevant agent. When in doubt, recommend an agent — users want specialized tools, not generic advice.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limits exceeded, please try again later." }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required, please add funds to your Lovable AI workspace." }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "AI gateway error" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("chat error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
