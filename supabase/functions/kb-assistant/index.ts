import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authenticate caller — must be admin or management
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseAuth = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );

    const { data: { user }, error: userError } = await supabaseAuth.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check role using service role client
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .in("role", ["admin", "management"])
      .limit(1)
      .single();

    if (!roleData) {
      return new Response(JSON.stringify({ error: "Forbidden: admin or management role required" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { action, prompt, content, title, category, tags, documentText } = await req.json();

    if (!action || !["generate", "improve", "suggest", "from_document"].includes(action)) {
      return new Response(JSON.stringify({ error: "Invalid action. Use: generate, improve, suggest, from_document" }), {
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

    let systemPrompt = "";
    let userPrompt = "";

    if (action === "generate") {
      systemPrompt = `You are a knowledge base content writer for a safari tour company called Tembo Safari. Generate professional, informative articles for the internal knowledge base that helps both customers (via AI chatbot) and staff.

When generating an article, you MUST call the "save_article" function with the structured article data. The article should be comprehensive, well-organized, and accurate for a safari/travel business context.

Categories to choose from: FAQ, Destinations, Policies, Safety, Wildlife, Accommodation, Transportation, Booking, General`;

      userPrompt = prompt || "Write a general article about safari experiences";
    } else if (action === "improve") {
      systemPrompt = `You are a professional editor for a safari tour company's knowledge base. Improve the given article content to be more comprehensive, better organized, professional, and informative. Keep the same topic but enhance clarity, add useful details, and improve structure.

You MUST call the "save_article" function with the improved article data.`;

      userPrompt = `Please improve this article:\n\nTitle: ${title || "Untitled"}\nCategory: ${category || "General"}\nTags: ${(tags || []).join(", ")}\n\nContent:\n${content || "No content provided"}`;
    } else if (action === "from_document") {
      systemPrompt = `You are a knowledge base content processor for a safari tour company called Tembo Safari. You receive raw document text and must extract and organize the key information into a well-structured knowledge base article.

IMPORTANT: Only improve and clean up the content when strictly necessary. Preserve the original meaning, facts, and style as much as possible. Focus on organizing the content logically with clear sections rather than rewriting it.

You MUST call the "save_article" function with the structured article data.

Categories to choose from: FAQ, Destinations, Policies, Safety, Wildlife, Accommodation, Transportation, Booking, General`;

      userPrompt = `Process this document into a knowledge base article. Keep the content as close to the original as possible, only restructuring and cleaning up when necessary:\n\n${documentText || "No document text provided"}`;
    } else if (action === "suggest") {
      // Fetch existing articles to analyze gaps
      const { data: existingArticles } = await supabase
        .from("knowledge_base")
        .select("title, category, tags");

      const existingList = (existingArticles || [])
        .map((a: any) => `- ${a.title} [${a.category || "uncategorized"}]`)
        .join("\n");

      systemPrompt = `You are a knowledge base strategist for a safari tour company called Tembo Safari. Analyze the existing articles and suggest 5-8 new topics that are missing and would be valuable for both customers and staff.

You MUST call the "suggest_topics" function with your suggestions.

Consider topics like: visa/travel requirements, packing lists, health & vaccinations, cancellation policies, payment info, wildlife guides, seasonal guides, accommodation details, transportation, safety protocols, cultural etiquette, photography tips, group booking info, etc.`;

      userPrompt = existingList
        ? `Here are the existing knowledge base articles:\n${existingList}\n\nWhat important topics are missing?`
        : "The knowledge base is empty. Suggest the most essential articles a safari tour company should have.";
    }

    // Build Gemini API request with function calling
    const isArticleAction = action === "generate" || action === "improve" || action === "from_document";

    const tools = isArticleAction
      ? [{
          functionDeclarations: [{
            name: "save_article",
            description: "Save or update a knowledge base article with structured data",
            parameters: {
              type: "object",
              properties: {
                title: { type: "string", description: "Article title" },
                content: { type: "string", description: "Full article content in plain text, well-structured with sections" },
                category: {
                  type: "string",
                  description: "Article category",
                  enum: ["FAQ", "Destinations", "Policies", "Safety", "Wildlife", "Accommodation", "Transportation", "Booking", "General"],
                },
                tags: { type: "array", items: { type: "string" }, description: "Relevant tags for the article" },
              },
              required: ["title", "content", "category", "tags"],
            },
          }],
        }]
      : [{
          functionDeclarations: [{
            name: "suggest_topics",
            description: "Return suggested knowledge base topics",
            parameters: {
              type: "object",
              properties: {
                suggestions: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      title: { type: "string", description: "Suggested article title" },
                      description: { type: "string", description: "Brief description of what this article should cover" },
                      category: { type: "string", description: "Suggested category" },
                      priority: { type: "string", enum: ["high", "medium", "low"], description: "How important this article is" },
                    },
                    required: ["title", "description", "category", "priority"],
                  },
                },
              },
              required: ["suggestions"],
            },
          }],
        }];

    const toolConfig = {
      functionCallingConfig: {
        mode: "ANY",
        allowedFunctionNames: [isArticleAction ? "save_article" : "suggest_topics"],
      },
    };

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemPrompt }] },
          contents: [{ role: "user", parts: [{ text: userPrompt }] }],
          tools,
          toolConfig,
        }),
      },
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errText = await response.text();
      console.error("Gemini API error:", response.status, errText);
      return new Response(JSON.stringify({ error: "AI request failed" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiData = await response.json();
    const parts = aiData.candidates?.[0]?.content?.parts;
    const functionCall = parts?.find((p: any) => p.functionCall)?.functionCall;

    if (!functionCall?.args) {
      return new Response(JSON.stringify({ error: "AI did not return structured data" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const parsed = functionCall.args;

    if (action === "suggest") {
      return new Response(JSON.stringify({ suggestions: parsed.suggestions }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // For generate/improve/from_document, return the article data
    return new Response(JSON.stringify({ article: parsed }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("kb-assistant error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
