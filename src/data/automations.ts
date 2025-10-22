import { AutomationTool } from "@/types/automation";

export const automations: AutomationTool[] = [
  {
    id: "logo-maker",
    title: "Logo Maker",
    emoji: "🎨",
    category: "Brand",
    description: "Generate professional logos instantly with AI",
    isPro: false,
    kbRequirement: "none",
    inputs: [
      { id: "businessName", label: "Business Name", type: "text", placeholder: "e.g., FitFlow Studio", required: true },
      { id: "tagline", label: "Tagline (Optional)", type: "text", placeholder: "e.g., Move Better, Feel Better", required: false },
      { id: "brandStyle", label: "Brand Style", type: "select", options: ["Minimalist", "Modern Tech", "Luxury / Premium", "Bold & Playful", "Clean & Professional"], defaultValue: "Clean & Professional", required: true },
      { id: "colorPalette", label: "Color Palette (Optional)", type: "text", placeholder: "e.g., blue and white, gold and black", required: false },
      { id: "iconPreference", label: "Icon Preference (Optional)", type: "text", placeholder: "e.g., lightning bolt, shopping cart, brain", required: false },
      { id: "outputFormat", label: "Output Format", type: "select", options: ["Square Logo", "Horizontal Logo", "Icon Only"], defaultValue: "Square Logo", required: true }
    ],
    promptTemplate: ""
  },
  {
    id: "bookforge",
    title: "BookForge Cover Maker",
    emoji: "📖",
    category: "Brand",
    description: "Generate professional ebook covers from scratch or for your saved ebooks",
    isPro: false,
    kbRequirement: "none",
    inputs: [
      { id: "ebookSource", label: "Ebook Source", type: "select", options: ["Create New", "From My Hustles"], defaultValue: "Create New" },
      { id: "coverTitle", label: "Cover Title", type: "text", placeholder: "Your Ebook Title", required: true },
      { id: "author", label: "Author Name", type: "text", placeholder: "Your Name", required: false },
      { id: "topic", label: "Topic/Theme", type: "text", placeholder: "e.g., Social Media Marketing", required: true },
      { id: "audience", label: "Target Audience", type: "text", placeholder: "e.g., entrepreneurs", required: false },
      { id: "voice", label: "Style", type: "select", options: ["Professional", "Modern", "Minimalist", "Bold", "Elegant"], defaultValue: "Professional" }
    ],
    promptTemplate: ""
  },
  {
    id: "digital-product-generator",
    title: "Digital Product Generator",
    emoji: "🎓",
    category: "Brand",
    description: "Generate complete digital products: full ebooks, mini guides, or structured courses with AI",
    isPro: true,
    kbRequirement: "optional",
    inputs: [
      { id: "productType", label: "Product Type", type: "select", options: ["Full Ebook", "Mini Guide", "Online Course"], defaultValue: "Full Ebook", required: true },
      { id: "topic", label: "Topic", type: "textarea", placeholder: "e.g., Social Media Marketing & Automation for Small Businesses", required: true },
      { id: "audience", label: "Target Audience", type: "text", placeholder: "e.g., small business owners, freelancers", required: true },
      { id: "voice", label: "Tone / Voice", type: "select", options: ["Authoritative", "Conversational", "Educational", "Inspirational"], defaultValue: "Authoritative", required: true },
      { id: "includeCTA", label: "Include CTA", type: "toggle", defaultValue: true, required: false }
    ],
    promptTemplate: "Generate {productType} content for {topic}, targeting {audience}, in a {voice} tone."
  },
  {
    id: "trend-finder",
    title: "Trend Finder 2.0",
    emoji: "🔥",
    category: "Content",
    description: "Discover what's blowing up on TikTok & IG right now",
    isPro: false,
    kbRequirement: "optional",
    inputs: [
      { id: "niche", label: "Niche / Category", type: "text", placeholder: "e.g., fitness supplements, local plumbers", required: true },
      { id: "region", label: "Region", type: "text", placeholder: "e.g., UK / US / Global", defaultValue: "Global", required: false },
      { id: "platform", label: "Platform", type: "multiselect", options: ["TikTok", "Instagram", "YouTube Shorts"], defaultValue: "TikTok", required: false },
      { id: "timeRange", label: "Time Range", type: "select", options: ["24h", "7d", "30d"], defaultValue: "7d", required: false },
      { id: "maxResults", label: "Max Results", type: "number", placeholder: "10", defaultValue: 10, required: false, min: 1, max: 20 }
    ],
    promptTemplate: "List {maxResults} trending content ideas for {platform} in the {niche} niche, region: {region}, time range: {timeRange}. For each trend, include: Trend Name, Why It Works, Example Hook, and Caption Strategy. Format with clear headings and bullet points. Do not use any emojis in the output."
  },
  {
    id: "faceless-script",
    title: "Faceless Script Forge",
    emoji: "🎬",
    category: "Content",
    description: "Generate viral scripts for faceless TikTok pages",
    isPro: false,
    kbRequirement: "required",
    inputs: [
      { id: "objective", label: "Script Objective", type: "select", options: ["Sales", "Brand", "Education", "Viral"], required: true },
      { id: "niche", label: "Niche / Product", type: "text", placeholder: "e.g., teeth whitening strips", required: true },
      { id: "targetLength", label: "Target Length (sec)", type: "number", placeholder: "30", defaultValue: 30, options: ["15", "30", "60"], required: true },
      { id: "tone", label: "Tone", type: "select", options: ["Direct", "Humorous", "Educational"], defaultValue: "Direct", required: false },
      { id: "hookStyle", label: "Hook Style", type: "select", options: ["Shock", "Curiosity", "Benefit"], required: false },
      { id: "includeCameraDirections", label: "Include Camera Directions?", type: "toggle", defaultValue: false, required: false }
    ],
    promptTemplate: "Here are 3 faceless TikTok script ideas for {objective} in the {niche} niche, {targetLength} seconds long, with a {tone} tone and {hookStyle} hook style.\n\nFor each script, use this exact structure:\n\nScript Title\nConcept – A short 1-2 line explanation of the video concept.\nNarration – Write the full voiceover script as it would be spoken.\nVisuals – Provide a bullet list describing each scene or visual element.\nCTA – Include an example closing call-to-action or hook.\n\nDo not use emojis. Do not use casual slang like 'boujee,' 'fire,' 'lit,' etc. Keep the tone minimal, clean, and confident—like it was written by a professional creator strategist. Use clear headings and proper formatting."
  },
  {
    id: "biz-idea",
    title: "Biz-Idea Reactor",
    emoji: "💡",
    category: "Hustle",
    description: "Find your next £10K side hustle",
    isPro: false,
    kbRequirement: "optional",
    inputs: [
      { id: "interests", label: "Interests / Skills", type: "text", placeholder: "e.g., copywriting, woodworking", required: true },
      { id: "budgetRange", label: "Budget Range", type: "text", placeholder: "£0-£500", required: false },
      { id: "timeToLaunch", label: "Time to Launch", type: "select", options: ["7d", "14d", "30d"], required: false },
      { id: "preferredMonetization", label: "Preferred Monetization", type: "multiselect", options: ["Products", "Services", "Subscription", "Ads"], required: false },
      { id: "scaleGoal", label: "Scale Goal", type: "text", placeholder: "£10k/month", required: false }
    ],
    promptTemplate: "Generate 3 unique business ideas based on {interests}, budget: {budgetRange}, launch time: {timeToLaunch}, monetization: {preferredMonetization}, scale goal: {scaleGoal}. For each idea, include: Concept, How to Start, Monetisation Path."
  },
  {
    id: "dropship-goldmine",
    title: "Dropship Goldmine",
    emoji: "📦",
    category: "Store",
    description: "Trending products that actually sell",
    isPro: false,
    kbRequirement: "optional",
    inputs: [
      { id: "category", label: "Category", type: "text", placeholder: "e.g., home gadgets, fitness", required: true },
      { id: "targetPriceRange", label: "Target Price Range", type: "text", placeholder: "£5–£50", required: false },
      { id: "marginGoal", label: "Margin Goal (%)", type: "number", placeholder: "30", required: false, min: 10, max: 90 },
      { id: "preferredSuppliers", label: "Preferred Suppliers", type: "multiselect", options: ["AliExpress", "CJ", "Alibaba"], required: false },
      { id: "platform", label: "Platform", type: "select", options: ["Shopify", "Etsy", "Amazon"], required: false }
    ],
    promptTemplate: "Here are 5 trending products in the {category} category, price range: {targetPriceRange}, margin goal: {marginGoal}%, suppliers: {preferredSuppliers}, platform: {platform}.\n\nFor each product, use this exact structure:\n\nProduct Name\nWhy it's trending: Provide 2-3 sentences explaining the trend or consumer behaviour driving demand.\nAd Hook Idea: Write 1 short viral-style line suitable for TikTok or Reels.\nContent Angle: Describe in 1-2 sentences what type of video or ad works best for this product.\nPositioning Tip: Write 1 line explaining what emotion or benefit to highlight when selling this product.\n\nKeep each product description under 120 words. Do not use emojis. Do not use casual slang. Keep the tone professional and strategic."
  },
  {
    id: "ad-copy-lab",
    title: "Ad Copy & Creative Lab",
    emoji: "✨",
    category: "Ads",
    description: "Make ads hit different",
    isPro: false,
    kbRequirement: "required",
    inputs: [
      { id: "objective", label: "Campaign Objective", type: "select", options: ["Awareness", "Traffic", "Conversions", "Leads"], required: true },
      { id: "product", label: "Product / Offer Name", type: "text", placeholder: "Your product/offer", required: true },
      { id: "primaryBenefit", label: "Primary Benefit", type: "text", placeholder: "1-line value prop", required: true },
      { id: "audience", label: "Audience / ICP", type: "text", placeholder: "Target audience", required: false },
      { id: "adFormat", label: "Ad Format", type: "multiselect", options: ["Image", "Video", "Carousel"], required: false },
      { id: "characterLimit", label: "Length / Character Limit", type: "number", placeholder: "Optional", required: false, min: 50, max: 1000 }
    ],
    promptTemplate: "Here are 3 ad copy variations for {product} ({primaryBenefit}), objective: {objective}, targeting {audience}, format: {adFormat}, character limit: {characterLimit}. Each includes a headline, caption, creative idea, and CTA suggestion.\n\nFor each variation, use this exact structure:\n\nAd Concept Title\nHeadline – Write a direct, catchy headline in 5-8 words.\nCaption – Write 2-3 lines following this flow: problem → solution → benefit.\nCreative Concept – Provide 1-2 sentences describing the visual approach or ad angle.\nCTA Example – Write a single actionable line.\n\nDo not use emojis. Use clear, strategic language—think ad strategist. Format with bold section headers and proper line spacing for readability."
  },
  {
    id: "ad-funnel",
    title: "Ad Funnel Copy Writer",
    emoji: "🚀",
    category: "Ads",
    description: "Complete funnel from scroll-stop to sale",
    isPro: false,
    kbRequirement: "required",
    inputs: [
      { id: "funnelType", label: "Funnel Type", type: "select", options: ["Lead magnet → Nurture → Sale", "Tripwire", "Webinar funnel"], required: true },
      { id: "topHook", label: "Top-of-Funnel Hook", type: "text", placeholder: "Optional", required: false },
      { id: "product", label: "Core Offer", type: "text", placeholder: "Your offer", required: true },
      { id: "audience", label: "Target Audience", type: "text", placeholder: "Who you're targeting", required: true },
      { id: "proof", label: "Primary Proof / Testimonial", type: "textarea", placeholder: "Optional testimonial or proof", required: false },
      { id: "cta", label: "Desired CTA", type: "text", placeholder: "Your call-to-action", required: true },
      { id: "trafficSource", label: "Traffic Source", type: "select", options: ["Facebook", "Google", "Organic"], required: false }
    ],
    promptTemplate: "Here's a complete {funnelType} framework for {product}, targeting {audience}, traffic source: {trafficSource}, with top hook: {topHook}, proof: {proof}, CTA: {cta}.\n\nUse this exact structure:\n\nGoal Summary\nWrite 1-2 lines describing the funnel objective and target outcome.\n\nHook Ideas (Top of Funnel)\nProvide 3-5 strong opening lines designed for the ad.\n\nAd Copy (Middle of Funnel)\nWrite 1-2 paragraph options focused on: problem → solution → result.\n\nCreative Direction\nProvide 2-3 ideas for what the ad should visually show.\n\nLanding Page Copy (Bottom of Funnel)\n- Headline\n- Subheadline\n- Bullet Points: 3-5 key features/benefits\n- CTA Line\n\nDo not use emojis. Keep the writing clean, persuasive, and conversion-focused."
  },
  {
    id: "hook-factory",
    title: "Hook Factory",
    emoji: "🪝",
    category: "Content",
    description: "Scroll-stopping first lines that convert",
    isPro: false,
    kbRequirement: "optional",
    inputs: [
      { id: "context", label: "Context / Topic", type: "text", placeholder: "What the hook is for", required: true },
      { id: "emotion", label: "Emotion / Angle", type: "select", options: ["Curiosity", "Urgency", "Fear-of-missing-out", "Humor"], required: false },
      { id: "maxLength", label: "Max Length (words)", type: "number", placeholder: "10", defaultValue: 10, required: false, min: 5, max: 20 },
      { id: "targetPlatform", label: "Target Platform", type: "select", options: ["TikTok", "Instagram", "YouTube", "Twitter"], required: false }
    ],
    promptTemplate: "Here are 10 short viral hook ideas for {context}, emotion: {emotion}, max length: {maxLength} words, platform: {targetPlatform}, designed to capture attention in under 3 seconds.\n\nFormat as a clean numbered list. Each hook should be {maxLength} words maximum.\n\nOptionally, you may divide the hooks into sub-sections such as:\n- Problem Hooks (addressing pain points)\n- Benefit Hooks (highlighting outcomes)\n- Curiosity Hooks (creating intrigue)\n\nDo not use emojis. Do not use casual phrases. Keep the tone concise, persuasive, and ad-style—like a conversion copywriter's deliverable."
  },
  {
    id: "offer-builder",
    title: "Offer Builder",
    emoji: "🎁",
    category: "Hustle",
    description: "Craft irresistible offers people can't ignore",
    isPro: false,
    kbRequirement: "required",
    inputs: [
      { id: "coreProduct", label: "Core Product", type: "text", placeholder: "What you're selling", required: true },
      { id: "price", label: "Price / Pricing Options", type: "text", placeholder: "e.g., £99 or £99/month", required: true },
      { id: "bonuses", label: "Desired Bonuses", type: "textarea", placeholder: "List bonuses (comma-separated)", required: false },
      { id: "guarantee", label: "Guarantee", type: "text", placeholder: "e.g., 30-day money back", required: false },
      { id: "urgency", label: "Scarcity / Urgency Mechanic", type: "text", placeholder: "Optional urgency element", required: false },
      { id: "primaryAudience", label: "Primary Audience", type: "text", placeholder: "Target audience", required: false }
    ],
    promptTemplate: "Here's an irresistible offer breakdown for {coreProduct}, price: {price}, bonuses: {bonuses}, guarantee: {guarantee}, urgency: {urgency}, audience: {primaryAudience}.\n\nUse this exact structure:\n\n**Offer Name**\nProvide a short, catchy, brandable name for the offer.\n\n**Positioning Angle**\nWrite 1 sentence defining what makes this offer unique or transformative.\n\n**What's Included (Main Offer)**\nList 3-5 bullet points focused on benefits, not features. Emphasize outcomes and value.\n\n**Bonus Add-Ons**\nSuggest extras that amplify perceived value.\n\n**Urgency Line / Scarcity Prompt**\nWrite one short sentence encouraging immediate action.\n\nDo not use emojis. Keep the tone confident, clean, and persuasive."
  },
  {
    id: "page-builder",
    title: "Page & Profile Builder",
    emoji: "📱",
    category: "Brand",
    description: "Full brand setup from username to content pillars",
    isPro: false,
    kbRequirement: "required",
    inputs: [
      { id: "platform", label: "Platform", type: "select", options: ["Instagram", "TikTok", "LinkedIn", "Website landing"], required: true },
      { id: "profileType", label: "Profile Type", type: "select", options: ["Personal", "Brand", "Business"], required: true },
      { id: "primaryCTA", label: "Primary CTA", type: "text", placeholder: "Your main call-to-action", required: true },
      { id: "mainOffer", label: "Main Offer / Tagline", type: "text", placeholder: "Your offer/tagline", required: true }
    ],
    promptTemplate: "Here's a full profile setup for a {profileType} on {platform}, CTA: {primaryCTA}, offer: {mainOffer}.\n\nUse this exact structure:\n\n**Username Ideas**\nProvide 3-5 relevant and memorable username suggestions.\n\n**Bio Examples**\nWrite 2-3 bio options formatted and optimized for {platform}.\n\n**Tone & Personality Notes**\nProvide 1-2 lines describing how the brand should sound.\n\n**Content Pillars**\nList 3 main content categories this brand should focus on.\n\n**Posting Strategy**\nOutline the best posting frequency, content formats, and engagement approach for {platform}.\n\nDo not use emojis. Keep the tone simple, confident, and structured."
  },
  {
    id: "name-forge",
    title: "Name Forge",
    emoji: "⚡",
    category: "Brand",
    description: "Catchy brand names that sound Gen-Z-approved",
    isPro: false,
    kbRequirement: "optional",
    inputs: [
      { id: "industry", label: "Industry / Niche", type: "text", placeholder: "Your industry", required: true },
      { id: "brandTone", label: "Brand Tone", type: "select", options: ["Playful", "Premium", "Professional", "Edgy"], required: false },
      { id: "lengthPreference", label: "Length Preference", type: "select", options: ["Short (1–2 syllables)", "Medium", "Descriptive"], required: false },
      { id: "avoidWords", label: "Avoid Words", type: "text", placeholder: "Comma-separated", required: false },
      { id: "checkDomain", label: "Check Domain?", type: "toggle", defaultValue: false, required: false }
    ],
    promptTemplate: "Here are 5 brand name ideas for {industry}, tone: {brandTone}, length: {lengthPreference}, avoid: {avoidWords}. Each name includes a short explanation and tagline suggestion.\n\nUse this exact structure for each name:\n\n**Name #[number] – [Name]**\n\n**Meaning / Concept:** Write 1-2 sentences explaining the name origin.\n\n**Tagline Suggestion:** Provide one catchy phrase.\n\n**Why It Works:** Write a short reasoning.\n\nDo not use slang or emojis. Write in a confident, brand-consultant style."
  },
  {
    id: "content-to-cash",
    title: "Content-to-Cash Ideas",
    emoji: "💰",
    category: "Hustle",
    description: "Content ideas that entertain AND sell",
    isPro: false,
    kbRequirement: "optional",
    inputs: [
      { id: "primaryFormat", label: "Primary Content Format", type: "multiselect", options: ["Video", "Thread", "Newsletter", "Blog"], required: true },
      { id: "monetizationPath", label: "Monetization Path", type: "select", options: ["Product", "Membership", "Course", "Affiliate"], required: false },
      { id: "audience", label: "Audience", type: "text", placeholder: "Target audience", required: true },
      { id: "frequency", label: "Frequency", type: "select", options: ["Daily", "Weekly", "Monthly"], required: false }
    ],
    promptTemplate: "Here are 5 content ideas for {primaryFormat}, monetization: {monetizationPath}, audience: {audience}, frequency: {frequency}.\n\nFor each content idea, use this exact structure:\n\n**Idea Title**\n**Concept:**\n**Hook Example:**\n**Format Suggestion:**\n**Monetisation Angle:**\n\nDo not use slang or emojis. Keep it creative but professional."
  },
  {
    id: "daily-planner",
    title: "Daily Hustle Planner",
    emoji: "📋",
    category: "Productivity",
    description: "3 daily tasks to level up your hustle",
    isPro: false,
    kbRequirement: "optional",
    inputs: [
      { id: "priority1", label: "Priority 1", type: "text", placeholder: "Your top priority", required: true },
      { id: "priority2", label: "Priority 2", type: "text", placeholder: "Second priority", required: true },
      { id: "priority3", label: "Priority 3", type: "text", placeholder: "Third priority", required: true },
      { id: "timeAvailable", label: "Time Available (hrs)", type: "number", placeholder: "Hours available", required: false, min: 1, max: 24 },
      { id: "focusTheme", label: "Focus Theme", type: "select", options: ["Growth", "Product", "Systems", "Learning"], required: false }
    ],
    promptTemplate: "Here's a personalized 3-task plan for today focusing on: {priority1}, {priority2}, {priority3}. Time available: {timeAvailable} hours, focus theme: {focusTheme}.\n\nFor each of the 3 tasks, use this exact structure:\n\n**Task #[number] – [Task Headline]**\n**Objective:**\n**Steps:**\n**Time Required:**\n**Progress Metric:**\n\nAfter all 3 tasks, include:\n\n**Daily Motivation Quote:**\n**Reflection Prompt:**\n\nDo not use emojis or slang. Use short, precise sentences."
  },
  {
    id: "business-validator",
    title: "Business Validator",
    emoji: "✅",
    category: "Hustle",
    description: "Validate your business idea with expert analysis, next steps, and improvement suggestions",
    isPro: false,
    kbRequirement: "optional",
    inputs: [
      { id: "businessIdea", label: "Business Idea", type: "textarea", placeholder: "Describe your business idea in detail", required: true },
      { id: "targetMarket", label: "Target Market", type: "text", placeholder: "e.g., UK fitness enthusiasts, US small businesses", required: true },
      { id: "currentStage", label: "Current Stage", type: "select", options: ["Just an idea", "Early research", "MVP ready", "Already launched"], required: true },
      { id: "budgetRange", label: "Budget Available", type: "text", placeholder: "e.g., £0-£1000", required: false },
      { id: "timeframe", label: "Launch Timeframe", type: "select", options: ["1 month", "3 months", "6 months", "12+ months"], required: false },
      { id: "concernsOrChallenges", label: "Main Concerns/Challenges", type: "textarea", placeholder: "What are you worried about or stuck on?", required: false }
    ],
    promptTemplate: "Validate this business idea: {businessIdea}\n\nTarget Market: {targetMarket}\nCurrent Stage: {currentStage}\nBudget: {budgetRange}\nTimeframe: {timeframe}\nConcerns: {concernsOrChallenges}\n\nProvide a comprehensive validation analysis with the following sections:\n\n**Validation Score (1-10)**\nRate the overall viability of this idea and explain the score.\n\n**Market Opportunity Analysis**\nAssess the target market, competition, and timing.\n\n**Strengths & Opportunities**\nHighlight what's working well and potential opportunities.\n\n**Weaknesses & Risks**\nIdentify gaps, challenges, and potential pitfalls.\n\n**Improvement Suggestions**\nProvide 3-5 specific, actionable ways to strengthen this idea.\n\n**Next Steps (30-90 Days)**\nCreate a prioritized action plan with:\n- Week 1-2 actions\n- Month 1 milestones\n- Months 2-3 goals\n\n**Key Metrics to Track**\nSuggest 3-5 metrics to measure progress and validate assumptions.\n\nKeep the tone constructive, honest, and actionable. Format with clear sections and bullet points."
  },
  {
    id: "inbox-influence",
    title: "Inbox Influence (Newsletter)",
    emoji: "📧",
    category: "Content",
    description: "Weekly newsletter that builds authority and sells",
    isPro: false,
    kbRequirement: "required",
    inputs: [
      { id: "issueTopic", label: "Issue Topic", type: "text", placeholder: "Topic for this issue", required: true },
      { id: "audienceSegment", label: "Audience Segment", type: "text", placeholder: "Optional segment", required: false },
      { id: "goal", label: "Goal", type: "select", options: ["Educate", "Sell", "Nurture", "Announce"], required: true },
      { id: "tone", label: "Tone", type: "select", options: ["Warm", "Direct", "Educational"], required: false },
      { id: "subjectLineOptions", label: "Subject Line Options", type: "number", placeholder: "3", defaultValue: 3, required: false, min: 1, max: 10 },
      { id: "ctaURL", label: "CTA URL", type: "url", placeholder: "Optional CTA link", required: false }
    ],
    promptTemplate: `You are HustleHub's Inbox Influence engine. Generate a newsletter that meets the following standards:

PURPOSE & AUDIENCE
Issue Topic: {issueTopic}
Audience Segment: {audienceSegment}
Goal: {goal}
Tone: {tone}
CTA URL: {ctaURL}

If a Knowledge Base is attached, automatically surface 2–3 brand/product facts from the KB and use them naturally in the copy.

OUTPUTS REQUIRED (deliver all in one response):
1. {subjectLineOptions} subject line options (30–60 characters preferred)
2. 1 preheader (30–120 characters)
3. Plain-text email body with:
   - Short Title line
   - Opening Hook (1–2 lines)
   - 3 content sections (each 2–4 short paragraphs or 3–5 bullets)
   - One short, direct CTA line that can be used as button text
   - A P.S. with urgency or secondary CTA
   - Professional sign-off
4. HTML snippet (simple, responsive, single-column) with H1/H2, paragraphs, button markup for CTA (include UTM parameters: ?utm_source=newsletter&utm_medium=email&utm_campaign={{campaign_slug}})
5. 3 subject A/B test pairs (subject A vs subject B with rationale)
6. Suggested send time(s) for audience (e.g., Tue/Thu 9–11am) with reason
7. 1 quick metric to track (CTR/CTO/Reply rate) with target
8. Short follow-up plan (2 follow-up email subjects + purpose)

LENGTH & TONE
Total body: 220–500 words. Tone must match {tone}. No fluff.

STRUCTURE RULES (mandatory):
- Include at least one mini-proof: case study, stat, or testimonial
- Use personalization tokens: {{{{first_name}}}}, {{{{company}}}}, {{{{kb.brand_name}}}} in at least 2 places
- Provide button text variants (3–5 words) and full CTA URL with UTM parameters
- Add preheader that complements subject lines
- End with PS line adding urgency or free offer

CONVERSION DETAILS:
- When Goal = Sell: include value stack (price, bonuses, guarantee, scarcity)
- When Goal = Educate/Nurture: include one actionable checklist item
- Always include clear, trackable CTA and alternate action (reply for more info)

A/B TESTING:
- Output at least two subject variants (Curiosity vs Urgency; Social Proof vs Benefit)
- Provide simple A/B test plan (10–20% seed, KPI: CTR, 24–48h test)

DELIVERABLE FORMAT (JSON object):
{{
  "subject_options": [str,...],
  "preheader": str,
  "plain_text": str,
  "html_snippet": str,
  "cta_button_text_options": [str,...],
  "cta_full_url": str,
  "ab_test_pairs": [{{"a": str, "b": str, "reason": str}}, ...],
  "send_time_suggestion": str,
  "metric_to_track": str,
  "follow_up_plan": [{{"delay_days": int, "subject": str, "purpose": str}}, ...],
  "used_kb_facts": [str,...],
  "generation_notes": str
}}

QUALITY CONTROLS:
- Remove filler words and AI disclaimers
- No emojis in subject lines unless Tone requests
- No Markdown tokens (**, #) in final outputs
- Verify CTA URL in both plain_text and html_snippet

ACCEPTANCE TESTS:
- Word count 220–500
- Exactly {subjectLineOptions} subject options
- Preheader 30–120 chars
- cta_full_url contains utm_source=newsletter
- follow_up_plan has at least 2 follow-ups

If KB not attached and critical facts missing, use {{{{placeholder}}}} tokens and note in generation_notes.`
  },
  {
    id: "hustle-sprint",
    title: "30-Day Hustle Sprint",
    emoji: "🏃",
    category: "Productivity",
    description: "30-day action plan to launch your hustle",
    isPro: false,
    kbRequirement: "optional",
    inputs: [
      { id: "goalProject", label: "Goal / Project Name", type: "text", placeholder: "Your 30-day goal", required: true },
      { id: "skillLevel", label: "Skill Level", type: "select", options: ["Beginner", "Intermediate", "Pro"], required: true },
      { id: "hoursPerDay", label: "Hours per Day", type: "number", placeholder: "Hours you can commit", required: true, min: 1, max: 16 },
      { id: "primaryFocus", label: "Primary Focus", type: "select", options: ["Content", "Sales", "Product", "Systems"], required: true },
      { id: "startDate", label: "Start Date", type: "date", required: true },
      { id: "kpi1", label: "KPI 1", type: "text", placeholder: "First key metric", required: false },
      { id: "kpi2", label: "KPI 2", type: "text", placeholder: "Second key metric", required: false },
      { id: "kpi3", label: "KPI 3", type: "text", placeholder: "Third key metric", required: false }
    ],
    promptTemplate: "30-Day Hustle Sprint plan for {goalProject}, skill: {skillLevel}, {hoursPerDay} hours/day, focus: {primaryFocus}, start: {startDate}, KPIs: {kpi1}, {kpi2}, {kpi3}.\n\nProvide:\n- Week 1 Plan (Days 1-7)\n- Week 2 Plan (Days 8-14)\n- Week 3 Plan (Days 15-21)\n- Week 4 Plan (Days 22-30)\n- Milestones & Check-ins\n- Resources Needed\n\nFormat as a structured action plan with daily/weekly tasks."
  },
  {
    id: "social-post-crafter",
    title: "Social Media Post Crafter",
    emoji: "📱",
    category: "Content",
    description: "Turn any idea into a scroll-stopping post — in seconds",
    isPro: false,
    kbRequirement: "optional",
    inputs: [
      { id: "platform", label: "Platform", type: "select", options: ["TikTok", "Instagram", "Twitter/X", "LinkedIn", "Facebook"], required: true },
      { id: "topic", label: "Topic or Offer", type: "text", placeholder: "What's the post about?", required: true },
      { id: "tone", label: "Tone", type: "select", options: ["Casual", "Professional", "Storytelling", "Bold"], defaultValue: "Casual", required: true },
    ],
    promptTemplate: `Create a high-performing post for {platform} about {topic}, written in a {tone} voice.

Use this exact structure:

**Hustle Breakdown**
Explain the post strategy in 2-3 sentences. What makes this work for {platform}? What's the psychology behind it?

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

Do not use emojis in the output. Keep the tone sharp, strategic, and conversion-focused.`
  },
  {
    id: "comment-dm-engager",
    title: "Comment & DM Engager",
    emoji: "💬",
    category: "Hustle",
    description: "Reply smarter, close faster — every lead, every time",
    isPro: false,
    kbRequirement: "optional",
    inputs: [
      { id: "messageText", label: "Comment or DM Text", type: "textarea", placeholder: "Paste the comment or message you received", required: true },
      { id: "goal", label: "Goal", type: "select", options: ["Engage", "Nurture", "Sell"], defaultValue: "Engage", required: true },
      { id: "replyTone", label: "Tone", type: "select", options: ["Friendly", "Authoritative", "Persuasive"], defaultValue: "Friendly", required: true },
    ],
    promptTemplate: `Craft a strategic reply to this message: "{messageText}"

Goal: {goal}
Tone: {replyTone}

Use this exact structure:

**Hustle Breakdown**
Analyze the message in 2-3 sentences: What's the intent? What does the person need? What's the best play here?

**The Formula**
Break down the reply strategy:
- Response Pattern: [Explain the psychological approach]
- Value Hook: [What keeps them engaged or curious]
- Conversion Bridge: [How this moves them closer to the goal]

**Your Output**

**Primary Reply (aligned with goal: {goal}):**
[Write a natural, engaging reply that matches the {replyTone} tone — no fluff, just value and direction]

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

Do not use emojis in the output. Keep replies authentic, confident, and conversion-ready.`
  },
  {
    id: "viral-analytics-decoder",
    title: "Viral Analytics Decoder",
    emoji: "📈",
    category: "Productivity",
    description: "Drop a viral post — get its blueprint",
    isPro: false,
    kbRequirement: "optional",
    inputs: [
      { id: "postContent", label: "Post URL or Caption/Text", type: "textarea", placeholder: "Paste the viral post URL or full caption text", required: true },
      { id: "platform", label: "Platform", type: "select", options: ["TikTok", "Instagram", "Twitter", "YouTube"], required: true },
      { id: "objective", label: "Objective", type: "select", options: ["Learn", "Recreate", "Adapt to my brand"], defaultValue: "Learn", required: true },
    ],
    promptTemplate: `Analyze this viral post from {platform}: "{postContent}"

Objective: {objective}

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

Do not use emojis in the output. Keep the analysis strategic, tactical, and actionable.`
  },
  {
    id: "audiencemagnet",
    title: "Audience Magnet",
    emoji: "🎯",
    category: "Ads",
    description: "Find the exact audiences that convert, not just click. Analyze your niche and uncover high-intent audience segments with proven buying behavior.",
    isPro: true,
    kbRequirement: "optional",
    inputs: [
      { id: "niche", label: "Niche / Industry", type: "text", placeholder: "e.g., fitness supplements, SaaS tools", required: true },
      { id: "currentAudience", label: "Current Audience (if any)", type: "textarea", placeholder: "Describe your current targeting", required: false },
      { id: "productPrice", label: "Product Price Point", type: "text", placeholder: "e.g., £50, £500/month", required: false },
      { id: "objective", label: "Campaign Objective", type: "select", options: ["Awareness", "Consideration", "Conversions", "Leads"], defaultValue: "Conversions", required: true },
      { id: "platform", label: "Ad Platform", type: "select", options: ["Facebook/Instagram", "Google", "TikTok", "LinkedIn"], defaultValue: "Facebook/Instagram", required: true }
    ],
    promptTemplate: "Analyze and identify the most profitable audience segments for {niche} on {platform}, price point: {productPrice}, objective: {objective}, current audience: {currentAudience}.\n\nUse this exact structure:\n\n**Audience Segment Analysis**\n\n**Top 3 High-Intent Segments**\n\nFor each segment:\n\n**Segment #[number] – [Segment Name]**\n\n**Demographics:**\n- Age range\n- Gender split\n- Income level\n- Location focus\n\n**Psychographics:**\n- Pain points\n- Buying triggers\n- Online behavior patterns\n- Content they consume\n\n**Targeting Strategy:**\nProvide specific targeting parameters for {platform}:\n- Interest-based targets\n- Behavior-based targets\n- Lookalike strategies\n- Exclusion recommendations\n\n**Expected Performance:**\n- Estimated CPM range\n- Expected conversion rate\n- Why this segment converts\n\n**Creative Direction:**\nWhat messaging and visuals resonate with this audience?\n\n**Next Play**\n1. [First testing recommendation]\n2. [Budget allocation strategy]\n3. [Scaling approach once validated]\n\nDo not use emojis. Keep analysis data-driven and strategic."
  },
  {
    id: "budgetbooster",
    title: "Budget Booster",
    emoji: "📊",
    category: "Ads",
    description: "Turn ad spend into profit, not guesswork. Deep-dive into campaign metrics to slash wasted spend and amplify winners.",
    isPro: true,
    kbRequirement: "required",
    inputs: [
      { id: "campaignData", label: "Campaign Performance Data", type: "textarea", placeholder: "Paste key metrics: CTR, CPC, ROAS, conversions, etc.", required: true },
      { id: "monthlyBudget", label: "Monthly Ad Budget", type: "text", placeholder: "e.g., £2,000", required: true },
      { id: "currentROAS", label: "Current ROAS", type: "number", placeholder: "e.g., 2.5", required: false },
      { id: "targetROAS", label: "Target ROAS", type: "number", placeholder: "e.g., 4.0", required: false },
      { id: "platform", label: "Platform", type: "multiselect", options: ["Facebook", "Google", "TikTok", "Pinterest"], required: true }
    ],
    promptTemplate: "Analyze ad performance for {platform} campaigns, budget: {monthlyBudget}, current ROAS: {currentROAS}, target: {targetROAS}.\n\nCampaign data:\n{campaignData}\n\nUse this exact structure:\n\n**Performance Audit**\n\n**Current State Summary**\nProvide a 2-3 sentence analysis of overall account health.\n\n**Budget Waste Identification**\n\n**High-Priority Cuts:**\n- [Issue #1]: What's bleeding money and why\n- [Issue #2]: Underperforming segments/creatives\n- [Issue #3]: Technical waste (overlap, frequency, etc.)\n\n**Estimated Savings:** £[amount] per month\n\n**Optimization Roadmap**\n\n**Quick Wins (Week 1):**\n1. [Immediate action to reduce waste]\n2. [Bid or budget adjustment]\n3. [Creative or audience tweak]\n\n**Growth Moves (Week 2-4):**\n1. [Scaling strategy for winners]\n2. [New test recommendations]\n3. [Platform-specific optimization]\n\n**ROI Forecast**\nProjected ROAS after implementing changes: [X.X]\nProjected monthly profit increase: £[amount]\n\n**Tracking Checklist**\nList 3-5 metrics to monitor weekly.\n\n**Next Play**\n1. [First optimization to implement]\n2. [Testing framework to deploy]\n3. [Long-term scaling strategy]\n\nDo not use emojis. Keep analysis tactical and numbers-focused."
  },
  {
    id: "adanglegenius",
    title: "Ad Angle Genius",
    emoji: "💡",
    category: "Ads",
    description: "Craft angles that stop scrolls and drive sales. Generate fresh campaign hooks and messaging frameworks that cut through noise.",
    isPro: true,
    kbRequirement: "required",
    inputs: [
      { id: "product", label: "Product / Offer", type: "text", placeholder: "What you're selling", required: true },
      { id: "uniqueValue", label: "Unique Value Prop", type: "text", placeholder: "What makes it different", required: true },
      { id: "targetAudience", label: "Target Audience", type: "text", placeholder: "Who you're targeting", required: true },
      { id: "competitorAngles", label: "Competitor Angles (if known)", type: "textarea", placeholder: "What angles competitors use", required: false },
      { id: "adObjective", label: "Campaign Objective", type: "select", options: ["Brand awareness", "Traffic", "Conversions", "Retargeting"], defaultValue: "Conversions", required: true }
    ],
    promptTemplate: "Generate 5 unique ad campaign angles for {product} ({uniqueValue}), targeting {targetAudience}, objective: {adObjective}.\n\nCompetitor landscape:\n{competitorAngles}\n\nUse this exact structure:\n\n**Campaign Angles**\n\nFor each angle:\n\n**Angle #[number] – [Angle Name]**\n\n**Core Message:**\nWrite the primary positioning statement in one sentence.\n\n**Hook Strategy:**\nProvide 2-3 scroll-stopping opening lines.\n\n**Messaging Framework:**\n- Problem: [What pain does this address?]\n- Agitation: [Why it matters now]\n- Solution: [How your product solves it]\n- Proof: [What evidence/social proof to use]\n\n**Creative Direction:**\nDescribe the visual approach and content style.\n\n**Target Psychology:**\nWhat emotional trigger does this angle exploit?\n\n**Platform Fit:**\nBest suited for: [Facebook/Instagram/TikTok/YouTube]\n\n**CTA Strategy:**\nRecommended call-to-action approach.\n\n**Why This Angle Works:**\n1-2 sentences on the strategic reasoning.\n\n**Next Play**\n1. [First angle to test]\n2. [Creative brief for design team]\n3. [Scaling strategy if it works]\n\nDo not use emojis. Write like a creative strategist."
  },
  {
    id: "logomaker",
    title: "Logo Maker",
    emoji: "🎨",
    category: "Brand",
    description: "Brand identity that looks expensive, minus the agency bill. Generate professional logo concepts and complete brand kits in minutes.",
    isPro: true,
    kbRequirement: "recommended",
    inputs: [
      { id: "brandName", label: "Brand Name", type: "text", placeholder: "Your brand name", required: true },
      { id: "industry", label: "Industry / Niche", type: "text", placeholder: "e.g., fitness, SaaS, fashion", required: true },
      { id: "brandPersonality", label: "Brand Personality", type: "multiselect", options: ["Modern", "Minimalist", "Bold", "Playful", "Premium", "Tech", "Natural"], required: true },
      { id: "colorPreferences", label: "Color Preferences", type: "text", placeholder: "e.g., blue, green, or 'no preference'", required: false },
      { id: "logoType", label: "Logo Type", type: "select", options: ["Wordmark", "Icon + Text", "Icon Only", "No Preference"], defaultValue: "No Preference", required: false }
    ],
    promptTemplate: "Design a complete brand identity system for {brandName} in the {industry} space, personality: {brandPersonality}, colors: {colorPreferences}, logo type: {logoType}.\n\nUse this exact structure:\n\n**Brand Identity System**\n\n**Logo Concepts (3 options)**\n\nFor each concept:\n\n**Concept #[number] – [Concept Name]**\n\n**Visual Description:**\nDescribe the logo design in detail (shape, style, composition).\n\n**Symbolism:**\nExplain what the design represents and why it works for {brandName}.\n\n**Typography:**\n- Primary font: [Font name or style description]\n- Style notes: [Weight, spacing, character]\n\n**When to Use:**\nBest applications for this concept.\n\n**Color Palette**\n\n**Primary Colors:**\n- Color 1: [Name] – [Hex code] – [Usage: headers, CTAs, etc.]\n- Color 2: [Name] – [Hex code] – [Usage]\n\n**Secondary Colors:**\n- [Supporting colors with hex codes]\n\n**Neutral Colors:**\n- Background, text, borders\n\n**Color Psychology:**\nWhy this palette works for {industry} and {brandPersonality}.\n\n**Typography System**\n\n**Headings:** [Font recommendation]\n**Body Text:** [Font recommendation]\n**Accent/Display:** [Font recommendation]\n\n**Brand Applications**\n\n**Logo Usage Guidelines:**\n- Minimum size\n- Clear space requirements\n- Acceptable backgrounds\n- What NOT to do\n\n**Brand Touchpoints:**\nHow to use this identity across:\n- Website\n- Social media\n- Marketing materials\n- Packaging (if applicable)\n\n**Next Play**\n1. [First step: refine chosen concept]\n2. [Where to create final files]\n3. [How to implement across platforms]\n\nDo not use emojis. Write like a brand designer."
  },
  {
    id: "seooptimiser",
    title: "SEO Optimiser",
    emoji: "🔍",
    category: "Store",
    description: "Rank higher, sell faster, automate the boring stuff. Generate keyword-optimized product titles, descriptions, and meta tags that Google loves.",
    isPro: true,
    kbRequirement: "optional",
    inputs: [
      { id: "productName", label: "Product Name", type: "text", placeholder: "Your product", required: true },
      { id: "productCategory", label: "Product Category", type: "text", placeholder: "e.g., wireless earbuds, yoga mats", required: true },
      { id: "keyFeatures", label: "Key Features", type: "textarea", placeholder: "List main features (comma-separated)", required: true },
      { id: "targetKeywords", label: "Target Keywords (if known)", type: "text", placeholder: "Optional keywords you want to rank for", required: false },
      { id: "platform", label: "Platform", type: "select", options: ["Shopify", "Amazon", "Etsy", "WooCommerce", "General SEO"], defaultValue: "Shopify", required: true }
    ],
    promptTemplate: "Optimize SEO for {productName} in {productCategory} on {platform}, features: {keyFeatures}, target keywords: {targetKeywords}.\n\nUse this exact structure:\n\n**SEO Optimization Package**\n\n**Keyword Research**\n\n**Primary Keywords (High Intent):**\n- [Keyword 1] – Search volume estimate – Competition level\n- [Keyword 2]\n- [Keyword 3]\n\n**Secondary Keywords (Supporting):**\n- [5-7 related keywords]\n\n**Long-Tail Opportunities:**\n- [3-5 specific long-tail phrases]\n\n**Product Title Optimization**\n\n**Option 1 (Primary):**\n[SEO-optimized title with primary keyword front-loaded]\n\n**Option 2 (Alternative):**\n[Variation with different keyword emphasis]\n\n**Title Formula:**\n[Brand] + [Primary Keyword] + [Key Benefit] + [Differentiator]\n\n**Product Description (SEO-Optimized)**\n\n**Short Description (160 chars):**\n[Meta description / snippet]\n\n**Full Description:**\n\nWrite 2-3 paragraphs:\n- Opening: Lead with primary keyword and main benefit\n- Body: Naturally incorporate secondary keywords while highlighting features\n- Close: Include call-to-action with long-tail keyword\n\n**Bullet Points (Key Features):**\n- [Feature 1 with keyword]\n- [Feature 2 with keyword]\n- [Feature 3 with keyword]\n- [Feature 4]\n- [Feature 5]\n\n**Meta Tags**\n\n**Meta Title (60 chars max):**\n[Optimized for search results]\n\n**Meta Description (160 chars max):**\n[Compelling snippet that drives clicks]\n\n**Image Alt Text:**\n- Main image: [Description with keyword]\n- Secondary images: [3-4 alt text examples]\n\n**Platform-Specific Optimization**\n\nTailored recommendations for {platform}:\n- [Platform-specific field 1]\n- [Platform-specific field 2]\n- [Backend search terms or tags]\n\n**Content Enhancement**\n\n**FAQ Section (SEO Boost):**\n3-5 common questions with keyword-rich answers.\n\n**Next Play**\n1. [Implementation priority]\n2. [Tracking setup: Google Search Console, etc.]\n3. [Content refresh schedule]\n\nDo not use emojis. Keep content natural and conversion-focused."
  },
  {
    id: "storelayout",
    title: "Store Layout Wizard",
    emoji: "🏗️",
    category: "Store",
    description: "Layouts built to convert, not just look pretty. Get data-backed recommendations for product placement, checkout flows, and page structure.",
    isPro: true,
    kbRequirement: "optional",
    inputs: [
      { id: "storeType", label: "Store Type", type: "select", options: ["Fashion/Apparel", "Electronics", "Beauty/Cosmetics", "Home/Lifestyle", "Digital Products", "General"], required: true },
      { id: "averageOrderValue", label: "Average Order Value", type: "text", placeholder: "e.g., £50", required: false },
      { id: "conversionRate", label: "Current Conversion Rate (%)", type: "number", placeholder: "e.g., 2.5", required: false },
      { id: "platform", label: "Platform", type: "select", options: ["Shopify", "WooCommerce", "Custom", "BigCommerce"], defaultValue: "Shopify", required: true },
      { id: "targetDevice", label: "Primary Traffic Source", type: "select", options: ["Mobile", "Desktop", "Balanced"], defaultValue: "Mobile", required: true }
    ],
    promptTemplate: "Design conversion-optimized store layout for {storeType} on {platform}, AOV: {averageOrderValue}, current CR: {conversionRate}%, device: {targetDevice}.\n\nUse this exact structure:\n\n**Store Layout Strategy**\n\n**Homepage Architecture**\n\n**Above the Fold:**\n- Hero section: [What to feature]\n- Primary CTA: [Placement and copy]\n- Trust signals: [What to show]\n\n**Content Flow (scroll order):**\n1. [Section 1 with purpose]\n2. [Section 2]\n3. [Section 3]\n4. [Section 4]\n5. [Section 5]\n\n**Product Collection Pages**\n\n**Layout Recommendations:**\n- Grid structure: [2-col, 3-col, 4-col for different devices]\n- Filter placement: [Left sidebar / Top bar / Sticky]\n- Sort options: [What to include]\n- Product card design: [Key elements to show]\n\n**Conversion Boosters:**\n- Quick view functionality\n- Wishlist/save for later\n- Stock indicators\n- Social proof elements\n\n**Product Detail Pages**\n\n**Page Structure:**\n- Image gallery: [Layout and interaction]\n- Product info hierarchy: [Order of elements]\n- CTA placement: [Primary and secondary]\n- Trust elements: [Where to place badges, reviews, guarantees]\n\n**Essential Sections:**\n1. [Priority 1]\n2. [Priority 2]\n3. [Priority 3]\n\n**Cross-sell/Upsell Placement:**\nWhere and how to show related products.\n\n**Checkout Flow Optimization**\n\n**Funnel Structure:**\n- Single page vs multi-step: [Recommendation]\n- Field optimization: [What to ask for and when]\n- Trust signals: [Security badges, testimonials]\n- Exit intent: [Strategy for cart abandonment]\n\n**Mobile-Specific Optimizations**\n\n[If targetDevice is Mobile or Balanced:]\n- Thumb-friendly navigation\n- Simplified forms\n- Sticky CTAs\n- Mobile checkout improvements\n\n**Navigation & Menu Structure**\n\n**Primary Navigation:**\n- [Menu structure]\n- [Mega menu recommendations]\n\n**Secondary Navigation:**\n- Quick links\n- Utility items\n\n**Conversion Optimization Checklist**\n\n✓ [Critical element 1]\n✓ [Critical element 2]\n✓ [Critical element 3]\n✓ [Critical element 4]\n✓ [Critical element 5]\n\n**Expected Impact**\n\nProjected improvements:\n- Conversion rate: [X%] → [Y%]\n- AOV increase: [X%]\n- Bounce rate reduction: [X%]\n\n**Next Play**\n1. [First layout change to implement]\n2. [A/B test recommendation]\n3. [Performance tracking setup]\n\nDo not use emojis. Keep recommendations data-driven and platform-specific."
  },
  {
    id: "upsellcreator",
    title: "Upsell Creator",
    emoji: "💰",
    category: "Store",
    description: "Every order is an opportunity to double your revenue. Build strategic post-purchase offers, bundles, and cross-sells that feel natural.",
    isPro: true,
    kbRequirement: "required",
    inputs: [
      { id: "mainProduct", label: "Main Product", type: "text", placeholder: "The product being purchased", required: true },
      { id: "productPrice", label: "Product Price", type: "text", placeholder: "e.g., £50", required: true },
      { id: "relatedProducts", label: "Related Products (if any)", type: "textarea", placeholder: "List available products for bundling", required: false },
      { id: "upsellType", label: "Upsell Type", type: "multiselect", options: ["Post-purchase", "In-cart", "Product page", "Checkout"], required: true },
      { id: "averageOrderValue", label: "Current AOV", type: "text", placeholder: "e.g., £75", required: false }
    ],
    promptTemplate: "Create strategic upsell framework for {mainProduct} (£{productPrice}), current AOV: {averageOrderValue}, upsell placement: {upsellType}.\n\nAvailable products:\n{relatedProducts}\n\nUse this exact structure:\n\n**Upsell Strategy Framework**\n\n**Upsell Opportunities (5 strategies)**\n\nFor each strategy:\n\n**Strategy #[number] – [Strategy Name]**\n\n**Offer Type:**\n[Bundle / Upgrade / Add-on / Subscription / Extended warranty]\n\n**The Offer:**\nDescribe exactly what's being offered.\n\n**Pricing:**\n- Original: [Price breakdown]\n- Upsell price: [New price]\n- Perceived discount: [Value/savings]\n\n**Positioning:**\nHow to present this offer (copy approach).\n\n**Placement:**\nWhere in the funnel: {upsellType}\n\n**Copy Examples:**\n\n**Headline:**\n[Compelling offer headline]\n\n**Body:**\n[2-3 lines explaining value]\n\n**CTA:**\n[Button text]\n\n**Decline option:**\n[\"No thanks\" text that doesn't kill the vibe]\n\n**Psychology:**\nWhy this upsell works (impulse, completion, value stacking, etc.)\n\n**Expected Conversion Rate:**\n[Estimated take rate: X%]\n\n**Bundle Recommendations**\n\n**Bundle #1 – [Bundle Name]**\n- Products included: [List]\n- Individual price: £[X]\n- Bundle price: £[Y]\n- Savings: £[Z] ([X%] off)\n- Positioning: [Why this bundle makes sense]\n\n**Bundle #2 – [Bundle Name]**\n[Same structure]\n\n**Post-Purchase Sequence**\n\n[If upsellType includes \"Post-purchase\":]\n\n**Immediate Offer (Order confirmation page):**\nWhat to show right after purchase.\n\n**Follow-up Offer (Thank you email):**\nSecondary upsell in confirmation email.\n\n**Downsell Strategy:**\nIf customer declines main upsell, offer this instead.\n\n**AOV Impact Projection**\n\nIf [X%] of customers accept upsells:\n- New AOV: £[amount]\n- Revenue increase: [X%]\n- Monthly impact: £[amount]\n\n**Implementation Checklist**\n\n✓ [Technical setup step 1]\n✓ [Design/copy needed]\n✓ [Testing protocol]\n✓ [Tracking setup]\n\n**Next Play**\n1. [First upsell to implement]\n2. [A/B test framework]\n3. [Performance benchmarks to track]\n\nDo not use emojis. Focus on natural, non-pushy upsells."
  },
  {
    id: "reviewbooster",
    title: "Review Booster",
    emoji: "⭐",
    category: "Store",
    description: "Turn customer words into conversion weapons. Collect, organize, and repurpose testimonials into ad copy, landing pages, and social proof.",
    isPro: true,
    kbRequirement: "required",
    inputs: [
      { id: "reviews", label: "Customer Reviews / Testimonials", type: "textarea", placeholder: "Paste raw reviews or testimonials", required: true },
      { id: "productService", label: "Product / Service", type: "text", placeholder: "What the reviews are about", required: true },
      { id: "useCase", label: "Use Case", type: "multiselect", options: ["Ad copy", "Landing page", "Social media", "Email campaign", "Case study"], required: true },
      { id: "tone", label: "Desired Tone", type: "select", options: ["Authentic/Raw", "Polished", "Story-driven", "Results-focused"], defaultValue: "Authentic/Raw", required: false }
    ],
    promptTemplate: "Transform customer reviews into high-converting marketing assets for {productService}, use case: {useCase}, tone: {tone}.\n\nRaw reviews:\n{reviews}\n\nUse this exact structure:\n\n**Review Analysis**\n\n**Sentiment Breakdown:**\n- Overall satisfaction: [Rating/10]\n- Key themes: [3-5 recurring themes]\n- Strongest selling points: [What customers love most]\n- Objection handling: [What concerns were overcome]\n\n**Power Phrases Extracted:**\n\nList 10-15 quotable lines from reviews:\n- \"[Powerful quote 1]\"\n- \"[Powerful quote 2]\"\n- \"[Powerful quote 3]\"\n[...]\n\n**Marketing Asset Library**\n\n**For Ad Copy:**\n\n**Headline Options (3):**\n1. [Review-inspired headline]\n2. [Alternative angle]\n3. [Results-focused hook]\n\n**Body Copy (2 variations):**\n\nVariation A:\n[2-3 lines weaving review insights into persuasive copy]\n\nVariation B:\n[Alternative approach]\n\n**For Landing Page:**\n\n**Hero Section:**\n- Headline: [Review-backed statement]\n- Subheadline: [Supporting testimonial quote]\n\n**Social Proof Section:**\n- Testimonial cards: [3 formatted testimonials with names/results]\n- Stat callouts: [\"X% of customers saw Y result\"]\n\n**Objection Crusher Section:**\n[Address common hesitations using review insights]\n\n**For Social Media:**\n\n**Post #1 – [Format: Story/Quote/Result]**\n[Caption using review content]\n\n**Post #2**\n[Different angle]\n\n**Post #3**\n[Alternative format]\n\n**For Email Campaign:**\n\n**Subject Line Options:**\n1. [Review-inspired subject]\n2. [Alternative]\n3. [Third option]\n\n**Email Body:**\n[Short email featuring customer story/results]\n\n**Case Study Framework:**\n\n[If \"Case study\" is selected in useCase:]\n\n**Title:** [Customer name/type] achieved [result]\n\n**Challenge:** [What problem they had]\n\n**Solution:** [How {productService} helped]\n\n**Results:** [Specific outcomes with numbers]\n\n**Quote:** \"[Most impactful testimonial]\"\n\n**Review Collection Strategy**\n\n**How to Get More Reviews:**\n1. [Timing: when to ask]\n2. [Method: email, SMS, in-app]\n3. [Incentive: what to offer]\n\n**Questions to Ask:**\n- [Question 1 that generates great responses]\n- [Question 2]\n- [Question 3]\n\n**Next Play**\n1. [First asset to deploy]\n2. [Where to use it]\n3. [How to systematize review collection]\n\nDo not use emojis. Keep testimonials authentic."
  },
  {
    id: "focusmode",
    title: "Focus Mode AI",
    emoji: "🎧",
    category: "Productivity",
    description: "Deep work on demand, distractions deleted. Build personalized focus sessions that match your energy and goals.",
    isPro: true,
    kbRequirement: "optional",
    inputs: [
      { id: "task", label: "Task / Project", type: "text", placeholder: "What you need to focus on", required: true },
      { id: "duration", label: "Session Duration", type: "select", options: ["25 min (Pomodoro)", "50 min", "90 min (Deep work)", "2 hours", "Custom"], defaultValue: "50 min", required: true },
      { id: "energyLevel", label: "Current Energy Level", type: "select", options: ["High", "Medium", "Low"], defaultValue: "Medium", required: false },
      { id: "distractions", label: "Main Distractions", type: "multiselect", options: ["Phone/notifications", "Email", "Social media", "People/environment", "Mental fatigue", "Perfectionism"], required: false },
      { id: "timeOfDay", label: "Time of Day", type: "select", options: ["Morning", "Afternoon", "Evening", "Late night"], required: false }
    ],
    promptTemplate: "Design personalized deep work session for {task}, duration: {duration}, energy: {energyLevel}, time: {timeOfDay}, distractions: {distractions}.\n\nUse this exact structure:\n\n**Focus Session Plan**\n\n**Session Overview**\n- Task: {task}\n- Duration: {duration}\n- Optimal timing: {timeOfDay}\n- Energy optimization: {energyLevel} → [Strategy]\n\n**Pre-Session Setup (5 min)**\n\n**Environment:**\n- [Workspace preparation]\n- [Device management]\n- [Distraction blocking]\n\n**Mental Prep:**\n- [Quick mindset shift technique]\n- [Clarity exercise]\n\n**Tools to Block/Enable:**\n- Block: [Apps, websites, notifications]\n- Enable: [What you need access to]\n\n**Session Structure**\n\n[If Pomodoro:]\n**Block 1 (25 min):**\n- Focus: [Specific subtask]\n- Break (5 min): [What to do]\n\n**Block 2 (25 min):**\n- Focus: [Next subtask]\n- Break (5 min): [Rest activity]\n\n[If Deep work (90 min):]\n**Warm-up (15 min):**\n[Ease into work]\n\n**Peak Focus (60 min):**\n[Core deep work]\n\n**Wind-down (15 min):**\n[Wrap-up and organize]\n\n**Distraction Management**\n\n[For each distraction in {distractions}:]\n\n**[Distraction name]:**\n- Why it pulls you away: [Psychology]\n- Counter-strategy: [Specific tactic]\n- If it happens: [Recovery protocol]\n\n**Energy Optimization**\n\n**For {energyLevel} energy:**\n- Music/sound: [Recommendation: silence, lo-fi, binaural, etc.]\n- Breaks: [Type and timing]\n- Physical: [Posture, movement, hydration]\n- Snacks: [If needed for sustained focus]\n\n**Focus Checkpoints**\n\nSet 3 micro-check-ins during session:\n1. [Time]: \"Am I still on task?\"\n2. [Time]: \"Am I working on the highest-priority item?\"\n3. [Time]: \"Do I need a reset or am I in flow?\"\n\n**Post-Session Protocol**\n\n**Immediate (5 min):**\n- [Capture any open loops]\n- [Log what you accomplished]\n- [Note energy level]\n\n**Recovery:**\n- [What to do after session ends]\n- [How long to rest before next session]\n\n**Progress Tracking**\n\nTrack these metrics:\n- Actual focus time: [X min]\n- Distractions: [Count]\n- Output quality: [1-10]\n- Energy after: [1-10]\n\n**Next Play**\n1. [Implement this session structure]\n2. [Track results for 3 days]\n3. [Adjust based on what works]\n\nDo not use emojis. Keep it practical and psychology-backed."
  },
  {
    id: "workflowwizard",
    title: "Workflow Wizard",
    emoji: "⚡",
    category: "Productivity",
    description: "Connect your tools, automate your life. Create, schedule, and manage cross-platform automations without code.",
    isPro: true,
    kbRequirement: "optional",
    inputs: [
      { id: "workflowGoal", label: "Workflow Goal", type: "text", placeholder: "e.g., Automate lead follow-ups, social media scheduling", required: true },
      { id: "toolsUsed", label: "Tools / Platforms Used", type: "textarea", placeholder: "List your current tools (e.g., Gmail, Notion, Slack, Shopify)", required: true },
      { id: "triggerEvent", label: "Trigger Event", type: "text", placeholder: "What starts the workflow? (e.g., New email, form submission)", required: true },
      { id: "desiredOutcome", label: "Desired Outcome", type: "text", placeholder: "What should happen at the end?", required: true },
      { id: "frequency", label: "Frequency", type: "select", options: ["Real-time", "Hourly", "Daily", "Weekly", "On-demand"], defaultValue: "Real-time", required: false }
    ],
    promptTemplate: "Design automation workflow for {workflowGoal}, tools: {toolsUsed}, trigger: {triggerEvent}, outcome: {desiredOutcome}, frequency: {frequency}.\n\nUse this exact structure:\n\n**Automation Workflow Blueprint**\n\n**Workflow Summary**\n- Goal: {workflowGoal}\n- Trigger: {triggerEvent}\n- End result: {desiredOutcome}\n- Run frequency: {frequency}\n\n**Workflow Architecture**\n\n**Step 1: Trigger**\n- Event: {triggerEvent}\n- Platform: [Where trigger happens]\n- Conditions: [When to activate]\n\n**Step 2: [Action Name]**\n- Tool: [Platform]\n- Action: [What happens]\n- Data passed: [What info moves forward]\n\n**Step 3: [Action Name]**\n- Tool: [Platform]\n- Action: [What happens]\n- Logic: [Any conditional branching]\n\n[Continue for all steps...]\n\n**Final Step: [Outcome]**\n- Result: {desiredOutcome}\n- Confirmation: [How you'll know it worked]\n\n**Implementation Guide**\n\n**Recommended Automation Tool:**\n[Zapier / Make / n8n / Built-in integrations]\n\n**Setup Instructions:**\n\n1. **Connect accounts:**\n   - [Tool 1]: [What permissions needed]\n   - [Tool 2]: [Setup notes]\n\n2. **Configure trigger:**\n   - [Specific settings]\n   - [Filters to apply]\n\n3. **Build action sequence:**\n   - [Step-by-step configuration]\n\n4. **Add error handling:**\n   - [What to do if step fails]\n   - [Notification setup]\n\n5. **Test workflow:**\n   - [How to test safely]\n   - [What to check]\n\n**Data Mapping**\n\nHow data flows between tools:\n- [Field 1] from [Tool A] → [Field 2] in [Tool B]\n- [Field 3] from [Tool A] → [Field 4] in [Tool C]\n\n**Conditional Logic**\n\n[If workflow has branching:]\n\n**If [condition]:**\n- Then: [Action path A]\n\n**Else:**\n- Then: [Action path B]\n\n**Optimization Tips**\n\n1. [Performance improvement 1]\n2. [Cost-saving tip]\n3. [Reliability enhancement]\n\n**Error Handling**\n\n**Common Issues:**\n- [Issue 1]: [Solution]\n- [Issue 2]: [Solution]\n\n**Monitoring:**\n- [What to track]\n- [Alert setup]\n\n**Workflow Variations**\n\n**Alternative Version 1:**\n[Different approach to same goal]\n\n**Alternative Version 2:**\n[Third option if primary fails]\n\n**Time Saved**\n\nEstimated time savings:\n- Manual process: [X min/day]\n- Automated: [Y min/day]\n- Total saved: [Z hours/month]\n\n**Next Play**\n1. [Set up primary workflow]\n2. [Test with real data]\n3. [Monitor for 7 days, then optimize]\n\nDo not use emojis. Keep instructions platform-agnostic."
  }
];