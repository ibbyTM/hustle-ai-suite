import { AutomationTool } from "@/types/automation";

export const automations: AutomationTool[] = [
  {
    id: "bookforge",
    title: "BookForge Outline",
    emoji: "📖",
    category: "Brand",
    description: "Generate a strategic ebook outline + cover image to guide your content creation",
    isPro: false,
    kbRequirement: "recommended",
    inputs: [
      { id: "topic", label: "Ebook Topic", type: "textarea", placeholder: "e.g., Social Media Marketing & Automation for Small Businesses", required: true },
      { id: "audience", label: "Target Audience", type: "text", placeholder: "e.g., small business owners, freelancers", required: true },
      { id: "voice", label: "Tone / Voice", type: "select", options: ["Authoritative", "Conversational", "Educational", "Inspirational"], defaultValue: "Authoritative", required: true },
      { id: "desiredLength", label: "Desired Length (words)", type: "number", placeholder: "10000", defaultValue: 10000, required: true, min: 1000, max: 50000 },
      { id: "chapterCount", label: "Chapter Count", type: "number", placeholder: "10", defaultValue: 10, required: false, min: 3, max: 30 },
      { id: "includeCTA", label: "Include CTA", type: "toggle", defaultValue: true, required: false },
      { id: "coverTitle", label: "Cover Title (override)", type: "text", placeholder: "Optional custom title", required: false },
      { id: "author", label: "Author Name", type: "text", placeholder: "Optional author name", required: false },
      { id: "includeCaseStudies", label: "Include case studies?", type: "toggle", defaultValue: false, required: false }
    ],
    promptTemplate: "SECTION_TYPE: {sectionType}\n\nGenerate {sectionType} for an ebook about {topic}, targeting {audience}, in a {voice} tone.\n\n{sectionInstructions}"
  },
  {
    id: "authority-builder",
    title: "Authority Builder Pro",
    emoji: "📚",
    category: "Brand",
    description: "Transform your outline into a complete 10,000-word ebook with intro, 10 chapters, and conclusion",
    isPro: false,
    kbRequirement: "optional",
    inputs: [
      { id: "topic", label: "Ebook Topic", type: "textarea", placeholder: "e.g., Social Media Marketing & Automation for Small Businesses", required: true },
      { id: "audience", label: "Target Audience", type: "text", placeholder: "e.g., small business owners, freelancers", required: true },
      { id: "voice", label: "Tone / Voice", type: "select", options: ["Authoritative", "Conversational", "Educational", "Inspirational"], defaultValue: "Authoritative", required: true },
      { id: "includeCTA", label: "Include CTA", type: "toggle", defaultValue: true, required: false }
    ],
    promptTemplate: "Generate full ebook content for {topic}, targeting {audience}, in a {voice} tone."
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
    id: "property-profiteer",
    title: "Property Profiteer",
    emoji: "🏠",
    category: "Hustle",
    description: "Analyse, pitch, and profit from any property deal",
    isPro: false,
    kbRequirement: "optional",
    inputs: [
      { id: "listingURL", label: "Listing URL", type: "url", placeholder: "Paste Rightmove / Zoopla / Zillow URL", required: false },
      { id: "objective", label: "Objective", type: "select", options: ["Deal analysis", "Marketing copy", "Investor summary"], required: true },
      { id: "propertyType", label: "Property Type", type: "text", placeholder: "e.g., 2-bed flat", required: true },
      { id: "location", label: "Location", type: "text", placeholder: "Location", required: true },
      { id: "askingPrice", label: "Asking Price / Guide", type: "text", placeholder: "Price", required: true },
      { id: "estimatedRent", label: "Estimated Rent", type: "text", placeholder: "Optional", required: false },
      { id: "targetROI", label: "Target ROI / Yield", type: "text", placeholder: "e.g., 8%", required: false },
      { id: "refurbEstimate", label: "Refurb Estimate", type: "text", placeholder: "Optional", required: false }
    ],
    promptTemplate: "Property analysis for {propertyType} in {location}, asking price: {askingPrice}, estimated rent: {estimatedRent}, target ROI: {targetROI}, refurb: {refurbEstimate}, objective: {objective}.\n\nProvide a complete analysis including: Deal Summary, Financial Breakdown, Market Insights, Risk Assessment, and Recommendation."
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
  }
];