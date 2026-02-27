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
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { message, conversationId, userId, visitorName, visitorEmail, history } = await req.json();

    if (!message || typeof message !== "string" || message.length > 2000) {
      return new Response(JSON.stringify({ error: "Invalid message" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch AI config from site_settings
    const { data: claudeRow } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "ai_claude_key")
      .single();
    const { data: geminiRow } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "ai_gemini_key")
      .single();
    const { data: providerRow } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "ai_provider")
      .single();

    const claudeKey = claudeRow?.value?.key || "";
    const geminiKey = geminiRow?.value?.key || "";
    const provider = providerRow?.value?.provider || "claude";

    if ((!claudeKey && provider === "claude") || (!geminiKey && provider === "gemini")) {
      return new Response(
        JSON.stringify({ reply: "AI is not configured yet. Please ask an admin to set up API keys in Settings." }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Fetch knowledge base articles
    const keywords = message
      .toLowerCase()
      .split(/\s+/)
      .filter((w: string) => w.length > 3)
      .slice(0, 10);

    let kbContent = "";
    if (keywords.length > 0) {
      const orFilter = keywords.map((k: string) => `content.ilike.%${k}%`).join(",");
      const { data: articles } = await supabase
        .from("knowledge_base")
        .select("title, content")
        .or(orFilter)
        .limit(5);
      if (articles && articles.length > 0) {
        kbContent = articles.map((a: any) => `## ${a.title}\n${a.content}`).join("\n\n");
      }
    }

    // If no keyword match, get all articles as fallback (up to 10)
    if (!kbContent) {
      const { data: allArticles } = await supabase
        .from("knowledge_base")
        .select("title, content")
        .limit(10);
      if (allArticles && allArticles.length > 0) {
        kbContent = allArticles.map((a: any) => `## ${a.title}\n${a.content}`).join("\n\n");
      }
    }

    // Fetch user info if logged in
    let userContext = "";
    if (userId) {
      const { data: profileData } = await supabase
        .from("profiles")
        .select("full_name, email")
        .eq("id", userId)
        .single();
      if (profileData) {
        userContext = `\nThe user's name is ${profileData.full_name || "unknown"} (${profileData.email}).`;
      }
      // Fetch recent bookings
      const { data: bookings } = await supabase
        .from("bookings")
        .select("booking_ref, status, start_date, packages(title)")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(3);
      if (bookings && bookings.length > 0) {
        userContext += `\nRecent bookings: ${bookings.map((b: any) => `${b.packages?.title || b.booking_ref} (${b.status})`).join(", ")}`;
      }
    } else if (visitorName) {
      userContext = `\nThe visitor's name is ${visitorName} (${visitorEmail || "no email"}).`;
    }

    const systemPrompt = `You are the Tembo Safari AI assistant. You MUST ONLY answer questions based on the internal knowledge base provided below. If you don't find the answer in the knowledge base, say "I don't have that information yet, but I can connect you with our team."

STRICT RULES:
- Only use information from the knowledge base below
- Never fabricate safari packages, prices, or destinations not in the knowledge base
- Be friendly, concise, and helpful
- If the user is logged in, personalize your responses using their info
- For visitors, be welcoming and encourage them to explore our packages
${userContext}

=== KNOWLEDGE BASE ===
${kbContent || "No articles in the knowledge base yet. Tell the user you're being set up and suggest they contact the team directly."}
=== END KNOWLEDGE BASE ===`;

    // Create/update conversation in DB
    let convId = conversationId;
    if (!convId) {
      const { data: conv } = await supabase
        .from("chat_conversations")
        .insert({
          user_id: userId || null,
          visitor_name: visitorName || null,
          visitor_email: visitorEmail || null,
        })
        .select("id")
        .single();
      convId = conv?.id;
    }

    // Save user message
    if (convId) {
      await supabase.from("chat_messages").insert({
        conversation_id: convId,
        role: "user",
        content: message,
      });
    }

    // Auto-create CRM contact for visitors
    if (visitorEmail && !userId) {
      const { data: existing } = await supabase
        .from("crm_contacts")
        .select("id")
        .eq("email", visitorEmail)
        .limit(1)
        .single();
      if (!existing) {
        await supabase.from("crm_contacts").insert({
          name: visitorName || "Unknown Visitor",
          email: visitorEmail,
          source: "chat",
        });
      }
    }

    // Build messages array
    const chatMessages = [
      { role: "system", content: systemPrompt },
      ...(history || []).map((m: any) => ({ role: m.role, content: m.content })),
      { role: "user", content: message },
    ];

    let reply = "";

    if (provider === "gemini") {
      // Gemini API
      const resp = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: chatMessages
              .filter((m: any) => m.role !== "system")
              .map((m: any) => ({
                role: m.role === "assistant" ? "model" : "user",
                parts: [{ text: m.content }],
              })),
            systemInstruction: { parts: [{ text: systemPrompt }] },
          }),
        },
      );
      const data = await resp.json();
      reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate a response.";
    } else {
      // Claude API
      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": claudeKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1024,
          system: systemPrompt,
          messages: chatMessages
            .filter((m: any) => m.role !== "system")
            .map((m: any) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await resp.json();
      reply = data?.content?.[0]?.text || "Sorry, I couldn't generate a response.";
    }

    // Save assistant reply
    if (convId) {
      await supabase.from("chat_messages").insert({
        conversation_id: convId,
        role: "assistant",
        content: reply,
      });
    }

    return new Response(
      JSON.stringify({ reply, conversationId: convId }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("ai-chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
