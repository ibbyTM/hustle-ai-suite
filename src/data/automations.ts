import { AutomationTool } from "@/types/automation";

export const automations: AutomationTool[] = [
  {
    id: "trend-finder",
    title: "Trend Finder 2.0",
    emoji: "🔥",
    category: "Content",
    description: "Discover what's blowing up on TikTok & IG right now",
    isPro: false,
    inputs: [
      { id: "platform", label: "Platform", type: "select", options: ["TikTok", "Instagram", "YouTube Shorts", "All Platforms"] },
      { id: "niche", label: "Niche", type: "text", placeholder: "e.g., fitness, finance, lifestyle, gaming" },
      { id: "goal", label: "Content Goal", type: "select", options: ["Grow Followers", "Drive Sales", "Build Brand", "Increase Engagement"] },
      { id: "tone", label: "Tone", type: "select", options: ["Professional", "Relatable", "Bold", "Casual", "Inspirational"] }
    ],
    promptTemplate: "List 5 trending content ideas for {platform}. If niche is specified: focus on the {niche} niche. If niche is empty or not specified: cover trends across multiple popular niches (fitness, finance, lifestyle, tech, entertainment). The goal is to {goal} with a {tone} tone. For each trend, include: Trend Name, Why It Works, Example Hook, and Caption Strategy. Format with clear headings and bullet points. Do not use any emojis in the output."
  },
  {
    id: "faceless-script",
    title: "Faceless Script Forge",
    emoji: "🎬",
    category: "Content",
    description: "Generate viral scripts for faceless TikTok pages",
    isPro: false,
    inputs: [
      { id: "niche", label: "Niche", type: "text", placeholder: "e.g., luxury lifestyle, motivation" },
      { id: "tone", label: "Tone", type: "select", options: ["motivational", "luxury", "relatable"] }
    ],
    promptTemplate: "Here are 3 faceless TikTok script ideas for the {niche} niche, written in a {tone} tone.\n\nFor each script, use this exact structure:\n\nScript Title\nConcept – A short 1-2 line explanation of the video concept.\nNarration – Write the full voiceover script as it would be spoken.\nVisuals – Provide a bullet list describing each scene or visual element.\nCTA – Include an example closing call-to-action or hook.\n\nDo not use emojis. Do not use casual slang like 'boujee,' 'fire,' 'lit,' etc. Keep the tone minimal, clean, and confident—like it was written by a professional creator strategist. Use clear headings and proper formatting."
  },
  {
    id: "biz-idea",
    title: "Biz-Idea Reactor",
    emoji: "💡",
    category: "Hustle",
    description: "Find your next £10K side hustle",
    isPro: false,
    inputs: [
      { id: "vibe", label: "Vibe", type: "select", options: ["Online", "AI-Powered", "Low-Budget", "For Students", "For Mums", "Content Creation", "E-commerce", "Freelancing", "Coaching/Consulting", "Creative/Design", "Service-Based", "Physical Products", "Other (custom)"] },
      { id: "customVibe", label: "Custom Vibe (if Other selected)", type: "text", placeholder: "Describe your ideal hustle style..." }
    ],
    promptTemplate: "Generate 3 unique business ideas for {customVibe|vibe} hustlers. For each idea, include: Concept, How to Start, Monetisation Path."
  },
  {
    id: "dropship-goldmine",
    title: "Dropship Goldmine",
    emoji: "📦",
    category: "Store",
    description: "Trending products that actually sell",
    isPro: false,
    inputs: [
      { id: "niche", label: "Niche", type: "text", placeholder: "e.g., fitness, beauty, tech" }
    ],
    promptTemplate: "Here are 5 trending products in the {niche} niche that are performing well right now, along with ideas for how to market each.\n\nFor each product, use this exact structure:\n\nProduct Name\nWhy it's trending: Provide 2-3 sentences explaining the trend or consumer behaviour driving demand.\nAd Hook Idea: Write 1 short viral-style line suitable for TikTok or Reels.\nContent Angle: Describe in 1-2 sentences what type of video or ad works best for this product.\nPositioning Tip: Write 1 line explaining what emotion or benefit to highlight when selling this product.\n\nKeep each product description under 120 words. Do not use emojis. Do not use casual slang like 'fam,' 'fire,' 'lit,' 'tryna,' etc. Keep the tone professional and strategic."
  },
  {
    id: "ad-copy-lab",
    title: "Ad Copy & Creative Lab",
    emoji: "✨",
    category: "Ads",
    description: "Make ads hit different",
    isPro: false,
    inputs: [
      { id: "product", label: "Product/Service", type: "text", placeholder: "e.g., productivity app" },
      { id: "audience", label: "Target Audience", type: "text", placeholder: "e.g., busy entrepreneurs" }
    ],
    promptTemplate: "Write 3 ad copy variations for {product} targeting {audience}. Include headline, short caption, and creative idea (visual concept)."
  },
  {
    id: "ad-funnel",
    title: "Ad Funnel Copy Writer",
    emoji: "🚀",
    category: "Ads",
    description: "Complete funnel from scroll-stop to sale",
    isPro: false,
    inputs: [
      { id: "product", label: "Product/Service", type: "text", placeholder: "Your offer" },
      { id: "audience", label: "Audience", type: "text", placeholder: "Who you're targeting" },
      { id: "goal", label: "Goal", type: "select", options: ["Sell", "Leads", "Followers"] },
      { id: "platform", label: "Platform", type: "select", options: ["TikTok", "Instagram", "Facebook"] }
    ],
    promptTemplate: "Create a complete ad funnel for {product} targeting {audience} with goal = {goal}. Include: 1) Hook ideas, 2) Ad copy, 3) Creative scenes, 4) Landing page copy, 5) Offer/bonus idea."
  },
  {
    id: "hook-factory",
    title: "Hook Factory",
    emoji: "🪝",
    category: "Content",
    description: "Scroll-stopping first lines that convert",
    isPro: false,
    inputs: [
      { id: "topic", label: "Niche or Topic", type: "text", placeholder: "e.g., money mindset" }
    ],
    promptTemplate: "Generate 10 viral hook lines (max 8 words) for {topic}. Each should sound like something you'd hear in a viral TikTok or ad."
  },
  {
    id: "offer-builder",
    title: "Offer Builder",
    emoji: "🎁",
    category: "Hustle",
    description: "Craft irresistible offers people can't ignore",
    isPro: false,
    inputs: [
      { id: "product", label: "Product/Service", type: "text", placeholder: "What you're selling" }
    ],
    promptTemplate: "Create an irresistible offer for {product}. Include name, bonus ideas, urgency line, and one-sentence positioning angle."
  },
  {
    id: "page-builder",
    title: "Page & Profile Builder",
    emoji: "📱",
    category: "Brand",
    description: "Full brand setup from username to content pillars",
    isPro: false,
    inputs: [
      { id: "platform", label: "Platform", type: "select", options: ["TikTok", "Instagram", "Store", "Funnel"] }
    ],
    promptTemplate: "Generate a full profile setup for a {platform} brand. Include username ideas, bio, tone of voice, posting pillars, and content schedule."
  },
  {
    id: "name-forge",
    title: "Name Forge",
    emoji: "⚡",
    category: "Brand",
    description: "Catchy brand names that sound Gen-Z-approved",
    isPro: false,
    inputs: [
      { id: "niche", label: "Niche or Product Type", type: "text", placeholder: "e.g., skincare, coaching" }
    ],
    promptTemplate: "Generate 5 catchy, memorable brand or product names in the {niche} space that sound modern and Gen-Z-friendly."
  },
  {
    id: "content-to-cash",
    title: "Content-to-Cash Ideas",
    emoji: "💰",
    category: "Hustle",
    description: "Content ideas that entertain AND sell",
    isPro: false,
    inputs: [
      { id: "niche", label: "Niche or Audience", type: "text", placeholder: "e.g., fitness beginners" }
    ],
    promptTemplate: "Give 5 content ideas for {niche} that both entertain and sell. For each, include video concept, hook, and monetisation angle."
  },
  {
    id: "daily-planner",
    title: "Daily Hustle Planner",
    emoji: "📋",
    category: "Productivity",
    description: "3 daily tasks to level up your hustle",
    isPro: false,
    inputs: [
      { id: "goal", label: "Goal Type", type: "select", options: ["Money", "Audience", "Skill"] }
    ],
    promptTemplate: "Generate 3 actionable daily tasks to grow your {goal}, add one motivational quote, and a quick reflection question."
  }
];
