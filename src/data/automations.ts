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
    promptTemplate: "Here are 3 ad copy variations for {product} targeting {audience}. Each includes a headline, caption, creative idea, and CTA suggestion.\n\nFor each variation, use this exact structure:\n\nAd Concept Title – A short, descriptive title (e.g., 'The Time Saver,' 'The Pain Point Fix').\nHeadline – Write a direct, catchy headline in 5-8 words.\nCaption – Write 2-3 lines following this flow: problem → solution → benefit.\nCreative Concept – Provide 1-2 sentences describing the visual approach or ad angle.\nCTA Example – Write a single actionable line (e.g., 'Start your free trial today' or 'Automate your posts now').\n\nDo not use emojis. Do not use conversational filler like 'Alright,' 'OMG,' 'Let's go,' etc. Use clear, strategic language—think ad strategist, not social media influencer. Format with bold section headers and proper line spacing for readability."
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
    promptTemplate: "Here's a complete ad funnel framework for {product}, targeting {audience} on {platform}, with the goal to {goal}.\n\nUse this exact structure:\n\nGoal Summary\nWrite 1-2 lines describing the funnel objective and target outcome.\n\nHook Ideas (Top of Funnel)\nProvide 3-5 strong opening lines designed for the ad. Each should sound like a real viral opener that stops the scroll.\n\nAd Copy (Middle of Funnel)\nWrite 1-2 paragraph options focused on this flow: problem → solution → result. Keep it persuasive and benefit-driven.\n\nCreative Direction\nProvide 2-3 ideas for what the ad should visually show. Format as short bullets.\n\nLanding Page Copy (Bottom of Funnel)\n- Headline: Write a clear, compelling headline.\n- Subheadline: Write a supporting subheadline that adds context or urgency.\n- Bullet Points: List 3-5 key features or benefits.\n- CTA Line: Write a clear, urgent call-to-action.\n\nDo not use emojis. Do not use casual phrases like 'Alright,' 'We're gonna,' 'hyped up,' 'Let's go,' etc. Keep the writing clean, persuasive, and formatted for quick reading—like it's going straight into a client pitch deck or funnel document. The tone should feel confident and conversion-focused."
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
    promptTemplate: "Here are 10 short viral hook ideas for {topic}, designed to capture attention in under 3 seconds.\n\nFormat as a clean numbered list. Each hook should be 6-10 words maximum.\n\nOptionally, you may divide the hooks into sub-sections such as:\n- Problem Hooks (addressing pain points)\n- Benefit Hooks (highlighting outcomes)\n- Curiosity Hooks (creating intrigue)\n\nDo not use emojis. Do not use casual phrases like 'Alright fam,' 'sick,' 'let's get it,' 'Now go forth,' etc. Do not include any outro text. End cleanly after the final hook. Keep the tone concise, persuasive, and ad-style—like a conversion copywriter's deliverable."
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
    promptTemplate: "Here's an irresistible offer breakdown for {product}, written to maximize conversions through clear value stacking.\n\nUse this exact structure:\n\n**Offer Name**\nProvide a short, catchy, brandable name for the offer.\n\n**Positioning Angle**\nWrite 1 sentence defining what makes this offer unique or transformative.\n\n**What's Included (Main Offer)**\nList 3-5 bullet points focused on benefits, not features. Emphasize outcomes and value.\n\n**Bonus Add-Ons**\nSuggest optional extras that amplify perceived value and make the offer feel more complete.\n\n**Urgency Line / Scarcity Prompt**\nWrite one short sentence encouraging immediate action.\n\nDo not use emojis. Do not use conversational slang like 'Alright fam,' 'let's cook up,' 'sprinkle of FOMO,' etc. Keep the tone confident, clean, and persuasive—think marketing strategist or landing page copywriter, not social media hype. Format with bold headers and proper spacing for clean readability."
  },
  {
    id: "page-builder",
    title: "Page & Profile Builder",
    emoji: "📱",
    category: "Brand",
    description: "Full brand setup from username to content pillars",
    isPro: false,
    inputs: [
      { id: "platform", label: "Platform", type: "select", options: ["TikTok", "Instagram", "YouTube", "Twitter/X", "LinkedIn"] },
      { id: "brandType", label: "Brand Type", type: "select", options: ["Personal brand", "Business", "Theme page", "Ecom brand"] },
      { id: "niche", label: "Niche", type: "text", placeholder: "e.g., fitness, luxury, education, fashion" },
      { id: "tone", label: "Tone", type: "select", options: ["Professional", "Relatable", "Funny", "Bold"] }
    ],
    promptTemplate: "Here's a full profile setup for a {brandType} on {platform} in the {niche} niche, written in a {tone} tone.\n\nUse this exact structure:\n\n**Username Ideas**\nProvide 3-5 relevant and memorable username suggestions.\n\n**Bio Examples**\nWrite 2-3 bio options formatted and optimized for {platform}. Keep within character limits and include relevant keywords.\n\n**Tone & Personality Notes**\nProvide 1-2 lines describing how the brand should sound, engage, and present itself.\n\n**Content Pillars**\nList 3 main content categories this brand should focus on. Each should align with the niche and audience.\n\n**Posting Strategy**\nOutline the best posting frequency, content format types (e.g., Reels, carousels, Stories), and engagement approach for {platform}.\n\nDo not use emojis. Do not use filler words like 'poppin',' 'grind,' 'let's go,' etc. Keep the tone simple, confident, and structured—like a brand strategist building a content guide. Format with bold headers and proper spacing."
  },
  {
    id: "name-forge",
    title: "Name Forge",
    emoji: "⚡",
    category: "Brand",
    description: "Catchy brand names that sound Gen-Z-approved",
    isPro: false,
    inputs: [
      { id: "productType", label: "Product or Brand Type", type: "select", options: ["SaaS", "E-commerce", "Agency", "Personal Brand", "Course", "App", "Coaching", "Content Brand"] },
      { id: "audience", label: "Target Audience", type: "text", placeholder: "e.g., Gen Z creators, small businesses, professionals" },
      { id: "tone", label: "Tone Preference", type: "select", options: ["Playful", "Premium", "Modern", "Minimal", "Bold"] }
    ],
    promptTemplate: "Here are 5 brand name ideas for a {productType} targeting {audience}, written in a {tone} tone. Each name includes a short explanation and tagline suggestion.\n\nUse this exact structure for each name:\n\n**Name #[number] – [Name]**\n\n**Meaning / Concept:** Write 1-2 sentences explaining the name origin, word play, or concept.\n\n**Tagline Suggestion:** Provide one catchy phrase that complements the name.\n\n**Why It Works:** Write a short reasoning explaining how this name aligns with the {tone} tone and appeals to {audience}.\n\nRepeat this structure for all 5 names.\n\nDo not use slang or emojis. Write in a confident, brand-consultant style—think naming agency deliverable. End with this line:\n\n'Each of these names can be adapted for domain or social handles.'"
  },
  {
    id: "content-to-cash",
    title: "Content-to-Cash Ideas",
    emoji: "💰",
    category: "Hustle",
    description: "Content ideas that entertain AND sell",
    isPro: false,
    inputs: [
      { id: "niche", label: "Niche or Audience", type: "text", placeholder: "e.g., fitness beginners, luxury buyers" },
      { id: "product", label: "Product or Service", type: "text", placeholder: "What you're selling or promoting" },
      { id: "goal", label: "Goal", type: "select", options: ["Brand awareness", "Drive sales", "Build trust", "Grow followers"] },
      { id: "platform", label: "Platform", type: "select", options: ["TikTok", "Instagram", "YouTube Shorts", "Instagram Reels"] },
      { id: "tone", label: "Tone", type: "select", options: ["Professional", "Relatable", "Funny", "Luxury", "Motivational"] }
    ],
    promptTemplate: "Here are 5 content ideas for {product}, targeting {niche} on {platform}, written in a {tone} tone with the goal to {goal}.\n\nFor each content idea, use this exact structure:\n\n**Idea Title**\nProvide a short, creative title for the content piece.\n\n**Concept:**\nWrite a 2-3 line description of what the content shows or demonstrates.\n\n**Hook Example:**\nProvide 1 strong opening line that would start the video.\n\n**Format Suggestion:**\nSpecify the content type (e.g., skit, testimonial, voiceover montage, vlog, behind the scenes, before/after).\n\n**Monetisation Angle:**\nExplain how this content drives revenue, conversions, or engagement with {product}.\n\nRepeat this structure for all 5 ideas.\n\nDo not use slang or emojis. Keep it creative but professional—like a content strategist's brief ready to hand off to a creator or editor."
  },
  {
    id: "daily-planner",
    title: "Daily Hustle Planner",
    emoji: "📋",
    category: "Productivity",
    description: "3 daily tasks to level up your hustle",
    isPro: false,
    inputs: [
      { id: "goal", label: "Goal Type", type: "select", options: ["Money", "Audience", "Skill"] },
      { id: "industry", label: "Industry or Hustle Type", type: "text", placeholder: "e.g., ecommerce, agency, content creation, freelancing" },
      { id: "difficulty", label: "Preferred Difficulty", type: "select", options: ["Easy", "Moderate", "Aggressive"] }
    ],
    promptTemplate: "Here's a personalized 3-task plan for daily growth in your {goal} goal, tailored to the {industry} niche and difficulty level: {difficulty}. Each task is concise, actionable, and designed for measurable progress.\n\nFor each of the 3 tasks, use this exact structure:\n\n**Task #[number] – [Task Headline]**\n\n**Objective:**\nWrite 1-2 lines explaining what success looks like for this task.\n\n**Steps:**\nProvide 2-3 actionable bullet points that break down how to complete the task.\n\n**Time Required:**\nGive a rough time estimate (e.g., 15 mins, 1 hour, 30 mins).\n\nAfter all 3 tasks, include:\n\n**Daily Motivation Quote:**\nProvide 1 short motivational quote relevant to the {goal} goal.\n\n**Reflection Prompt:**\nWrite 1 short self-question for accountability (e.g., 'What's one thing I did today that moved me closer to my goal?').\n\nDo not use emojis or slang like 'Yo,' 'stackin',' 'let's get it,' etc. Use short, precise sentences—sound like a focused productivity coach. Keep formatting clean with clear headers and bullet lists."
  },
  {
    id: "property-profiteer",
    title: "Property Profiteer",
    emoji: "🏠",
    category: "Hustle",
    description: "Analyse, pitch, and profit from any property deal",
    isPro: false,
    inputs: [
      { id: "objective", label: "Objective", type: "select", options: ["Buy to Let", "Flip", "Long-term Hold", "Commercial", "Development"] },
      { id: "propertyType", label: "Property Type", type: "text", placeholder: "e.g., 2-bed flat, commercial unit" },
      { id: "location", label: "Location", type: "text", placeholder: "City or area" },
      { id: "budget", label: "Budget Range", type: "text", placeholder: "e.g., £150k-£200k" },
      { id: "targetROI", label: "Target ROI", type: "text", placeholder: "e.g., 8% annual return" },
      { id: "extraContext", label: "Extra Context", type: "textarea", placeholder: "Any additional details about the deal..." }
    ],
    promptTemplate: "Here's a comprehensive property analysis for a {objective} strategy targeting {propertyType} in {location}, with a budget of {budget} and target ROI of {targetROI}.\n\nAdditional context: {extraContext}\n\nUse this exact structure:\n\n📊 **Property Summary**\nProvide a 2-3 sentence overview of the opportunity, location benefits, and property type.\n\n💰 **Financial Breakdown**\n- Purchase Price Range: Estimate based on {budget}\n- Expected Monthly Rental Income: Provide realistic figure\n- Annual Yield: Calculate percentage\n- Total Investment Required: Include purchase price, fees, and renovation costs\n- Break-Even Timeline: Estimate months/years to ROI\n\n🎯 **Deal Hooks**\nList 3-5 compelling selling points for this deal (e.g., location growth, rental demand, renovation potential).\n\n⚠️ **Risk Factors**\nIdentify 2-3 potential challenges or risks to consider.\n\n✅ **Next Steps**\nProvide 3-4 actionable steps to move forward with this deal.\n\nDo not use casual slang. Keep the tone professional and data-driven—like a property investment analyst's report. Format with clear emoji headers and bullet points for easy scanning."
  },
  {
    id: "inbox-influence",
    title: "Inbox Influence",
    emoji: "📧",
    category: "Content",
    description: "Turn your ideas into addictive newsletters",
    isPro: false,
    inputs: [
      { id: "topic", label: "Topic", type: "text", placeholder: "This week's newsletter topic" },
      { id: "audience", label: "Audience", type: "text", placeholder: "Who you're writing for" },
      { id: "goal", label: "Goal", type: "select", options: ["Educate", "Entertain", "Sell", "Build Trust", "Drive Traffic"] },
      { id: "tone", label: "Tone", type: "select", options: ["Professional", "Conversational", "Humorous", "Inspirational", "Direct"] },
      { id: "ctaLink", label: "CTA Link (optional)", type: "text", placeholder: "Where should readers go?" }
    ],
    promptTemplate: "Here's a complete newsletter draft about {topic}, written for {audience} with the goal to {goal}, using a {tone} tone.\n\nUse this exact structure:\n\n**📬 Subject Line**\nWrite 3 compelling subject line options (under 50 characters each).\n\n**🪝 Hook Line**\nProvide a 1-2 sentence opening that immediately grabs attention.\n\n**📖 Opening**\nWrite a 2-3 paragraph intro that connects with the reader and sets up the topic.\n\n**💡 Main Section**\nDeliver the core content in 3-5 structured points, tips, or insights. Keep it scannable with subheadings and short paragraphs.\n\n**🎯 Call to Action**\nWrite a persuasive CTA that directs readers to {ctaLink}. Keep it natural and benefit-focused.\n\n**✨ P.S.**\nAdd a personal touch or bonus insight that leaves a lasting impression.\n\nDo not use excessive emojis within the body text. Keep the writing tight, engaging, and formatted for email—think newsletter pro, not blog post. Use clear sections with spacing for readability."
  },
  {
    id: "authority-builder",
    title: "Authority Builder",
    emoji: "📚",
    category: "Brand",
    description: "Generate 10,000+ word ebooks automatically",
    isPro: false,
    inputs: [
      { id: "topic", label: "Ebook Topic", type: "textarea", placeholder: "e.g., Social Media Marketing & Automation for Small Businesses" },
      { id: "audience", label: "Target Audience", type: "text", placeholder: "e.g., small business owners, freelancers, agency builders" },
      { id: "voice", label: "Tone / Voice", type: "select", options: ["Authoritative", "Educational", "Conversational", "Inspirational"] },
      { id: "includeCTA", label: "Include Call-to-Action?", type: "select", options: ["Yes", "No"] }
    ],
    promptTemplate: "SECTION_TYPE: {sectionType}\n\nGenerate {sectionType} for an ebook about {topic}, targeting {audience}, in a {voice} tone.\n\n{sectionInstructions}"
  },
  {
    id: "hustle-sprint",
    title: "30-Day Hustle Sprint",
    emoji: "🏃",
    category: "Productivity",
    description: "Your personalized 30-day action plan to grow any hustle",
    isPro: false,
    inputs: [
      { id: "goal", label: "Goal", type: "text", placeholder: "What you want to achieve" },
      { id: "skillLevel", label: "Skill Level", type: "select", options: ["Beginner", "Intermediate", "Advanced"] },
      { id: "timeCommitment", label: "Time Commitment", type: "select", options: ["1 hour/day", "2-3 hours/day", "4+ hours/day"] },
      { id: "focusArea", label: "Focus Area", type: "select", options: ["Content Creation", "Sales/Revenue", "Audience Growth", "Skill Building", "Product Launch"] }
    ],
    promptTemplate: "Here's a detailed 30-day action plan to achieve: {goal}. Designed for {skillLevel} level, with {timeCommitment} daily commitment, focusing on {focusArea}.\n\nUse this exact structure:\n\n**🎯 Overview**\nWrite 2-3 paragraphs explaining the strategy, expected outcomes, and success metrics for this 30-day sprint.\n\n**📅 Weekly Breakdown**\n\n**Week 1: Foundation**\nFocus: [Theme]\nObjective: [What to achieve this week]\nDaily Tasks:\n- Day 1: [Specific task] - Goal: [Measurable outcome]\n- Day 2: [Specific task] - Goal: [Measurable outcome]\n- Day 3: [Specific task] - Goal: [Measurable outcome]\n- Day 4: [Specific task] - Goal: [Measurable outcome]\n- Day 5: [Specific task] - Goal: [Measurable outcome]\n- Day 6: [Specific task] - Goal: [Measurable outcome]\n- Day 7: [Review/reflection task]\nKey KPIs: [Metrics to track]\n\n**Week 2: Momentum**\n[Same structure as Week 1]\n\n**Week 3: Scale**\n[Same structure as Week 1]\n\n**Week 4: Optimization**\n[Same structure as Week 1]\n\n**📊 Success Metrics**\nDefine 3-5 clear KPIs to measure progress throughout the 30 days.\n\n**🎉 Final Summary**\nWrite 2-3 paragraphs about expected transformation, lessons learned, and next steps after completing the sprint.\n\nDo not use emojis within task descriptions. Keep language direct and action-oriented—think productivity coach meets business strategist. Format with clear weekly sections and daily breakdowns for easy tracking."
  }
];
