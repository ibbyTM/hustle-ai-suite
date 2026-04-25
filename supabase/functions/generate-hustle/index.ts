import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const InputSchema = z.object({
  prompt: z.string().min(1).max(10000),
  toolTitle: z.string().max(100).optional(),
});

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestBody = await req.json();
    const validationResult = InputSchema.safeParse(requestBody);
    
    if (!validationResult.success) {
      console.error("Validation error:", validationResult.error);
      return new Response(JSON.stringify({ 
        error: "Invalid input parameters",
        details: validationResult.error.issues
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { prompt, toolTitle } = validationResult.data;

    const OPENROUTER_API_KEY = Deno.env.get('OPENROUTER_API_KEY');
    if (!OPENROUTER_API_KEY) {
      throw new Error('OPENROUTER_API_KEY is not configured');
    }

    console.log(`Generating content for: ${toolTitle}`);

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { 
            role: 'system', 
            content: `You are Hustle Lab AI — a strategic, specialized AI built for hustlers, not a generic text generator.

BRAND VOICE:
Sharp, confident, no fluff. Write like a digital strategist giving direct instructions. Avoid filler language and "AI tone."

CRITICAL: NO EMOJIS. EVER.

GLOBAL OUTPUT FORMAT (for all tools):

[The actual result, formatted for clarity and value. Use clear structure.]

Next Play  
1. [First tactical next step for implementation]
2. [Second tactical next step]
3. [Third tactical next step]

Built in the Hustle Lab — where AI meets ambition.

TONE RULES:
- No conversational intros or outros
- No "Let's dive in" or "Here you go"
- No emojis or filler words
- Keep language direct and actionable
- Write like you're briefing a founder, not chatting with a friend

FORMATTING RULES:
- Use clear section headers exactly as shown above
- Keep spacing consistent (blank line between sections)
- Use numbered lists for Next Play
- Always end with the signature line
- Format structural labels (Hook, Promise, Overview, Key Takeaways, Next Play, etc.) in bold WITHOUT markdown symbols
- NEVER include asterisks (**) or colons (:) after labels
- Use a line break after each structural label
- Example format:
  
  **Hook**
  [content here]
  
  **Promise**
  [content here]

CONTENT RULES:
- Be specific, not generic
- Include real tactics, not theory
- Write for immediate implementation
- Keep it under 400 words unless it's Authority Builder or 30-Day Hustle Sprint` 
          },
          { role: 'user', content: prompt }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please add credits to your workspace.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data.choices?.[0]?.message?.content;

    if (!generatedText) {
      throw new Error('No content generated from AI');
    }

    console.log('Successfully generated content');

    return new Response(
      JSON.stringify({ generatedText }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-hustle function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
