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
    const { 
      businessName, 
      tagline, 
      brandStyle, 
      colorPalette, 
      iconPreference, 
      outputFormat,
      variationIndex = 1 
    } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Layout-specific instructions
    let layoutInstruction = '';
    if (outputFormat === 'Square Logo') {
      layoutInstruction = 'Use a balanced, square composition with the mark and text arranged symmetrically.';
    } else if (outputFormat === 'Horizontal Logo') {
      layoutInstruction = 'Create a horizontal layout with the icon on the left and brand name on the right, emphasizing width over height.';
    } else if (outputFormat === 'Icon Only') {
      layoutInstruction = 'Design only the icon/mark without any text - a standalone symbol that represents the brand.';
    }

    const basePrompt = `Generate a high-resolution 1024×1024 PNG logo with a fully transparent background.

Business Name: "${businessName}"
${tagline ? `Tagline: "${tagline}"` : ''}
Style: ${brandStyle}
${colorPalette ? `Color Palette: ${colorPalette}` : ''}
${iconPreference ? `Icon Inspiration: ${iconPreference}` : ''}

Layout: ${outputFormat}
${layoutInstruction}

Requirements:
- Output MUST be 1024×1024 pixels
- Background MUST be fully transparent (PNG format)
- Design should be clean, modern, professional, and brand-ready
- Suitable for use on both light and dark backgrounds
${variationIndex > 1 ? `\nThis is variation ${variationIndex} - create a unique alternative design approach.` : ''}`;

    console.log(`Generating logo variation ${variationIndex} for: ${businessName}`);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-image-preview',
        messages: [
          { role: 'user', content: basePrompt }
        ],
        modalities: ['image', 'text']
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
    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!imageUrl) {
      throw new Error('No image generated from AI');
    }

    console.log('Successfully generated logo');

    return new Response(
      JSON.stringify({ imageUrl }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-logo function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
