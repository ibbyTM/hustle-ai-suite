import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const inputs = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY is not configured');

    const utmParams = `?utm_source=newsletter&utm_medium=email&utm_campaign=${inputs.utm_campaign}`;
    const ctaFullUrl = inputs.cta_url ? `${inputs.cta_url}${inputs.cta_url.includes('?') ? '&' : '?'}utm_source=newsletter&utm_medium=email&utm_campaign=${inputs.utm_campaign}` : '';

    const prompt = `Generate a newsletter with these specs:
Issue Topic: ${inputs.issue_topic}
Audience: ${inputs.audience_segment || 'general audience'}
Goal: ${inputs.goal}
Tone: ${inputs.tone}
Subject Count: ${inputs.subject_count}
CTA: ${inputs.cta_button_text || 'Reply to this email'} - ${ctaFullUrl || 'inline reply'}
Length: ${inputs.length_target}
Personalization: ${inputs.personalization ? 'Yes' : 'No'}
A/B Testing: ${inputs.ab_test_enabled ? 'Yes' : 'No'}

Return valid JSON with: subject_options, preheader, plain_text, html_snippet, cta_button_text_options, cta_full_url, ab_test_pairs, send_time_suggestion, metric_to_track, follow_up_plan, used_kb_facts, generation_notes`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: 'You are a newsletter generation engine. Always respond with valid JSON only.' },
          { role: 'user', content: prompt }
        ],
      }),
    });

    if (!response.ok) throw new Error(`AI error: ${response.status}`);
    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.content);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
