import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const PROMPT_ENGINEER_SYSTEM = `You are an expert wildlife and landscape photography prompt engineer specializing in African safari imagery. Given a subject description, create a single detailed image generation prompt that produces stunning, photorealistic results.

Your prompt MUST include ALL of the following:
- Camera model and lens (e.g., "Canon EOS R5 with 70-200mm f/2.8L IS III USM" or "Nikon Z9 with 400mm f/2.8 TC VR S")
- Focal length and aperture setting used for the shot
- Shooting angle and composition technique (e.g., "low angle, rule of thirds", "eye-level, leading lines", "bird's eye view")
- Lighting conditions with direction (e.g., "golden hour backlight with rim lighting", "dramatic side light at blue hour")
- Color palette and mood/atmosphere
- Environment and weather details (e.g., "dusty savanna with acacia trees", "misty morning over wetlands")
- Time of day
- Depth of field description
- Post-processing style (e.g., "National Geographic editorial style", "cinematic color grading with warm tones")

Output ONLY the prompt text as a single paragraph. No labels, no bullet points, no explanations.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      return new Response(JSON.stringify({ error: "A prompt string is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) {
      return new Response(
        JSON.stringify({ error: "GEMINI_API_KEY is not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // ── Step 1: Craft a professional photography prompt ──
    console.log("Step 1: Crafting prompt from user input:", prompt);

    const promptResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: PROMPT_ENGINEER_SYSTEM }] },
          contents: [{ role: "user", parts: [{ text: prompt }] }],
        }),
      },
    );

    if (!promptResponse.ok) {
      const status = promptResponse.status;
      if (status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errText = await promptResponse.text();
      console.error("Prompt engineering error:", status, errText);
      return new Response(JSON.stringify({ error: "Failed to craft prompt" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const promptData = await promptResponse.json();
    const craftedPrompt = promptData.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!craftedPrompt) {
      console.error("No crafted prompt returned");
      return new Response(JSON.stringify({ error: "Failed to generate photography prompt" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Crafted prompt:", craftedPrompt.substring(0, 200) + "...");

    // ── Step 2: Generate image with Imagen 3 ──
    console.log("Step 2: Generating image with Imagen 3");

    const imageResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          instances: [{ prompt: craftedPrompt }],
          parameters: { sampleCount: 1, aspectRatio: "16:9" },
        }),
      },
    );

    if (!imageResponse.ok) {
      const status = imageResponse.status;
      if (status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errText = await imageResponse.text();
      console.error("Image generation error:", status, errText);
      return new Response(JSON.stringify({ error: "Image generation failed" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const imageData = await imageResponse.json();
    const prediction = imageData.predictions?.[0];

    if (!prediction?.bytesBase64Encoded) {
      return new Response(JSON.stringify({ error: "No image was generated" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const mimeType = prediction.mimeType || "image/png";
    const imageUrl = `data:${mimeType};base64,${prediction.bytesBase64Encoded}`;

    return new Response(JSON.stringify({ image: imageUrl, crafted_prompt: craftedPrompt }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-gallery-image error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
